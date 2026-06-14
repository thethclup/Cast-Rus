import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div 
        className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded cursor-pointer hover:bg-white/10 transition-colors" 
        onClick={() => disconnect()}
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white">
          Base: {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    )
  }

  return (
    <div className="absolute top-6 right-6 z-50 flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="bg-[#0052FF] hover:bg-white hover:text-black text-[10px] text-white px-4 py-2 font-mono uppercase tracking-widest font-bold transition-colors"
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}
