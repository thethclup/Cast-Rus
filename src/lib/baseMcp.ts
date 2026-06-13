import { encodeFunctionData } from 'viem';
import { DATA_SUFFIX } from './erc8021';

const BASE_MCP_URL = 'https://mcp.base.org';
const GM_CONTRACT_ADDRESS = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3'; 

const GAME_ABI = [
  {
    type: 'function',
    name: 'gm',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'recordScore',
    inputs: [{ name: 'score', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getGMCount',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getScore',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTopPlayers',
    inputs: [{ name: 'n', type: 'uint256' }],
    outputs: [{ type: 'address[]' }, { type: 'uint256[]' }],
    stateMutability: 'view'
  }
] as const;

/**
 * A theoretical HTTP wrapper for Base MCP.
 * Assumes the agent or an intermediate backend can translate this REST wrapper 
 * into MCP's STDIO/SSE JSON-RPC format, or mcp.base.org exposes a restful proxy.
 */
async function callMcpTool(toolName: string, args: any) {
  const res = await fetch(`${BASE_MCP_URL}/v1/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: toolName, arguments: args })
  });
  
  if (!res.ok) {
    throw new Error(`MCP tool ${toolName} failed: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Sends a GM transaction via Base MCP's send_calls.
 * Appends the ERC-8021 dataSuffix manually.
 */
export async function sendGMViaMcp(playerAddress?: string) {
  const data = encodeFunctionData({ abi: GAME_ABI, functionName: 'gm' });
  const suffixHex = DATA_SUFFIX.slice(2); // strip 0x string
  const finalData = data + suffixHex;
  
  return callMcpTool('send_calls', {
    calls: [{
      to: GM_CONTRACT_ADDRESS,
      data: finalData,
      value: "0"
    }]
  });
}

/**
 * Submits a score transaction via Base MCP's send_calls.
 * Appends the ERC-8021 dataSuffix manually.
 */
export async function submitScoreViaMcp(playerAddress: string, score: number) {
  const data = encodeFunctionData({ abi: GAME_ABI, functionName: 'recordScore', args: [BigInt(score)] });
  const suffixHex = DATA_SUFFIX.slice(2);
  const finalData = data + suffixHex;
  
  return callMcpTool('send_calls', {
    calls: [{
      to: GM_CONTRACT_ADDRESS,
      data: finalData,
      value: "0"
    }]
  });
}

/**
 * Reads GM count via chain_rpc_request. Does not require a wallet.
 */
export async function readGMCountViaMcp(playerAddress: string): Promise<number> {
  const data = encodeFunctionData({ abi: GAME_ABI, functionName: 'getGMCount', args: [playerAddress as `0x${string}`] });
  
  const response = await callMcpTool('chain_rpc_request', {
    method: "eth_call",
    params: [{ to: GM_CONTRACT_ADDRESS, data }, "latest"],
    chain: "base"
  });
  
  if (!response?.result) return 0;
  return parseInt(response.result, 16);
}

/**
 * Reads user's score via chain_rpc_request.
 */
export async function readScoreViaMcp(playerAddress: string): Promise<number> {
  const data = encodeFunctionData({ abi: GAME_ABI, functionName: 'getScore', args: [playerAddress as `0x${string}`] });
  
  const response = await callMcpTool('chain_rpc_request', {
    method: "eth_call",
    params: [{ to: GM_CONTRACT_ADDRESS, data }, "latest"],
    chain: "base"
  });
  
  if (!response?.result) return 0;
  return parseInt(response.result, 16);
}

/**
 * Polls the request status until completed or failed.
 */
export async function pollStatus(requestId: string, intervalMs = 2000, timeoutMs = 60000): Promise<"completed" | "failed"> {
  const start = Date.now();
  
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await callMcpTool('get_request_status', { requestId });
      if (response.status === 'completed' || response.status === 'failed') {
        return response.status as "completed" | "failed";
      }
    } catch (err) {
      console.warn("Poll attempt failed: ", err);
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  return "failed";
}
