
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppTab, UserRole, User } from './types';
import Dashboard from './components/Dashboard';
import CRM from './components/CRM';
import ProjectCore from './components/ProjectCore';
import QuotationEngine from './components/QuotationEngine';
import CampaignCortex from './components/CampaignCortex';
import SalesPOS from './components/SalesPOS';
import AurumUplink from './components/AurumUplink';
import Landing from './components/Landing';
import Settings from './components/Settings';
import AICortexAssistant from './components/AICortexAssistant';
import { Shield, User as UserIcon, Crown, Briefcase, Settings as SettingsIcon, LayoutGrid, CalendarDays, ShoppingCart, FileText } from 'lucide-react';

type View = 'LANDING' | 'APP';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isUplinkConnected, setIsUplinkConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (role: UserRole) => {
    const nodeNames = {
      [UserRole.CEO]: 'CEO_MASTER_NODE',
      [UserRole.STAFF]: 'OPERATIVE_NODE_B4',
      [UserRole.CLIENT]: 'CLIENT_VIEW_GUEST'
    };
    
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      role: role,
      nodeName: nodeNames[role]
    });
    setCurrentView('APP');
    setActiveTab(AppTab.DASHBOARD);
  };

  const handleConnect = () => {
    if (user?.role === UserRole.CEO) {
      setIsUplinkConnected(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="relative">
             <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full animate-ping absolute" />
             <div className="w-16 h-16 border-2 border-cyan-400 rounded-full flex items-center justify-center relative">
                <div className="w-8 h-8 bg-cyan-400 rounded-sm rotate-45 animate-pulse shadow-[0_0_15px_#22d3ee]" />
             </div>
          </div>
        </motion.div>
        <h1 className="font-orbitron text-2xl text-cyan-400 tracking-widest mb-2 uppercase text-center px-4">NeuronAds OS</h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em]">Synchronizing Neural Network...</p>
      </div>
    );
  }

  if (currentView === 'LANDING') {
    return <Landing onEnterLogin={handleLogin} />;
  }

  const canAccessCRM = user?.role === UserRole.CEO || user?.role === UserRole.STAFF;
  const canAccessQuotations = user?.role === UserRole.CEO || user?.role === UserRole.STAFF || user?.role === UserRole.CLIENT;
  const canAccessProjects = user?.role === UserRole.CEO || user?.role === UserRole.STAFF || user?.role === UserRole.CLIENT;
  const canAccessSales = user?.role === UserRole.CEO || user?.role === UserRole.STAFF;
  const canAccessUplink = user?.role === UserRole.CEO;
  const canAccessSettings = user?.role === UserRole.CEO || user?.role === UserRole.STAFF;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <nav className="w-20 md:w-64 border-r border-slate-800 bg-slate-900/20 backdrop-blur-xl flex flex-col z-50 font-orbitron">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400/20 rounded flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
             <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]" />
          </div>
          <span className="hidden md:block font-bold text-lg tracking-tighter metallic-text">NEURONADS</span>
        </div>

        <div className="flex-1 px-4 py-8 space-y-4 overflow-y-auto custom-scrollbar">
          <SidebarItem icon="▢" label="Panel" active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} />
          {canAccessCRM && <SidebarItem icon="◈" label="CRM" active={activeTab === AppTab.CRM} onClick={() => setActiveTab(AppTab.CRM)} />}
          {canAccessQuotations && <SidebarItem icon="✎" label="Cotizaciones" active={activeTab === AppTab.QUOTATIONS} onClick={() => setActiveTab(AppTab.QUOTATIONS)} />}
          {canAccessProjects && <SidebarItem icon="◳" label="Proyectos" active={activeTab === AppTab.PROJECTS} onClick={() => setActiveTab(AppTab.PROJECTS)} />}
          <SidebarItem icon="⚡" label="Ads" active={activeTab === AppTab.CAMPAIGNS} onClick={() => setActiveTab(AppTab.CAMPAIGNS)} />
          {canAccessSales && <SidebarItem icon="🛒" label="Ventas" active={activeTab === AppTab.SALES} onClick={() => setActiveTab(AppTab.SALES)} />}
          {canAccessUplink && <SidebarItem icon="⌥" label="Enlace" active={activeTab === AppTab.UPLINK} onClick={() => setActiveTab(AppTab.UPLINK)} />}
          {canAccessSettings && <SidebarItem icon="⚙" label="Ajustes" active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} />}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                 {user?.role === UserRole.CEO ? <Crown className="text-amber-400" size={18} /> : 
                  user?.role === UserRole.STAFF ? <Briefcase className="text-cyan-400" size={18} /> : 
                  <UserIcon className="text-slate-400" size={18} />}
              </div>
              <div className="hidden md:block">
                 <p className="text-[10px] font-black text-slate-200 truncate">{user?.nodeName}</p>
                 <p className="text-[8px] text-cyan-500/70 font-bold uppercase tracking-widest">
                    {user?.role === UserRole.CEO ? 'Modo Dios' : user?.role === UserRole.STAFF ? 'Personal' : 'Cliente'}
                 </p>
              </div>
           </div>
           <button 
             onClick={() => setCurrentView('LANDING')}
             className="w-full py-2 text-[9px] text-slate-500 hover:text-rose-400 transition-colors uppercase font-bold border border-slate-800 rounded-lg"
           >
             Cerrar Nodo
           </button>
        </div>
      </nav>

      <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,_rgba(8,145,178,0.05)_0%,_transparent_50%)]">
        <header className="sticky top-0 h-16 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <h2 className="font-orbitron text-[10px] text-slate-400 uppercase tracking-[0.3em]">
             {activeTab} - {user?.role} ACCESS
          </h2>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${isUplinkConnected ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isUplinkConnected ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">
              {isUplinkConnected ? 'ACC Linked: 8888' : 'Aurum Offline'}
            </span>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === AppTab.DASHBOARD && <Dashboard userRole={user?.role} />}
              {activeTab === AppTab.CRM && canAccessCRM && <CRM />}
              {activeTab === AppTab.QUOTATIONS && canAccessQuotations && <QuotationEngine userRole={user?.role} />}
              {activeTab === AppTab.PROJECTS && canAccessProjects && <ProjectCore userRole={user?.role} />}
              {activeTab === AppTab.CAMPAIGNS && <CampaignCortex userRole={user?.role} />}
              {activeTab === AppTab.SALES && canAccessSales && <SalesPOS />}
              {activeTab === AppTab.UPLINK && canAccessUplink && <AurumUplink onConnect={handleConnect} isConnected={isUplinkConnected} />}
              {activeTab === AppTab.SETTINGS && canAccessSettings && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global AI Assistant */}
      <AICortexAssistant />
    </div>
  );
};

const SidebarItem: React.FC<{ icon: string | React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border ${active ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-500 border-transparent hover:text-slate-200'}`}>
    <span className="text-lg w-6 flex justify-center">{icon}</span>
    <span className="hidden md:block text-[11px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
