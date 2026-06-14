# Cast Rus Orchestrator

Cast Rus platformunda çalışan ERC-8004 uyumlu AI Agent. Casting operations, creative automation ve multi-cast management yapan akıllı orchestrator.

## Project Overview

Cast Rus is a blockchain-integrated platform designed for the Farcaster ecosystem, operating as an autonomous, creative, and strategic AI agent environment. With an Endless Farcaster Runner game built-in, players dash through trending casts, dodge toxic replies, and collect viral power-ups to dominate the feed.

The "Cast Rus Orchestrator" is an intelligent agent handling casting operations, creative automation, and multi-cast management to interact smoothly with the broader Farcaster content feeds.

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Interoperability:** MCP (Model Context Protocol) implemented for AI agent-to-agent communication
- **Onchain:** Base Mainnet compatibility with Wagmi & Viem (Chain ID: `eip155:8453`)

## Agent Capabilities & Skills

The Cast Rus Orchestrator supports the following core capabilities:
- `casting-operations`
- `creative-automation`
- `multi-cast-management`
- `content-generation`
- `strategic-orchestration`
- `mcp-command-execution`

### MCP Tools Available
- `get_race_status`: Get the current status of the race
- `start_race`: Start a new race on the Cast Rus platform
- `get_leaderboard`: Get the latest leaderboard
- `optimize_speed`: Optimize agent speed
- `get_track_info`: Details about the current race track

## Agent Registration Info

The agent follows the ERC-8004 specification for verifiable agent discovery. The configuration is served at:
- **Agent Card Endpoint:** `https://cast-rus.vercel.app/.well-known/agent-card.json`

Supported Services:
- **A2A**: Agent-to-Agent communication (`/.well-known/agent-card.json`)
- **MCP**: Model Context Protocol - Active command execution (`/api/mcp`)
- **API**: Main agent control API (`/api/agent`)

## MCP Connection Guide

To connect another agent to the Cast Rus Orchestrator via MCP:
1. Ensure your client supports MCP over HTTP POST.
2. Direct MCP calls to `https://cast-rus.vercel.app/api/mcp`.
3. Use the Standard MCP schema (`tools/list`, `tools/call`, etc.).

## How to Run Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Local API routes are available at:
- MCP Server: `http://localhost:3000/api/mcp`
- Agent API: `http://localhost:3000/api/agent`
- Agent Card: `http://localhost:3000/.well-known/agent-card.json`

## License
MIT License
