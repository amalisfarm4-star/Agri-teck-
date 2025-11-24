"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ScanEye, Droplets, Receipt, Store, Sprout, Menu, X, Cuboid, Bell, ScrollText
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { useApp } from '../lib/i18n-context';

export const Sidebar = () => {
  const { role, language, setRole, setLanguage, t } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { path: '/vision', label: t.visionAI, icon: <ScanEye size={20} /> },
    { path: '/irrigation', label: t.irrigation, icon: <Droplets size={20} /> },
    { path: '/digital-twin', label: t.digitalTwin, icon: <Cuboid size={20} /> },
    { path: '/notifications', label: t.alerts, icon: <Bell size={20} /> },
    { path: '/grants', label: "Bandi & Finanza", icon: <ScrollText size={20} /> },
    { path: '/accounting', label: t.accounting, icon: <Receipt size={20} />, restricted: UserRole.TECHNICIAN },
    { path: '/marketplace', label: t.marketplace, icon: <Store size={20} /> },
  ];

  return (
    <>
      <div className="lg:hidden bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20">
         <div className="font-bold text-emerald-800">AGRI-360°</div>
         <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600"><Menu /></button>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-emerald-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sprout className="text-emerald-400" />
            <span>AGRI-360°</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X /></button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            if (item.restricted === role) return null;
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-800'}`}>
                {item.icon} <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-emerald-950 border-t border-emerald-800">
          <div className="flex flex-col gap-4">
             <div>
                <label className="text-xs text-emerald-400 uppercase font-bold">{t.role}</label>
                <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full mt-1 bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500">
                  <option value={UserRole.FARMER}>Farmer</option>
                  <option value={UserRole.ACCOUNTANT}>Accountant</option>
                  <option value={UserRole.TECHNICIAN}>Technician</option>
                </select>
             </div>
             <div>
                <label className="text-xs text-emerald-400 uppercase font-bold">{t.lang}</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full mt-1 bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500">
                  <option value={Language.IT}>Italiano</option>
                  <option value={Language.EN}>English</option>
                  <option value={Language.ES}>Español</option>
                </select>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};