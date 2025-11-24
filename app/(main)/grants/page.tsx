"use client";
import React, { useState } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { ScrollText, Sparkles, FileText } from 'lucide-react';

export default function GrantsPage() {
  const { language } = useApp();
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState('');

  const generatePlan = async () => {
      setGenerating(true);
      try {
          const data = { farmName: "My Tech Farm", crop: "Organic Wheat", investmentAmount: 50000, goal: "Automate irrigation" };
          const res = await fetch('/api/ai/grants', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ ...data, language })
          });
          const result = await res.json();
          setPlan(result.text);
      } catch (e) { console.error(e); }
      setGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h1 className="text-3xl font-bold text-slate-800">Grants & Finance AI</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ScrollText className="text-emerald-600" /> Active Grants</h3>
               <ul className="space-y-3">
                   {['PSR 2024 - Innovation', 'Green Deal EU Fund', 'Young Farmers Scheme'].map((g, i) => (
                       <li key={i} className="p-3 bg-slate-50 rounded-lg text-sm font-medium flex justify-between cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 border border-transparent hover:border-emerald-200 transition-all">
                           <span>{g}</span>
                           <span className="text-emerald-600">Open</span>
                       </li>
                   ))}
               </ul>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="text-indigo-600" /> AI Business Plan Generator</h3>
               <p className="text-sm text-slate-500 mb-4">Generate a compliant project description for funding applications based on your farm data.</p>
               <button onClick={generatePlan} disabled={generating} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
                   {generating ? "Writing..." : "Generate Proposal"}
               </button>
           </div>
       </div>

       {plan && (
           <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText /> Generated Proposal</h3>
               <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-sans">
                   {plan}
               </div>
           </div>
       )}
    </div>
  );
}