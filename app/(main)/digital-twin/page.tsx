"use client";
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useApp } from '../../../lib/i18n-context';
import { Cuboid, Play } from 'lucide-react';

export default function DigitalTwinPage() {
  const { t } = useApp();
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/ai/digital-twin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ sensors: [], weather: {temp:24}, hours: 72 })
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setSimulating(false);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden relative shadow-2xl border border-slate-700">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm">
           <h2 className="font-bold text-slate-800 flex items-center gap-2"><Cuboid className="text-emerald-600" size={18} /> {t.digitalTwin}</h2>
        </div>
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
           <Suspense fallback={null}>
             <Environment preset="city" />
             <ambientLight intensity={0.5} />
             <pointLight position={[10, 10, 10]} />
             <Grid infiniteGrid fadeDistance={50} sectionColor="#10b981" cellColor="#334155" />
             <mesh position={[0, 0.5, 0]}><boxGeometry /><meshStandardMaterial color="#10b981" /></mesh>
             <OrbitControls makeDefault />
           </Suspense>
        </Canvas>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4">{t.simulation}</h3>
         <button onClick={runSimulation} disabled={simulating} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center gap-2">
            <Play size={18} /> {simulating ? "Simulating..." : "Run 72h AI"}
         </button>
         {result && (
             <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                 <p className="font-bold text-emerald-600 text-xl">{result.overallHealth}% Health</p>
                 <p className="text-sm text-slate-600 mt-2">{result.advice}</p>
             </div>
         )}
      </div>
    </div>
  );
}