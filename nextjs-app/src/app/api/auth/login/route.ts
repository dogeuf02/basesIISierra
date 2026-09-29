import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '0000';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        username: 'admin',
        role: 'admin',
      },
      token: 'admin-session-token',
    });
  }

  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
