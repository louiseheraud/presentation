import type { Service } from '@/lib/types'
import Hero from './Hero'
import Stats from './Stats'
import Steps from './Steps'
import CTA from './CTA'

export default function ServicePage({ service }: { service: Service }) {
  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-7 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-base font-bold text-gray-900">{service.title}</h2>
        <span className="bg-indigo-50 text-indigo-500 text-xs font-semibold px-3 py-1 rounded-full">
          {service.duration} · {service.format}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-7">
        <Hero service={service} />
        <Stats stats={service.stats} />
        <Steps steps={service.steps} />
        <CTA service={service} />
      </div>
    </div>
  )
}
