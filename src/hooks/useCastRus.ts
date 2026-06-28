import { useReadContract, useAccount } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { useSendTransaction } from 'wagmi';
import { parseAbi, encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { DATA_SUFFIX_HEX } from '../lib/erc8021';

const CASTRUS_CONTRACT_ADDRESS = '0x2D7A93A2f25A55322A6F89aE9C20e990556Eef15';

const CASTRUS_ABI = parseAbi([
  'struct GameSession { address player; uint256 timestamp; bool survived; }',
  'function pullTrigger() external returns (bool)',
  'function getHistory(address player) external view returns (GameSession[])'
]);

export function useCastRus() {
  const { sendCallsAsync } = useSendCalls();
  const { sendTransactionAsync, isPending: isTxPending } = useSendTransaction();
  const { isConnected, address } = useAccount();

  const { data: history, refetch } = useReadContract({
    address: CASTRUS_CONTRACT_ADDRESS,
    abi: CASTRUS_ABI,
    functionName: 'getHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const pullTrigger = async () => {
    if (!isConnected) {
      alert('Please connect wallet first!');
      return;
    }

    const data = encodeFunctionData({
      abi: CASTRUS_ABI,
      functionName: 'pullTrigger',
    });

    try {
      await sendCallsAsync({
        calls: [{
          to: CASTRUS_CONTRACT_ADDRESS,
          data,
          value: 0n,
        }],
        capabilities: {
          dataSuffix: { value: DATA_SUFFIX_HEX, optional: true }
        }
      });
      console.log('pullTrigger sent via EIP-5792 sendCalls');
      setTimeout(() => refetch(), 2000);
    } catch (e) {
      console.log('sendCalls rejected or unsupported, falling back to sendTransaction', e);
      try {
        await sendTransactionAsync({
          to: CASTRUS_CONTRACT_ADDRESS,
          data: `${data}${DATA_SUFFIX_HEX}` as `0x${string}`,
          value: 0n,
          chainId: base.id,
        });
        setTimeout(() => refetch(), 5000);
      } catch (err) {
        console.error("Transaction failed", err);
      }
    }
  };

  return { pullTrigger, history, isPending: isTxPending };
}
