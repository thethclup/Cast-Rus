import { parseAbi } from "viem";

// Replace with actual deployed base mainnet contract address
export const GAME_CONTRACT_ADDRESS = "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3" as const;

export const GAME_ABI = parseAbi([
  "function gm() external",
  "function recordScore(uint256 score) external",
  "function getGMCount(address player) external view returns (uint256)",
  "function getScore(address player) external view returns (uint256)",
  "function getTopPlayers(uint256 n) external view returns (address[] memory, uint256[] memory)",
  "event GM(address indexed player, uint256 newCount)",
  "event ScoreRecorded(address indexed player, uint256 score)"
]);
