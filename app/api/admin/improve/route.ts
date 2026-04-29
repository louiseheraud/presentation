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

  const rulesText =
    rules && rules.length > 0
      ? rules.map((r, i) => `${i + 1}. ${r.text}`).join('\n')
      : '(aucune règle définie)'

  const systemPrompt = `Tu es un assistant spécialisé dans l'amélioration de CVs et lettres de motivation pour les candidatures aux grandes écoles françaises.

Voici les règles à appliquer impérativement :
${rulesText}

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

  const result = JSON.parse(content.text)
  return NextResponse.json(result)
}
