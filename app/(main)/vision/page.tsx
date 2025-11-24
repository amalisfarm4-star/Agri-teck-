"use client";
import React, { useState } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { Upload, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { AIAnalysisResult } from '../../../types';

export default function VisionPage() {
  const { t, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result as string); setAnalysis(null); };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const response = await fetch('/api/ai/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, language })
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.visionAI}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 relative h-80 flex flex-col items-center justify-center">
            {image ? <img src={image} className="absolute inset-0 w-full h-full object-contain rounded-xl p-2" /> : <Camera size={48} className="mx-auto mb-4 text-slate-400" />}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <button onClick={runAnalysis} disabled={!image || loading} className="w-full py-3 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : t.analyze}
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle className="text-emerald-500" /> {t.diagnosisResults}</h2>
          {analysis ? (
             <div className="space-y-4">
                <h3 className="text-lg font-bold">{analysis.diagnosis}</h3>
                <p className="text-sm">Confidence: {analysis.confidence}%</p>
                <div className="text-xs uppercase bg-emerald-100 text-emerald-800 inline-block px-2 py-1 rounded">{analysis.severity}</div>
                <ul className="list-disc pl-5 text-sm text-slate-600">{analysis.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul>
             </div>
          ) : <div className="text-slate-400 text-center mt-10">No analysis yet</div>}
        </div>
      </div>
    </div>
  );
}