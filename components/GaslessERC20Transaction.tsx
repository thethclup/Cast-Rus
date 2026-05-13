'use client'

import { useEffect, useState } from 'react'
import {
  useSendCalls,
  useWaitForCallsStatus,
  useAccount,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useQueryClient } from '@tanstack/react-query'
import { encodeFunctionData, parseAbi, parseUnits } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { config } from '@/config/wagmi'
import { useWalletCapabilities } from '@/hooks/useWalletCapabilities'
import { COUNTER_ADDRESS, counterAbi } from '@/config/counter'

// USDC on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

// This should typically come from your env setup or provider
// e.g. Coinbase Developer Platform Node URL
const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_API_KEY"

export function GaslessERC20Transaction() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data, sendCalls, isPending, error } = useSendCalls()
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({
    id: data?.id,
  })
  
  const queryClient = useQueryClient()
  const { supportsPaymaster, supportsBatching } = useWalletCapabilities()

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

  if (!isConnected) return null

  if (chainId !== baseSepolia.id) {
    return (
      <div className="flex flex-col gap-4 p-6 border rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold">ERC-20 Doğalgaz (Gas) Ödemesi</h2>
        <button 
          onClick={() => switchChain({ chainId: baseSepolia.id })}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {isSwitching ? 'Ağ Değiştiriliyor...' : 'Base Sepolia Ağına Geç (Test için)'}
        </button>
      </div>
    )
  }

  const handleTransaction = async () => {
    // A target contract call, e.g. increment counter
    const incrementData = encodeFunctionData({
      abi: counterAbi,
      functionName: 'increment',
    })

    const calls = [{ to: COUNTER_ADDRESS, data: incrementData }]

    // Instead of directly sending the call, we attach a paymasterService capability
    // with the 'erc20' context to request the paymaster to accept USDC
    sendCalls({
      calls,
      chainId: baseSepolia.id,
      capabilities: {
        paymasterService: {
          url: PAYMASTER_URL,
          // Specifying the ERC20 token for gas payments based on the Base docs
          // This uses standard ERC-7677 params if your provider supports it natively.
          // Note: Some abstractions might require custom formatting, but this handles the pm_getPaymasterData context.
          context: {
            erc20: USDC_ADDRESS
          }
        }
      } as any // The standard types might not include `context` strictly yet, so we cast to any
    })
  }

  return (
    <div className="flex flex-col gap-4 p-6 border border-purple-500/30 rounded-lg bg-purple-50/10 max-w-lg w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="text-purple-600">⛽</span> ERC-20 USDC ile Gas Ödemesi
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Bu işlem, Base Account üzerinden Paymaster kullanılarak ve ücretler standart ETH yerine <b>USDC</b> ile ödenerek gerçekleştirilir.
      </p>
      
      {!supportsPaymaster && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded text-xs">
          Cüzdanınız 'paymasterService' yeteneklerini raporlamıyor (ör. EOA kullanıyorsunuz).
          Lütfen Akıllı Cüzdan (Smart Wallet / Base Account) ile bağlanın.
        </div>
      )}

      <button
        onClick={handleTransaction}
        // Eğer EOA kullanılıyorsa buton engellenebilir, ama biz denemelerine izin verebiliriz veya paymaster desteği yoksa disabled yapabiliriz
        disabled={isPending || isConfirming || !supportsPaymaster}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
      >
        {isPending
          ? 'Cüzdanda Onay Bekleniyor...'
          : isConfirming
          ? 'Ağda Onaylanıyor...'
          : 'Increment (USDC ile Öde)'}
      </button>

      {error && (
        <p className="text-xs text-red-500 p-2 bg-red-50 border border-red-100 rounded break-words">
          {error.message}
        </p>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          İşlem başarıyla paymaster (USDC) ile ödendi ve onaylandı!
        </div>
      )}
    </div>
  )
}
