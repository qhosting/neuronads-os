
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  ArrowUpRight, 
  Activity,
  Zap,
  Lock
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserRole } from '../types';

const data = [
  { name: 'Lun', leads: 40, spend: 240 },
  { name: 'Mar', leads: 65, spend: 320 },
  { name: 'Mie', leads: 52, spend: 290 },
  { name: 'Jue', leads: 88, spend: 400 },
  { name: 'Vie', leads: 120, spend: 550 },
  { name: 'Sab', leads: 95, spend: 480 },
  { name: 'Dom', leads: 140, spend: 600 },
];

const Dashboard: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const isClient = userRole === UserRole.CLIENT;

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <span className="text-[12rem] font-bold text-slate-800/5 font-orbitron select-none whitespace-nowrap">
          419 819 719 81
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <KPICard title="ROAS" value={isClient ? "3.8x" : "4.2x"} trend="+12%" icon={<TrendingUp className="text-cyan-400" />} color="cyan" />
        <KPICard title={isClient ? "Mis Leads" : "Leads Global"} value={isClient ? "124" : "1,402"} trend="+28%" icon={<Users className="text-blue-400" />} color="blue" />
        
        {!isClient ? (
          <>
            <KPICard title="Inversión Ads" value="$24,850" trend="+5%" icon={<DollarSign className="text-teal-400" />} color="teal" />
            <KPICard title="Costo Lead" value="$17.72" trend="-3.2%" icon={<Target className="text-purple-400" />} color="purple" />
          </>
        ) : (
          <>
            <KPICard title="Inversión" value="$2,400" trend="+2%" icon={<DollarSign className="text-teal-400" />} color="teal" />
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm flex flex-col items-center justify-center opacity-50">
               <Lock size={20} className="text-slate-600 mb-2" />
               <span className="text-[10px] font-orbitron text-slate-600 uppercase">Métricas Restringidas</span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-orbitron font-bold metallic-text uppercase">
               {isClient ? 'Mi Rendimiento Neural' : 'Consola de Comando Global'}
            </h3>
            <Activity className="text-cyan-400 animate-pulse" size={18} />
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none' }} />
                <Area type="monotone" dataKey="leads" stroke="#22d3ee" strokeWidth={3} fillOpacity={0.1} fill="#22d3ee" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {!isClient && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm flex flex-col shadow-xl">
            <h3 className="text-lg font-orbitron font-bold metallic-text mb-6 uppercase">Sinapsis Algorítmica</h3>
            <div className="space-y-6 flex-1">
              <AlgorithmStatus label="Meta Ads AI" value={98} />
              <AlgorithmStatus label="Google AI" value={82} />
              <AlgorithmStatus label="TikTok Engine" value={94} />
            </div>
            <button className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 font-orbitron text-xs font-black text-slate-950">
              FORZAR SINAPSIS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, trend: string, icon: React.ReactNode, color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm group hover:border-cyan-500/30 transition-all cursor-default shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-${color}-400/10 border border-${color}-400/20`}>{icon}</div>
      <span className="text-[10px] font-bold text-emerald-400">{trend}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">{title}</span>
      <span className="text-2xl font-orbitron font-bold mt-1 tracking-tight">{value}</span>
    </div>
  </div>
);

const AlgorithmStatus: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-orbitron">
      <span className="text-slate-400 uppercase">{label}</span>
      <span className="text-cyan-400 font-mono">{value}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-cyan-500" />
    </div>
  </div>
);

export default Dashboard;
