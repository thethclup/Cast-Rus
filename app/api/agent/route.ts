import { NextResponse } from 'next/server';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
    name: "Cast Rus Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Cast Rus",
    version: "1.0.0",
    message: "Agent is running and ready for tasks"
  }, { headers: corsHeaders });
}
