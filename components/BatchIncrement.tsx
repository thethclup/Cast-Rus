'use client'

import { useEffect } from 'react'
import {
  useSendCalls,
  useWaitForCallsStatus,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useQueryClient } from '@tanstack/react-query'
import { encodeFunctionData } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { config } from '@/config/wagmi'
import { useWalletCapabilities } from '@/hooks/useWalletCapabilities'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

const counterQueryKey = readContractQueryOptions(config, {
  address: COUNTER_ADDRESS,
  abi: counterAbi,
  functionName: 'number',
  chainId: baseSepolia.id,
}).queryKey

export function BatchIncrement() {
  const { isConnected } = useAccount()
  const { supportsBatching } = useWalletCapabilities()

  if (!isConnected) return <p>Connect your wallet first.</p>

  return supportsBatching ? <BatchFlow /> : <SequentialFlow />
}

function BatchFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data, sendCalls, isPending } = useSendCalls()
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({
    id: data?.id,
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
    }
  }, [isSuccess, queryClient])

  if (chainId !== baseSepolia.id) {
    return (
      <button onClick={() => switchChain({ chainId: baseSepolia.id })}>
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  const incrementData = encodeFunctionData({
    abi: counterAbi,
    functionName: 'increment',
  })

  return (
    <div>
      <button
        onClick={() =>
          sendCalls({
            calls: [
              { to: COUNTER_ADDRESS, data: incrementData },
              { to: COUNTER_ADDRESS, data: incrementData },
            ],
            chainId: baseSepolia.id,
          })
        }
        disabled={isPending || isConfirming}
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Confirming...'
          : 'Increment x2 (Batch)'}
      </button>
      {isSuccess && <p>Batch confirmed!</p>}
    </div>
  )
}

function SequentialFlow() {
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash })
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey })
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
      {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming...' : 'Increment'}
    </button>
  )
}
