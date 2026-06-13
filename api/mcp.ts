export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        protocol: "MCP",
        version: "1.0.0",
        name: "Cast Rus MCP Endpoint",
        status: "active",
        description: "Active MCP server for Cast Rus Orchestrator Agent",
        capabilities: ["casting-operations", "creative-automation", "multi-cast-management"],
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { jsonrpc, id, method, params, action, command } = body;

      if (jsonrpc === '2.0') {
        if (method === 'tools/list') {
          return new Response(
            JSON.stringify({
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
            }),
            { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
          );
        }

        if (method === 'prompts/list') {
          return new Response(
            JSON.stringify({ jsonrpc: "2.0", id: id, result: { prompts: [] } }),
            { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
          );
        }

        if (method === 'resources/list') {
          return new Response(
            JSON.stringify({ jsonrpc: "2.0", id: id, result: { resources: [] } }),
            { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
          );
        }

        if (method === 'tools/call') {
          const toolName = params?.name;
          if (["get_race_status", "start_race", "get_leaderboard", "optimize_speed", "get_track_info", "web_request", "get_balance", "send_transaction"].includes(toolName)) {
            return new Response(
              JSON.stringify({
                jsonrpc: "2.0",
                id: id,
                result: { content: [{ type: "text", text: `Executed ${toolName} successfully.` }] }
              }),
              { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
            );
          } else {
            return new Response(
              JSON.stringify({
                jsonrpc: "2.0",
                id: id,
                error: { code: -32601, message: `Tool ${toolName} not found` }
              }),
              { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
            );
          }
        }

        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: id, result: { status: "online", version: "1.0.0" } }),
          { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
        );
      }

      // Legacy commands
      let result;
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

      return new Response(
        JSON.stringify({
          status: "success",
          agent: "Cast Rus Orchestrator",
          response: result,
          receivedAt: new Date().toISOString()
        }),
        { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: { code: -32700, message: "Parse error or failed to process command" }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
}
