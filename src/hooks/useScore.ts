import { useReadContract } from 'wagmi';

const GM_CONTRACT_ADDRESS = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3';

const GAME_ABI = [
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
  }
] as const;

export function useScore(playerAddress?: string) {
  const { data: gmCount, refetch: refetchGMCount } = useReadContract({
    address: GM_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: 'getGMCount',
    args: playerAddress ? [playerAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!playerAddress
    }
  });

  const { data: score, refetch: refetchScore } = useReadContract({
    address: GM_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: 'getScore',
    args: playerAddress ? [playerAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!playerAddress
    }
  });

  return { 
    gmCount: gmCount ? Number(gmCount) : 0, 
    score: score ? Number(score) : 0,
    refetch: () => {
      if (playerAddress) {
        refetchGMCount();
        refetchScore();
      }
    }
  };
}
