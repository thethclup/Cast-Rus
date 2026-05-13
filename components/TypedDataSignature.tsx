'use client'

import { useState } from 'react'
import { useSignTypedData, useAccount } from 'wagmi'

// Define the domain according to EIP-712
const domain = {
  name: 'My Base App',
  version: '1',
  chainId: 84532, // Base Sepolia
  verifyingContract: '0x0000000000000000000000000000000000000000' as const,
} as const

// Define the types
const types = {
  SpendPermission: [
    { name: 'account', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'allowance', type: 'uint160' },
    { name: 'period', type: 'uint48' },
    { name: 'start', type: 'uint48' },
    { name: 'end', type: 'uint48' },
    { name: 'salt', type: 'uint256' },
  ],
} as const

export function TypedDataSignature() {
  const { isConnected, address } = useAccount()
  const { signTypedData, data: signature, isPending, reset } = useSignTypedData()
  const [verificationResult, setVerificationResult] = useState<string | null>(null)

  if (!isConnected) return null

  const handleSign = () => {
    setVerificationResult(null)
    const now = Math.floor(Date.now() / 1000)
    
    signTypedData({
      domain,
      types,
      primaryType: 'SpendPermission',
      message: {
        account: address || '0x0000000000000000000000000000000000000000',
        spender: '0x1111111111111111111111111111111111111111',
        token: '0x2222222222222222222222222222222222222222',
        allowance: BigInt(1000000),
        period: now + 86400, // 1 day
        start: now,
        end: now + 30 * 86400, // 30 days
        salt: BigInt(Math.floor(Math.random() * 1000000)),
      },
    })
  }

  // A mock verification function for demonstration
  // In a real app, this would send to an API using viem's verifyTypedData
  const handleVerify = async () => {
    if (!signature) return
    setVerificationResult("Genişletilmiş doğrulama için API çağrısı yapılabilir. İmza: " + signature.slice(0, 20) + "...")
  }

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg max-w-lg w-full">
      <h2 className="text-xl font-semibold">EIP-712 Typed Data İmzalama</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Zincir dışı işlemler ve onchain izinler için yapılandırılmış verileri imzalayın.
      </p>
      
      {!signature ? (
        <button 
          onClick={handleSign}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'İmzalanıyor...' : 'İzin Verisi İmzala'}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded break-all text-xs border">
            <span className="font-bold block mb-1">İmza Hash:</span>
            {signature}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleVerify}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-1"
            >
              Doğrula (Simülasyon)
            </button>
            <button 
              onClick={() => reset()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex-1"
            >
              Sıfırla
            </button>
          </div>
          {verificationResult && (
            <p className="text-sm text-green-600 mt-2">{verificationResult}</p>
          )}
        </div>
      )}
    </div>
  )
}
