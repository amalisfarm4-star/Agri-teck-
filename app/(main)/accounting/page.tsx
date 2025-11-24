
"use client";
import React, { useState } from 'react';
import { useApp } from '../../../lib/i18n-context';
import { Upload, FileText, Check, Loader2 } from 'lucide-react';
import { Invoice } from '../../../types';

export default function AccountingPage() {
  const { t } = useApp();
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<Partial<Invoice> | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/ai/ocr', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ image: base64 })
        });
        const result = await res.json();
        setData(result);
      } catch (err) { console.error(err); }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">{t.accounting}</h1>
        <button className="text-emerald-600 font-medium hover:underline">Download Report</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Upload size={20} className="text-blue-600" /> Upload Invoice</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center relative hover:bg-slate-50 transition-colors">
               <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               <FileText className="mx-auto text-slate-400 mb-2" size={32} />
               <p className="text-sm text-slate-500">{uploading ? "AI Processing..." : "Drag PDF or Image"}</p>
            </div>
            {data && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase">Extracted Data</h4>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between"><span>Supplier:</span> <span className="font-bold">{data.supplier}</span></div>
                   <div className="flex justify-between"><span>Date:</span> <span className="font-bold">{data.date}</span></div>
                   <div className="flex justify-between"><span>Total:</span> <span className="font-bold text-lg">${data.amount}</span></div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-medium flex justify-center gap-2"><Check size={16}/> Save to Ledger</button>
              </div>
            )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100"><h3 className="font-bold">Ledger</h3></div>
           <table className="w-full text-sm text-left text-slate-600">
               <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                   <tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Details</th><th className="px-6 py-3 text-right">Amount</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                   {[
                       {d:'2023-10-12', t:'Seeds Co.', a:-450},
                       {d:'2023-10-15', t:'Market Sales', a:1200}
                   ].map((r,i) => (
                       <tr key={i}><td className="px-6 py-4">{r.d}</td><td className="px-6 py-4 font-bold">{r.t}</td><td className={`px-6 py-4 text-right font-bold ${r.a>0?'text-emerald-600':'text-red-500'}`}>{r.a} €</td></tr>
                   ))}
               </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
