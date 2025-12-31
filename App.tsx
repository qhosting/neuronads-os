
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
import { Shield, User as UserIcon, Crown, Briefcase, Settings as SettingsIcon, LayoutGrid, CalendarDays, ShoppingCart, FileText, Zap, Bell, Brain } from 'lucide-react';

type View = 'LANDING' | 'APP';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [isUplinkConnected, setIsUplinkConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // WebSocket Integration
  useEffect(() => {
    if (currentView === 'APP') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}`);

      ws.onopen = () => {
        setIsUplinkConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_TRANSACTION') {
          const newNotif = {
            id: Date.now(),
            title: 'FLUJO DE ABUNDANCIA',
            message: `Nueva venta: $${data.payload.total} de ${data.payload.clientName}`,
            type: 'TRANSACTION'
          };
          setNotifications(prev => [newNotif, ...prev]);
          setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotif.id)), 5000);
        }
      };

      ws.onclose = () => {
        setIsUplinkConnected(false);
      };

      return () => ws.close();
    }
  }, [currentView]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterLogin = (role: UserRole) => {
    setUser({ id: 'USR-' + Math.random().toString(36).substr(2, 4).toUpperCase(), role, nodeName: 'ALPHA-NODE' });
    setCurrentView('APP');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 flex items-center justify-center mb-8"
        >
          <Zap className="text-cyan-400" size={48} />
        </motion.div>
        <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.5em] animate-pulse">Iniciando Red NeuronAds...</span>
      </div>
    );
  }

  if (currentView === 'LANDING') {
    return <Landing onEnterLogin={handleEnterLogin} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard userRole={user?.role} />;
      case AppTab.CRM: return <CRM />;
      case AppTab.PROJECTS: return <ProjectCore userRole={user?.role} />;
      case AppTab.QUOTATIONS: return <QuotationEngine userRole={user?.role} />;
      case AppTab.CAMPAIGNS: return <CampaignCortex userRole={user?.role} />;
      case AppTab.SALES: return <SalesPOS />;
      case AppTab.UPLINK: return <AurumUplink isConnected={isUplinkConnected} onConnect={() => setIsUplinkConnected(true)} />;
      case AppTab.SETTINGS: return <Settings />;
      default: return <Dashboard userRole={user?.role} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-inter flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl flex flex-col z-20">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <Brain className="text-cyan-400" size={28} />
          <span className="hidden md:block font-orbitron font-black text-xl tracking-tighter">NEURONADS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon={<LayoutGrid size={20} />} label="Dashboard" />
          <NavItem active={activeTab === AppTab.CRM} onClick={() => setActiveTab(AppTab.CRM)} icon={<Shield size={20} />} label="Clientes" />
          <NavItem active={activeTab === AppTab.QUOTATIONS} onClick={() => setActiveTab(AppTab.QUOTATIONS)} icon={<FileText size={20} />} label="Cotizador" />
          <NavItem active={activeTab === AppTab.PROJECTS} onClick={() => setActiveTab(AppTab.PROJECTS)} icon={<Briefcase size={20} />} label="Proyectos" />
          <NavItem active={activeTab === AppTab.CAMPAIGNS} onClick={() => setActiveTab(AppTab.CAMPAIGNS)} icon={<Zap size={20} />} label="Campañas" />
          <NavItem active={activeTab === AppTab.SALES} onClick={() => setActiveTab(AppTab.SALES)} icon={<ShoppingCart size={20} />} label="Sales POS" />
          <div className="h-px bg-white/5 my-4" />
          <NavItem active={activeTab === AppTab.UPLINK} onClick={() => setActiveTab(AppTab.UPLINK)} icon={<Bell size={20} />} label="Aurum Uplink" />
          <NavItem active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} icon={<SettingsIcon size={20} />} label="Configuración" />
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                {user?.role === UserRole.CEO ? <Crown size={20} /> : <UserIcon size={20} />}
              </div>
              <div className="hidden md:block overflow-hidden">
                 <p className="text-[10px] font-orbitron font-bold uppercase truncate">{user?.role}</p>
                 <p className="text-[8px] text-slate-500 font-mono">NODE-ALPHA-7</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 md:mb-12">
           <div className="flex items-center gap-4">
              <div className="h-8 w-1 bg-cyan-500 rounded-full" />
              <h1 className="text-xl font-orbitron font-black uppercase tracking-widest">{activeTab}</h1>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end">
                 <span className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Estado de Enlace</span>
                 <span className={`text-[10px] font-bold ${isUplinkConnected ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {isUplinkConnected ? 'CONECTADO 8888' : 'UPLINK OFFLINE'}
                 </span>
              </div>
              <div className="h-10 w-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors relative">
                 <Bell size={20} />
                 {notifications.length > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#020617]" />}
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>

        <AICortexAssistant />

        {/* Global Notifications */}
        <div className="fixed top-8 right-8 z-[200] space-y-4 pointer-events-none">
          <AnimatePresence>
            {notifications.map(n => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="w-80 bg-slate-900 border border-cyan-500/30 p-5 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto"
              >
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg"><Zap size={16} /></div>
                   <h4 className="text-[10px] font-orbitron font-black text-white uppercase">{n.title}</h4>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-mono">{n.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
  >
    <div className={`${active ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`}>{icon}</div>
    <span className="hidden md:block text-[10px] font-orbitron font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
