import { useState } from 'react';
import { sendGMViaMcp, readGMCountViaMcp } from '../lib/baseMcp';
import { McpApprovalModal } from './McpApprovalModal';
import { useAccount } from 'wagmi';

export function AgentGMButton() {
  const [loading, setLoading] = useState(false);
  const [approvalState, setApprovalState] = useState<{ url: string; id: string } | null>(null);
  const [gmCount, setGmCount] = useState<number | null>(null);
  const { address } = useAccount();

  const handleAgentGM = async () => {
    setLoading(true);
    setApprovalState(null);
    try {
      const result = await sendGMViaMcp();
      if (result?.approvalUrl && result?.requestId) {
        setApprovalState({ url: result.approvalUrl, id: result.requestId });
      } else {
        alert('Invalid MCP response.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate agent GM.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleted = async () => {
    try {
      if (address) {
        const count = await readGMCountViaMcp(address);
        setGmCount(count);
      }
      alert('Agent successfully submitted GM transaction onchain!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFailed = () => {
    console.error("Agent MCP action failed");
  };

  const closeDialog = () => {
    setApprovalState(null);
  };

  return (
    <>
      <button 
        onClick={handleAgentGM}
        disabled={loading}
        className="py-3 px-6 bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20 font-bold rounded-xl active:scale-95 transition-all hover:bg-[#0052FF]/20 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {loading ? 'INITIATING...' : 'AGENT GM (MCP)'}
      </button>

      {approvalState && (
        <McpApprovalModal
          approvalUrl={approvalState.url}
          requestId={approvalState.id}
          onCompleted={handleCompleted}
          onFailed={handleFailed}
          onClose={closeDialog}
          onRetry={handleAgentGM}
        />
      )}
      
      {gmCount !== null && (
        <div className="text-sm text-center mt-2 text-slate-400 font-mono">
          Updated GM Count: {gmCount}
        </div>
      )}
    </>
  );
}
