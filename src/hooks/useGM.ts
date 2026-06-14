import { useWriteContract, useAccount } from 'wagmi';

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
  }
] as const;

export function useGM() {
  const { writeContractAsync, isPending: isGMPending } = useWriteContract();
  const { isConnected } = useAccount();

  const sendGM = async () => {
    if (!isConnected) {
      alert('Please connect wallet first!');
      return;
    }
    // Wagmi auto-appends dataSuffix because we configured it in lib/wagmi.ts
    // We can just use writeContractAsync for the contract function
    return writeContractAsync({
      address: GM_CONTRACT_ADDRESS,
      abi: GAME_ABI,
      functionName: 'gm',
    });
  };

  const submitScore = async (score: number) => {
    if (!isConnected) {
      alert('Please connect wallet first!');
      return;
    }
    return writeContractAsync({
      address: GM_CONTRACT_ADDRESS,
      abi: GAME_ABI,
      functionName: 'recordScore',
      args: [BigInt(score)],
    });
  };

  return { sendGM, submitScore, isGMPending };
}
