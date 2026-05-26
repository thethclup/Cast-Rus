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

  if (req.method === 'GET' || req.method === 'POST') {
    return new Response(
      JSON.stringify({
        name: "Cast Rus Orchestrator",
        status: "active",
        wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
        platform: "Cast Rus",
        version: "1.0.0",
      }),
      { headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
}
