import { useEffect, useState } from 'react';
import { pollStatus } from '../lib/baseMcp';

interface McpApprovalModalProps {
  approvalUrl: string;
  requestId: string;
  onCompleted: () => void;
  onFailed: () => void;
  onClose: () => void;
  onRetry?: () => void;
}

export function McpApprovalModal({ approvalUrl, requestId, onCompleted, onFailed, onClose, onRetry }: McpApprovalModalProps) {
  const [status, setStatus] = useState<"pending" | "completed" | "failed">("pending");
  
  useEffect(() => {
    let active = true;
    
    async function checkStatus() {
      const finalStatus = await pollStatus(requestId);
      if (active) {
        setStatus(finalStatus);
        if (finalStatus === 'completed') {
          onCompleted();
        } else {
          onFailed();
        }
      }
    }
    
    checkStatus();
    
    return () => { active = false; };
  }, [requestId, onCompleted, onFailed]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Approve Transaction</h2>
        
        {status === 'pending' && (
          <>
            <p className="text-slate-400 text-sm">
              Please open the link below to approve this action in your Base account. We are waiting for your confirmation...
            </p>
            <div className="animate-pulse flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 mb-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <a 
              href={approvalUrl} 
              target="_blank" 
              rel="noreferrer noopener"
              className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl font-bold transition-colors"
            >
              Approve in Base Account →
            </a>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-300">Transaction failed or was rejected.</p>
            <div className="flex w-full gap-2 mt-4">
              <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-white flex-1 py-3 rounded-xl font-bold transition-colors"
              >
                Close
              </button>
              {onRetry && (
                <button 
                  onClick={onRetry}
                  className="bg-blue-600 hover:bg-blue-500 text-white flex-1 py-3 rounded-xl font-bold transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </>
        )}

        {status === 'completed' && (
          <>
            <div className="text-green-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-300">Transaction completed successfully!</p>
            <button 
              onClick={onClose}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-xl font-bold transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
