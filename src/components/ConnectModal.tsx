import { useConnect, useAccount, useDisconnect } from 'wagmi';

export function ConnectModal() {
  const { connectors, connect, isPending } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 py-2 px-4 rounded-xl">
        <span className="font-mono text-sm text-[#0052FF]">
          {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </span>
        <button 
          onClick={() => disconnect()}
          className="text-xs text-slate-400 hover:text-white uppercase tracking-wider uppercase font-bold"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-900 border border-slate-700 rounded-xl">
      <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 text-center">Connect Wallet</h3>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="bg-[#0052FF] hover:bg-white hover:text-black disabled:opacity-50 text-white px-4 py-3 font-mono text-sm uppercase tracking-widest font-bold transition-all rounded"
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
