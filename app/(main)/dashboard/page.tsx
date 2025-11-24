"use client";
import React, { useEffect, useState } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { CloudSun, RefreshCw, Sparkles, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { AIInsight } from '../../../types';

// Mock Data (In production, fetch from Supabase)
const MOCK_FINANCIALS = [ { month: 'Jan', revenue: 12000, cost: 8000 }, { month: 'Feb', revenue: 15000, cost: 9000 }, { month: 'Mar', revenue: 18000, cost: 11000 }, { month: 'Apr', revenue: 22000, cost: 12000 }, { month: 'May', revenue: 28000, cost: 14000 }, { month: 'Jun', revenue: 35000, cost: 16000 } ];
const MOCK_SCORE = { agronomic: 88, economic: 74, sustainability: 92, risk: 15 };

export default function DashboardPage() {
  const { t, language } = useApp();
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    const fetchAI = async () => {
        setLoadingInsights(true);
        try {
            const res = await fetch('/api/ai/dashboard', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ data: { financials: MOCK_FINANCIALS, score: MOCK_SCORE }, language })
            });
            const data = await res.json();
            if (Array.isArray(data)) setInsights(data);
        } catch (e) { console.error(e); }
        setLoadingInsights(false);
    };
    fetchAI();
  }, [language]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.dashboard}</h1>
          <p className="text-slate-500">System Online • Last Sync: Just now</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
             <CloudSun className="text-amber-500" size={20} />
             <div className="text-xs"><p className="font-bold">24°C</p><p className="text-slate-500">Sunny</p></div>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 flex items-center gap-2">
             <RefreshCw size={16} /> Sync All
          </button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { l: t.dash.agronomicScore, v: MOCK_SCORE.agronomic, c: '#10b981' },
            { l: t.dash.economicScore, v: MOCK_SCORE.economic, c: '#3b82f6' },
            { l: t.dash.sustainabilityIndex, v: MOCK_SCORE.sustainability, c: '#8b5cf6' },
            { l: t.dash.riskScore, v: MOCK_SCORE.risk, c: '#ef4444' }
        ].map((s,i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                <div><p className="text-xs uppercase font-bold text-slate-500">{s.l}</p><h3 className="text-3xl font-bold text-slate-800">{s.v}</h3></div>
                <div className="h-10 w-10 rounded-full border-4 flex items-center justify-center font-bold text-xs" style={{ borderColor: s.c, color: s.c }}>{s.v}</div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-6">{t.dash.financialOverview}</h3>
                  <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_FINANCIALS}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                              <Area type="monotone" dataKey="cost" stroke="#f87171" fill="#f87171" fillOpacity={0.1} />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-indigo-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10"><Sparkles className="text-indigo-400" /> {t.dash.aiInsights}</h3>
                  <div className="space-y-3 relative z-10">
                      {loadingInsights ? <p className="text-xs opacity-50">Consulting Gemini...</p> : insights.length > 0 ? insights.map(i => (
                          <div key={i.id} className="bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                              <div className="flex justify-between"><span className="text-[10px] uppercase font-bold px-1 rounded bg-white/20">{i.type}</span><span className="text-emerald-400 text-xs font-mono">{i.impact}</span></div>
                              <h4 className="font-bold text-sm mt-1">{i.title}</h4>
                              <p className="text-xs text-indigo-200">{i.description}</p>
                          </div>
                      )) : <p className="text-xs">No insights generated.</p>}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}