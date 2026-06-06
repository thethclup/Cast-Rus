/**
 * ERC-8004 Trustless Agents Integration
 */

export interface AgentCard {
  name: string;
  description: string;
  version: string;
  wallets: Record<string, string>;
  services: any[];
}

export async function fetchAgentCard(): Promise<AgentCard | null> {
  try {
    const res = await fetch('/.well-known/agent-card.json');
    return await res.json();
  } catch (error) {
    console.error("Failed to load agent card", error);
    return null;
  }
}
