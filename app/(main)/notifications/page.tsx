"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { Bell, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Notification } from '../../../types';

export default function NotificationsPage() {
  const { t, language } = useApp();
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
      setLoading(true);
      try {
          // Simulate system state
          const systemState = { moisture: 30, rainForecast: 0, lastSpray: '10 days ago', crop: 'Grapes' };
          const res = await fetch('/api/ai/notifications', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ ...systemState, language })
          });
          const data = await res.json();
          // Transform AI string result to notification object
          const newAlerts = data.map((d:any, i:number) => ({
              id: i.toString(),
              title: d.title,
              message: d.message,
              priority: d.priority,
              type: 'ai_prediction',
              timestamp: new Date().toISOString(),
              read: false
          }));
          setAlerts(newAlerts);
      } catch (e) { console.error(e); }
      setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">{t.alerts}</h1>
          <button onClick={runPrediction} disabled={loading} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Predict Risks (AI)
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {alerts.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                  <Bell size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No active alerts. System is stable.</p>
              </div>
          ) : (
              <div className="divide-y divide-slate-100">
                  {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 flex gap-4 ${alert.priority === 'critical' ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                          <div className={`p-3 rounded-full h-fit ${alert.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              <AlertTriangle size={20} />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-slate-800">{alert.title}</h4>
                                  <span className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-slate-600 text-sm mt-1">{alert.message}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
}