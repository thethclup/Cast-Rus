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
        const body = req.body;
        const { action, command, params } = body || {};

        let result: any;

        switch (action || command) {
          case "status":
          case "ping":
            result = { status: "online", message: "Cast Rus Agent is ready" };
            break;

          case "execute":
            result = {
              success: true,
              executed: command || params,
              timestamp: new Date().toISOString()
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
          status: "success",
          agent: "Cast Rus Orchestrator",
          response: result,
          receivedAt: new Date().toISOString()
        });
      } catch (error) {
        res.status(400).json({
          status: "error",
          message: "Failed to process command"
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
