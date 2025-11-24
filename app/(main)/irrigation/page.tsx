
"use client";
import React, { useState } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { Droplets, Clock, Power, Battery, BrainCircuit, Plus, Calendar } from 'lucide-react';
import { IrrigationZone, IrrigationProgram, WeatherData } from '../../../types';

export default function IrrigationPage() {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'zones' | 'schedules'>('zones');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<Record<string, any>>({});

  // Mock Data
  const weather: WeatherData = { temp: 24, humidity: 65, condition: 'Cloudy', forecast: 'Rain', precipProb: 80, et0: 4.2 };
  const [zones, setZones] = useState<IrrigationZone[]>([
    { id: '1', name: 'North Vineyard', cropType: 'Grapes', soilType: 'Clay', status: 'idle', currentMoisture: 45, targetMoisture: 50, batteryLevel: 88, aiMode: true },
    { id: '2', name: 'Greenhouse Alpha', cropType: 'Tomatoes', soilType: 'Hydroponic', status: 'watering', currentMoisture: 72, targetMoisture: 70, batteryLevel: 100, aiMode: true },
  ]);
  const [programs] = useState<IrrigationProgram[]>([
    { id: 'p1', zoneId: '1', name: 'Morning Drip', startTime: '06:00', duration: 45, days: [1, 3, 5], enabled: true, smartAdjusted: true },
  ]);

  const handleCheckAI = async (zone: IrrigationZone) => {
    setLoadingAI(zone.id);
    try {
      const res = await fetch('/api/ai/irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, weather, language })
      });
      const data = await res.json();
      setAiAdvice(prev => ({ ...prev, [zone.id]: data }));
    } catch (e) { console.error(e); }
    setLoadingAI(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t.irrigation}</h1>
          <p className="text-slate-500">ET0: {weather.et0}mm/day • {weather.condition}</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
          <button onClick={() => setActiveTab('zones')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'zones' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'}`}>Zones</button>
          <button onClick={() => setActiveTab('schedules')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'schedules' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'}`}>Schedules</button>
        </div>
      </div>

      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div key={zone.id} className={`bg-white rounded-xl shadow-sm border p-6 ${zone.status === 'watering' ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-100'}`}>
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                   <div className={`p-3 rounded-full ${zone.status === 'watering' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Droplets size={24} /></div>
                   <div><h3 className="font-bold text-slate-800">{zone.name}</h3><p className="text-xs text-slate-500">{zone.cropType}</p></div>
                 </div>
                 <Battery size={20} className={zone.batteryLevel < 20 ? 'text-red-500' : 'text-emerald-500'} />
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-slate-50 p-3 rounded-lg">
                   <p className="text-xs text-slate-500">Moisture</p>
                   <p className="text-2xl font-bold text-slate-800">{zone.currentMoisture}%</p>
                   <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: `${zone.currentMoisture}%` }}></div>
                   </div>
                 </div>
                 <div className="bg-indigo-50 p-3 rounded-lg relative">
                   <button onClick={() => handleCheckAI(zone)} className="absolute top-2 right-2 text-indigo-400"><BrainCircuit size={16} className={loadingAI === zone.id ? 'animate-spin' : ''} /></button>
                   <p className="text-xs text-indigo-800 font-bold mb-1">AI Advice</p>
                   {aiAdvice[zone.id] ? (
                     <div><p className="text-lg font-bold text-indigo-700">{aiAdvice[zone.id].adjustment}</p><p className="text-[10px] text-indigo-600 leading-tight">{aiAdvice[zone.id].reason}</p></div>
                   ) : <p className="text-xs text-indigo-400 mt-2">Click to optimize</p>}
                 </div>
               </div>

               <button className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${zone.status === 'watering' ? 'bg-red-100 text-red-600' : 'bg-emerald-600 text-white'}`}>
                 <Power size={16} /> {zone.status === 'watering' ? 'Stop' : 'Water Now'}
               </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="p-4 border-b border-slate-100 flex justify-between"><h3 className="font-bold">Active Programs</h3><button className="text-sm font-bold text-emerald-600 flex items-center gap-1"><Plus size={16}/> Add</button></div>
           {programs.map(p => (
             <div key={p.id} className="p-4 flex items-center justify-between border-b border-slate-50 last:border-0">
               <div className="flex gap-4">
                 <Clock className="text-slate-400" />
                 <div>
                   <h4 className="font-bold text-slate-800">{p.name}</h4>
                   <p className="text-xs text-slate-500">{p.startTime} • {p.duration} min • {p.smartAdjusted && "AI Optimized"}</p>
                 </div>
               </div>
               <div className="flex gap-1">{[1,2,3,4,5,6,7].map(d => <span key={d} className={`w-5 h-5 flex items-center justify-center text-[10px] rounded ${p.days.includes(d) ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-300'}`}>{d}</span>)}</div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
