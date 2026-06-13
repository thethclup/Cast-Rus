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

  // Agent Card (Serve directly)
  app.get('/.well-known/agent-card.json', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', '.well-known', 'agent-card.json'));
  });

  // MCP Route
  app.all('/api/mcp', (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (req.method === 'GET') {
      res.json({
        protocol: "MCP",
        version: "1.0.0",
        name: "Cast Rus MCP Endpoint",
        status: "active",
        description: "Active MCP server for Cast Rus Orchestrator Agent",
        capabilities: ["casting-operations", "creative-automation", "multi-cast-management"],
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = req.body || {};
        const { jsonrpc, id, method, params, action, command } = body;

        let result: any;

        if (jsonrpc === '2.0') {
          if (method === 'tools/list') {
            res.json({
              jsonrpc: "2.0",
              id: id,
              result: {
                tools: [
                  { name: "get_race_status", description: "Get the current status of the race", inputSchema: { type: "object", properties: {} } },
                  { name: "start_race", description: "Start a new race on the Cast Rus platform", inputSchema: { type: "object", properties: {} } },
                  { name: "get_leaderboard", description: "Get the latest leaderboard", inputSchema: { type: "object", properties: {} } },
                  { name: "optimize_speed", description: "Optimize agent speed", inputSchema: { type: "object", properties: {} } },
                  { name: "get_track_info", description: "Details about the current race track", inputSchema: { type: "object", properties: {} } },
                  { name: "web_request", description: "Base MCP web request tool for fetching data", inputSchema: { type: "object", properties: { url: { type: "string" } }, required: ["url"] } },
                  { name: "get_balance", description: "Get balance of Base Account", inputSchema: { type: "object", properties: { address: { type: "string" } } } },
                  { name: "send_transaction", description: "Send transaction on Base", inputSchema: { type: "object", properties: { to: { type: "string" }, value: { type: "string" } } } }
                ]
              }
            });
            return;
          }

          if (method === 'prompts/list') {
            res.json({ jsonrpc: "2.0", id: id, result: { prompts: [] } });
            return;
          }

          if (method === 'resources/list') {
            res.json({ jsonrpc: "2.0", id: id, result: { resources: [] } });
            return;
          }

          if (method === 'tools/call') {
            const toolName = params?.name;
            if (["get_race_status", "start_race", "get_leaderboard", "optimize_speed", "get_track_info", "web_request", "get_balance", "send_transaction"].includes(toolName)) {
              res.json({
                jsonrpc: "2.0",
                id: id,
                result: { content: [{ type: "text", text: `Executed ${toolName} successfully.` }] }
              });
              return;
            } else {
              res.json({
                jsonrpc: "2.0",
                id: id,
                error: { code: -32601, message: `Tool ${toolName} not found` }
              });
              return;
            }
          }

          res.json({ jsonrpc: "2.0", id: id, result: { status: "online", version: "1.0.0" } });
          return;
        }

        switch (action || command) {
          case "status":
          case "ping":
            result = { status: "online", message: "Cast Rus Agent is ready" };
            break;
          case "execute":
            result = { success: true, executed: command || params, timestamp: new Date().toISOString() };
            break;
          default:
            result = { success: true, message: "Command received", data: body };
        }

        res.json({
          status: "success",
          agent: "Cast Rus Orchestrator",
          response: result,
          receivedAt: new Date().toISOString()
        });
      } catch (error) {
        res.status(400).json({ error: { code: -32700, message: "Parse error or failed to process command" } });
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
      version: "1.0.0"
    });
  });

  // --- Static Files & Vite Middleware ---
  
  // Serve static files from public/
  app.use(express.static(path.join(process.cwd(), 'public')));
  
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
