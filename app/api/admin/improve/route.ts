import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { text } = body

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 })
  }

  const { data: rules } = await supabase
    .from('rules')
    .select('text, order')
    .order('order', { ascending: true })

  const { data: examples } = await supabase
    .from('cv_examples')
    .select('label, before_text, after_text')
    .order('created_at', { ascending: true })

  const rulesText =
    rules && rules.length > 0
      ? rules.map((r, i) => `${i + 1}. ${r.text}`).join('\n')
      : '(aucune règle définie)'

  const examplesText =
    examples && examples.length > 0
      ? examples.map((ex) =>
          `--- Exemple : ${ex.label} ---\nAVANT :\n${ex.before_text}\n\nAPRÈS :\n${ex.after_text}`
        ).join('\n\n')
      : ''

  const systemPrompt = `Tu es un assistant spécialisé dans l'amélioration de CVs et lettres de motivation pour les candidatures aux grandes écoles françaises.

Voici les règles à appliquer impérativement :
${rulesText}
${examplesText ? `\nVoici des exemples de CVs avant/après correction pour t'aider à comprendre le style attendu :\n\n${examplesText}` : ''}

Réponds en JSON avec ce format exact :
{
  "rewritten": "le document réécrit complet",
  "changes": ["description du changement 1", "description du changement 2"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: text }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Unexpected response from Claude' }, { status: 500 })
  }

  let jsonText = content.text.trim()
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) jsonText = fenceMatch[1].trim()

  try {
    const result = JSON.parse(jsonText)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to parse Claude response', raw: jsonText }, { status: 500 })
  }
}
