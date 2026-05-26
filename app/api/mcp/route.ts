import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  return NextResponse.json(
    {
      protocol: "MCP",
      version: "1.0.0",
      name: "Cast Rus MCP Endpoint",
      status: "active",
      description: "Active MCP server for Cast Rus Orchestrator Agent",
      capabilities: ["casting-operations", "creative-automation", "multi-cast-management"],
      timestamp: new Date().toISOString()
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params, action, command } = body;

    let result;

    if (jsonrpc === '2.0') {
      // JSON-RPC MCP implementation
      if (method === 'tools/list') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id,
          result: {
            tools: [
              {
                name: "get_race_status",
                description: "Get the current status of the race",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "start_race",
                description: "Start a new race on the Cast Rus platform",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_leaderboard",
                description: "Get the latest leaderboard",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "optimize_speed",
                description: "Optimize agent speed",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_track_info",
                description: "Details about the current race track",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        }, { headers: CORS_HEADERS });
      }

      if (method === 'prompts/list') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id,
          result: {
            prompts: []
          }
        }, { headers: CORS_HEADERS });
      }

      if (method === 'resources/list') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id,
          result: {
            resources: []
          }
        }, { headers: CORS_HEADERS });
      }
      
      if (method === 'tools/call') {
        const toolName = params?.name;
        if (["get_race_status", "start_race", "get_leaderboard", "optimize_speed", "get_track_info"].includes(toolName)) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: id,
            result: {
              content: [
                {
                  type: "text",
                  text: `Executed ${toolName} successfully.`
                }
              ]
            }
          }, { headers: CORS_HEADERS });
        } else {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: id,
            error: {
              code: -32601,
              message: `Tool ${toolName} not found`
            }
          }, { headers: CORS_HEADERS });
        }
      }

      // Default reply for ping or unsupported methods
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id,
        result: {
          status: "online",
          version: "1.0.0"
        }
      }, { headers: CORS_HEADERS });
    }

    // Handle legacy REST commands for backward compatibility
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

    return NextResponse.json({
      status: "success",
      agent: "Cast Rus Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({
      error: {
        code: -32700,
        message: "Parse error or failed to process command"
      }
    }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
