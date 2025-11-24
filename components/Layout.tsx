import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanEye, 
  Droplets, 
  Receipt, 
  Store, 
  Settings, 
  Menu, 
  X,
  Sprout
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  language: Language;
  setRole: (r: UserRole) => void;
  setLanguage: (l: Language) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, language, setRole, setLanguage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { path: '/', label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { path: '/vision', label: t.visionAI, icon: <ScanEye size={20} /> },
    { path: '/irrigation', label: t.irrigation, icon: <Droplets size={20} /> },
    { path: '/accounting', label: t.accounting, icon: <Receipt size={20} />, restricted: UserRole.TECHNICIAN },
    { path: '/marketplace', label: t.marketplace, icon: <Store size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-emerald-900 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Sprout className="text-emerald-400" />
            <span>AGRI-360°</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            if (item.restricted === role) return null; // Basic permission check
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path) ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-800'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-emerald-950 border-t border-emerald-800">
          <div className="flex flex-col gap-4">
             <div>
                <label className="text-xs text-emerald-400 uppercase font-bold">{t.role}</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full mt-1 bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value={UserRole.FARMER}>Farmer</option>
                  <option value={UserRole.ACCOUNTANT}>Accountant</option>
                  <option value={UserRole.TECHNICIAN}>Technician</option>
                </select>
             </div>
             <div>
                <label className="text-xs text-emerald-400 uppercase font-bold">{t.lang}</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full mt-1 bg-emerald-900 border border-emerald-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value={Language.IT}>Italiano</option>
                  <option value={Language.EN}>English</option>
                  <option value={Language.ES}>Español</option>
                </select>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
           <div className="font-bold text-emerald-800">AGRI-INTELLIGENCE</div>
           <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
             <Menu />
           </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};