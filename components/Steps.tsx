import type { Step } from '@/lib/types'

export default function Steps({ steps }: { steps: [Step, Step, Step, Step] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-sm font-bold text-gray-700 mb-4">Comment ça se passe ?</p>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 text-xs font-extrabold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">{step.bold}</strong>
              {step.rest}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
