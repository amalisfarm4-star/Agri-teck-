
import { NextRequest, NextResponse } from 'next/server';
import { AICore } from '../../../../../lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { data, language } = await req.json();
    const result = await AICore.generateInsights(data, language);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Dashboard AI Failed" }, { status: 500 });
  }
}