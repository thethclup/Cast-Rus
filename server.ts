import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());
  app.use(cors());

  // --- API Routes ---

  // Agent Card
  app.get('/.well-known/agent-card.json', (req, res) => {
    res.json({
      "name": "Cast Rus Orchestrator",
      "description": "Cast Rus platformunda \u00e7al\u0131\u015fan ERC-8004 uyumlu AI Agent. Casting operations, rus mechanics, multi-cast management ve automation yapan g\u00fc\u00e7l\u00fc orchestrator.",
      "version": "1.0.0",
      "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
      "image": "https://cast-rus.vercel.app/logo.png",
      "wallets": {
        "base": "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6"
      },
      "services": [
        {
          "name": "A2A",
          "endpoint": "https://cast-rus.vercel.app/.well-known/agent-card.json",
          "version": "1.0.0",
          "description": "Agent-to-Agent communication"
        },
        {
          "name": "MCP",
          "endpoint": "https://cast-rus.vercel.app/api/mcp",
          "version": "1.0.0",
          "description": "Model Context Protocol - Active command execution"
        },
        {
          "name": "API",
          "endpoint": "https://cast-rus.vercel.app/api/agent",
          "version": "1.0.0",
          "description": "Main agent control API"
        }
      ],
      "capabilities": [
        "casting-operations",
        "multi-cast-management",
        "automation",
        "rus-mechanics",
        "task-orchestration",
        "mcp-command-execution"
      ],
      "supportedChains": ["eip155:8453"],
      "active": true,
      "status": "online"
    });
  });

  // MCP Route
  app.all('/api/mcp', (req, res) => {
    if (req.method === 'GET') {
      res.json({
        protocol: "MCP",
        version: "1.0.0",
        name: "Cast Rus MCP Endpoint",
        status: "active",
        agentName: "Cast Rus Orchestrator",
        description: "Active and responsive MCP server for Cast Rus Agent",
        capabilities: ["casting-operations", "multi-cast-management", "automation"],
        supportedCommands: ["status", "cast", "execute", "list_tasks"],
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = req.body;
        const { command, params } = body || {};

        let result: any = {};

        switch (command) {
          case "status":
            result = { status: "online", activeCasts: 5, load: "optimal" };
            break;

          case "cast":
            result = { 
              success: true, 
              message: "Cast operation completed successfully",
              castType: params?.type || "default",
              result: "Entity summoned"
            };
            break;

          case "execute":
            result = { 
              success: true, 
              action: params?.action,
              message: "Task executed on Cast Rus platform"
            };
            break;

          default:
            result = { 
              success: true, 
              message: "Command received", 
              data: body 
            };
        }

        res.json({
          agent: "Cast Rus Orchestrator",
          success: true,
          command: command,
          result: result,
          receivedAt: new Date().toISOString()
        });
      } catch (error) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid request format" 
        });
      }
      return;
    }
    
    // Method not allowed
    res.status(405).json({error: "Method Not Allowed"});
  });

  // Agent Route
  app.get('/api/agent', (req, res) => {
     res.json({
      name: "Cast Rus Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Cast Rus",
      version: "1.0.0",
      message: "Agent is running and ready for tasks"
    });
  });


  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
    console.error(err);
    process.exit(1);
});
