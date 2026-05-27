import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ result: 'error' }, { status: 500 });
  }
}
