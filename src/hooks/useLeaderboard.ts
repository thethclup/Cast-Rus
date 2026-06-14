import { useMemo } from 'react';
import { useReadContract } from 'wagmi';

const GM_CONTRACT_ADDRESS = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3';

const GAME_ABI = [
  {
    type: 'function',
    name: 'getTopPlayers',
    inputs: [{ name: 'n', type: 'uint256' }],
    outputs: [{ type: 'address[]' }, { type: 'uint256[]' }],
    stateMutability: 'view'
  }
] as const;

export function useLeaderboard(n: number = 10) {
  const { data: contractData, isLoading, isError } = useReadContract({
    address: GM_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: 'getTopPlayers',
    args: [BigInt(n)],
  });

  const leaderboard = useMemo(() => {
    if (!contractData) return [];
    const [addresses, scores] = contractData;
    return addresses.map((addr, idx) => ({
      address: addr,
      score: Number(scores[idx]),
    }));
  }, [contractData]);

  return { leaderboard, loading: isLoading, error: isError ? new Error('Failed') : null };
}
