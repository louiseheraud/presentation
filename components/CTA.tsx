import type { Service } from '@/lib/types'

export default function CTA({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-4">
      <a
        href={service.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
      >
        📅 Réserver un créneau
      </a>
      <a
        href={`mailto:${service.contactEmail}`}
        className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-5 py-3 rounded-xl border border-gray-200 transition-colors"
      >
        Des questions ?
      </a>
      <span className="text-xs text-gray-400">Créneau confirmé instantanément</span>
    </div>
  )
}
