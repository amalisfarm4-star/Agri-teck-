import { NextRequest, NextResponse } from 'next/server';
import { AICore } from '../../../../lib/ai';

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  try {
    const { action } = params;
    const body = await req.json();
    const { language, ...data } = body;
    let result;

    switch (action) {
      case 'vision':
        result = await AICore.analyzeCropImage(data.image, language);
        break;
      case 'ocr':
        result = await AICore.extractInvoiceData(data.image);
        break;
      case 'marketplace':
        result = await AICore.optimizeListing(data.input, language);
        break;
      case 'digital-twin':
        result = await AICore.runSimulation(data.sensors, data.weather, data.hours);
        break;
      case 'dashboard':
        result = await AICore.generateInsights(data.data, language);
        break;
      case 'irrigation':
        result = await AICore.optimizeIrrigation(data.zone, data.weather, language);
        break;
      case 'grants':
        result = await AICore.generateBusinessPlan(data, language);
        break;
      case 'notifications':
        result = await AICore.predictAlerts(data, language);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`API Error [${params.action}]:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}