"use client";
import React, { useState } from 'react';
import { Search, Plus, Sparkles, X, Loader2 } from 'lucide-react';
import { useApp } from '../../../lib/i18n-context';

export default function MarketplacePage() {
  const { t, language } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({ title: '', price: 0, description: '' });

  const generate = async () => {
      setLoading(true);
      try {
          const res = await fetch('/api/ai/marketplace', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ input: aiInput, language })
          });
          const data = await res.json();
          setItem({ title: data.title, description: data.description, price: data.suggestedPrice || 0 });
      } catch (e) { console.error(e); }
      setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">{t.marketplace}</h1>
        <button onClick={() => setModalOpen(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2">
          <Plus size={20} /> {t.market.createListing}
        </button>
      </div>

      {/* Grid of items would go here (omitted for brevity, same as before) */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">{t.market.createListing}</h2>
               <button onClick={() => setModalOpen(false)}><X /></button>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4">
                <label className="text-sm font-bold text-indigo-900 flex items-center gap-1 mb-2"><Sparkles size={16} /> AI Auto-Fill</label>
                <div className="flex gap-2">
                    <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} className="flex-1 p-2 text-sm border border-indigo-200 rounded-lg outline-none" placeholder="e.g., Selling 500kg organic tomatoes..." />
                    <button onClick={generate} disabled={loading} className="bg-indigo-600 text-white px-3 rounded-lg">{loading ? <Loader2 className="animate-spin" /> : <Sparkles />}</button>
                </div>
            </div>
            <div className="space-y-4">
                <input value={item.title} onChange={e=>setItem({...item, title:e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Title" />
                <textarea value={item.description} onChange={e=>setItem({...item, description:e.target.value})} className="w-full p-2 border rounded-lg h-24" placeholder="Description" />
                <input type="number" value={item.price} onChange={e=>setItem({...item, price:Number(e.target.value)})} className="w-full p-2 border rounded-lg" placeholder="Price" />
                <button className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold">Post Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}