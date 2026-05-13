import { ConnectWallet } from '@/components/ConnectWallet'
import { CounterDisplay } from '@/components/CounterDisplay'
import { BatchIncrement } from '@/components/BatchIncrement'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="flex flex-col items-center justify-center gap-8 bg-white p-10 sm:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-md w-full">
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Tally</h1>
          <p className="text-slate-500 text-sm font-medium">Onchain Counter on Base Sepolia</p>
        </div>
        
        <div className="w-full flex justify-center pb-8 border-b border-slate-100">
          <ConnectWallet />
        </div>

        <div className="flex flex-col items-center gap-8 w-full pt-2">
          <CounterDisplay />
          <BatchIncrement />
        </div>
      </div>
    </main>
  )
}
