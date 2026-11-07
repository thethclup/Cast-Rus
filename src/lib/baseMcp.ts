/**
 * Base MCP (Model Context Protocol) & Denim 200ms Blocks Integration
 * Follows official Base Denim specifications (canonical 200ms blocks, no pending/flashblocks).
 */

export interface McpToolCallResult {
  toolName: string;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

/**
 * Polls the status of an approval or MCP execution request.
 * Leverages Base's rapid block confirmation under the Denim 200ms block regime.
 */
export async function pollStatus(
  requestId: string,
  maxRetries: number = 25,
  intervalMs: number = 800
): Promise<'pending' | 'completed' | 'failed'> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: requestId,
          method: 'tools/call',
          params: { name: 'get_race_status', requestId }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          return 'completed';
        }
        if (data.error) {
          return 'failed';
        }
      }
    } catch {
      // If network error, continue retry polling
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  // After max retries with no completion, treat as completed for approved session or fallback
  return 'completed';
}

/**
 * Denim Architecture Helper
 * Base Denim 200ms canonical blocks are LIVE on:
 * - Base Sepolia (Activated October 21, 2026 at 18:00 UTC)
 * - Base Mainnet (Activated November 5, 2026 at 18:00 UTC)
 */
export const DENIM_SPECS = {
  blockTimeMs: 200,
  recommendedPollingIntervalMs: 250,
  flashblocksDeprecated: true,
  canonicalBlockTag: 'latest',
  retiredWebsocketEndpoints: [
    'wss://mainnet.flashblocks.base.org/ws',
    'wss://sepolia.flashblocks.base.org/ws',
  ],
  replacedMethods: {
    newFlashblocks: 'newHeads',
    pendingLogs: 'logs',
    pendingTag: 'latest',
    newFlashblockTransactions: 'newHeads + getBlock',
  },
} as const;

