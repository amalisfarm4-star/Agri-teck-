
import { NextRequest, NextResponse } from 'next/server';
import { AICore } from '../../../../../lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { input, language } = await req.json();
    const result = await AICore.optimizeListing(input, language);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "AI Optimization Failed" }, { status: 500 });
  }
}