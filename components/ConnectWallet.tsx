'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isReconnecting) return <div className="text-sm font-medium text-slate-500 animate-pulse">Reconnecting...</div>

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center w-full gap-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isConnecting}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all shadow-sm shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full font-mono text-sm border border-slate-200/60 font-medium">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      <button 
        onClick={() => disconnect()}
        className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
      >
        Disconnect
      </button>
    </div>
  )
}
