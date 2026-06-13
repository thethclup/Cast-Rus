import { useReadContract, useAccount } from "wagmi";
import { GAME_CONTRACT_ADDRESS, GAME_ABI } from "../lib/contracts";

export function useScore() {
  const { address } = useAccount();

  const { data: gmCount, refetch: refetchGMCount, isLoading: isGMCountLoading } = useReadContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: "getGMCount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const { data: score, refetch: refetchScore, isLoading: isScoreLoading } = useReadContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: "getScore",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });
  
  const { data: topPlayers, isLoading: isLeaderboardLoading } = useReadContract({
    address: GAME_CONTRACT_ADDRESS,
    abi: GAME_ABI,
    functionName: "getTopPlayers",
    args: [10n],
  });

  return {
    gmCount,
    score,
    topPlayers,
    isGMCountLoading,
    isScoreLoading,
    isLeaderboardLoading,
    refreshStats: () => {
      refetchGMCount();
      refetchScore();
    }
  };
}
