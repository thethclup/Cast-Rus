# Cast Rus

Cast Rus is a blockchain-integrated platform designed for the Farcaster ecosystem, operating as an autonomous, creative, and strategic AI agent environment. With an Endless Farcaster Runner game built-in, players dash through trending casts, dodge toxic replies, and collect viral power-ups to dominate the feed.

## Gameplay & Features

- **Endless Farcaster Runner:** Navigate an ever-changing feed of content in real-time.
- **On-Chain Integration:** Submit high scores via SIWE (Sign-In-With-Ethereum) on the Base network.
- **Viral Mechanics:** Collect likes and reposts to enter Viral Mode for extra points.
- **ERC-8004 Agent Orchestrator:** Powered by the "Cast Rus Orchestrator" — an AI-powered smart agent that handles casting operations, creative automation, and multi-cast management.

## Technical Stack

- **Framework:** Next.js (App Router API routes) & Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Interoperability:** MCP (Model Context Protocol) implemented for AI agent-to-agent communication.
- **Web3:** Base Mainnet compatibility with Wagmi & Viem.

## Agent Orchestrator Endpoints

Cast Rus integrates a fully-functional Model Context Protocol (MCP) and ERC-8004 AI Agent. The endpoints exposed handle cross-agent interaction and dynamic automation:

- **Agent Card:** `/.well-known/agent-card.json`
- **MCP Action Server:** `/api/mcp`
- **General Agent Info:** `/api/agent`

The AI Agent automates creative tasks and responds gracefully to commands triggered on the Cast Rus platform.

## Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open `http://localhost:3000` to view the game and test the agent endpoints.

## License

MIT License
