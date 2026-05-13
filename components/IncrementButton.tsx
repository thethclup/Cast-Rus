'use client'

import { useEffect } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useQueryClient } from '@tanstack/react-query'
import { baseSepolia } from 'wagmi/chains'
import { config } from '@/config/wagmi'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

export function IncrementButton() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: readContractQueryOptions(config, {
          address: COUNTER_ADDRESS,
          abi: counterAbi,
          functionName: 'number',
          chainId: baseSepolia.id,
        }).queryKey,
      })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return (
      <button onClick={() => switchChain({ chainId: baseSepolia.id })}>
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() =>
          writeContract({
            address: COUNTER_ADDRESS,
            abi: counterAbi,
            functionName: 'increment',
            chainId: baseSepolia.id,
          })
        }
        disabled={isPending || isConfirming}
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Confirming...'
          : 'Increment'}
      </button>
      {isSuccess && <p>Transaction confirmed!</p>}
      {hash && (
        <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noreferrer">
          View on Basescan
        </a>
      )}
    </div>
  )
}
