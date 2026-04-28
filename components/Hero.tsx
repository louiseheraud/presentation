import type { Service } from '@/lib/types'

export default function Hero({ service }: { service: Service }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-400 p-7 text-white">
      <span className="text-5xl opacity-20 absolute right-6 top-1/2 -translate-y-1/2 select-none">
        {service.emoji}
      </span>
      <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wider uppercase mb-3">
        Session individuelle
      </div>
      <h1 className="text-2xl font-extrabold leading-tight mb-2">{service.tagline}</h1>
      <p className="text-sm text-white/85 leading-relaxed max-w-md">{service.description}</p>
    </div>
  )
}
