# Cast Rush

Cast Rush is a fast-paced, chaotic endless runner designed for the Farcaster feed. Dash through trending casts, dodge toxic replies, and collect viral power-ups to become the feed legend.

## Gameplay
- **Endless Farcaster Runner:** Navigate an ever-changing feed of content.
- **On-Chain Integration:** Submit high scores via SIWE (Sign-In-With-Ethereum) on Base Mainnet.
- **Viral Mechanics:** Collect likes/reposts to enter Viral Mode.
- **Smart Agent Ready:** Built with support for ERC-8004 trustless agents.

## Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Game Engine:** Custom HTML5 Canvas implementation
- **Web3:** Wagmi, Viem (Base Mainnet)
- **Animations:** Framer Motion

## Deployment & Sensitive Configurations

### Environment Setup
To run this application, configure the following variables in your deployment environment.

Copy `.env.example` to `.env` locally (for development):
```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Required for Gemini AI features. |
| `APP_URL` | The URL where the app is hosted (e.g., Vercel URL). |

**⚠️ SECURITY WARNING:**
- Never commit the `.env` file to version control.
- Ensure your private keys, API secrets, and wallet mnemonics are stored securely in your deployment provider's secrets management system (e.g., Vercel Environment Variables, GitHub Secrets).

### Agent Integration
The application exposes endpoints required for ERC-8004 interoperability:
- **Agent Card:** `/.well-known/agent-card.json`
- **MCP Endpoint:** `/api/mcp`
- **Agent API:** `/api/agent`

Ensure these paths are publicly accessible on your deployed domain.

## License
Apache 2.0
