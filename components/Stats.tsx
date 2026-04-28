import type { Stat } from '@/lib/types'

export default function Stats({ stats }: { stats: [Stat, Stat, Stat] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
          <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
