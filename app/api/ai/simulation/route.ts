import { NextRequest, NextResponse } from 'next/server';
import { AICore } from '../../../../lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { sensors, weather, hours } = await req.json();
    const result = await AICore.runSimulation(sensors, weather, hours);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Simulation Failed" }, { status: 500 });
  }
}