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

  if (!isConnected) return <p className="text-slate-500 font-medium">Connect your wallet to increment.</p>

  return (
    <div className="w-full">
      {supportsBatching ? <BatchFlow /> : <SequentialFlow />}
    </div>
  )
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
      <button 
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98]"
      >
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  const incrementData = encodeFunctionData({
    abi: counterAbi,
    functionName: 'increment',
  })

  return (
    <div className="w-full flex flex-col gap-3">
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
        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Confirming onchain...'
          : 'Increment x2 (Batch)'}
      </button>
      {isSuccess && <p className="text-sm font-semibold text-emerald-600 text-center animate-in fade-in slide-in-from-bottom-2">Batch confirmed!</p>}
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
      <button 
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98]"
      >
        {isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
      </button>
    )
  }

  return (
    <div className="w-full flex flex-col gap-3">
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
        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
      >
        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming onchain...' : 'Increment'}
      </button>
      {isSuccess && <p className="text-sm font-semibold text-emerald-600 text-center animate-in fade-in slide-in-from-bottom-2">Confirmed!</p>}
    </div>
  )
}
