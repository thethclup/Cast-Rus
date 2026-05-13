'use client'

import { useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

export function CounterDisplay() {
  const { data: count, isLoading, isError } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterAbi,
    functionName: 'number',
    chainId: base.id,
  })

  if (isLoading && count === undefined) return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Current Count</span>
      <div className="h-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    </div>
  )
  if (isError && count === undefined) return <p className="text-red-500 font-medium">Failed to read contract</p>

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Current Count</span>
      <p className="text-7xl font-black text-slate-900 tabular-nums tracking-tighter leading-none">
        {count?.toString()}
      </p>
    </div>
  )
}
