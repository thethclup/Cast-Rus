'use client'

import { useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

export function CounterDisplay() {
  const { data: count, isLoading, isError } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterAbi,
    functionName: 'number',
    chainId: baseSepolia.id,
  })

  if (isLoading && count === undefined) return <p>Loading...</p>
  if (isError && count === undefined) return <p>Failed to read contract</p>

  return <p className="text-5xl font-bold">{count?.toString()}</p>
}
