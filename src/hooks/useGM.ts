import { useWriteContract } from "wagmi";
import { GAME_CONTRACT_ADDRESS, GAME_ABI } from "../lib/contracts";

export function useGM() {
  const { writeContract, isPending, data: hash, error } = useWriteContract();

  function sendGM() {
    writeContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: GAME_ABI,
      functionName: "gm",
    });
    // DATA_SUFFIX is injected automatically by wagmi config via dataSuffix
  }

  function submitScore(score: number) {
    writeContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: GAME_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
    });
    // DATA_SUFFIX is injected automatically by wagmi config via dataSuffix
  }

  return {
    sendGM,
    submitScore,
    isPending,
    hash,
    error,
  };
}
