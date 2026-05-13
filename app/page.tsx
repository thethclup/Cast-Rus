import { ConnectWallet } from '@/components/ConnectWallet'
import { CounterDisplay } from '@/components/CounterDisplay'
import { BatchIncrement } from '@/components/BatchIncrement'
import { IncrementButton } from '@/components/IncrementButton'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight">Onchain Tally</h1>
      
      <div className="w-full flex justify-center pb-4 border-b">
        <ConnectWallet />
      </div>

      <div className="flex flex-col items-center gap-6 p-6 border rounded-xl shadow-sm bg-gray-50/50 w-full max-w-lg">
        <CounterDisplay />
        <div className="flex gap-4">
          <IncrementButton />
          <BatchIncrement />
        </div>
      </div>
    </main>
  )
}
