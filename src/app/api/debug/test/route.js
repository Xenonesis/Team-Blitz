import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'API routing is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to parse JSON',
      error: error.message
    }, { status: 400 });
  }
}