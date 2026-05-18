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
    const { action, command, params, method } = body;

    let result;

    // Standard MCP structure
    if (method === 'tools/list') {
      result = {
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
      };
      
      return NextResponse.json(result, { headers: CORS_HEADERS });
    }
    
    if (method === 'tools/call') {
      const toolName = params?.name;
      // [PLACEHOLDER] Implement actual logic for the 5 tools
      if (["get_race_status", "start_race", "get_leaderboard", "optimize_speed", "get_track_info"].includes(toolName)) {
        result = {
          content: [
            {
              type: "text",
              text: `Executed ${toolName} successfully. [PLACEHOLDER for tool logic]`
            }
          ]
        };
      } else {
        result = {
          content: [
            {
              type: "text",
              text: `Tool ${toolName} not found.`
            }
          ],
          isError: true
        };
      }
      
      return NextResponse.json(result, { headers: CORS_HEADERS });
    }

    // Handle existing legacy/ping commands just in case
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
      status: "error",
      message: "Failed to process command"
    }, { status: 400, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
