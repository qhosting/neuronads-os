
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, DollarSign, Activity, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserRole } from '../types';

const Dashboard: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const isClient = userRole === UserRole.CLIENT;
  const [metrics, setMetrics] = useState({ revenue: 0, activeClients: 0, globalRoas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <KPICard title="ROAS GLOBAL" value={`${metrics.globalRoas}x`} trend="+12%" icon={<TrendingUp className="text-cyan-400" />} color="cyan" />
        <KPICard title="CLIENTES ACTIVOS" value={String(metrics.activeClients)} trend="+2%" icon={<Users className="text-blue-400" />} color="blue" />
        <KPICard title="INGRESOS TOTALES" value={`$${Number(metrics.revenue).toLocaleString()}`} trend="+5%" icon={<DollarSign className="text-teal-400" />} color="teal" />
        <KPICard title="ESTADO DE RED" value="ESTABLE" trend="100%" icon={<Activity className="text-purple-400" />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
           <h3 className="text-lg font-orbitron font-bold metallic-text uppercase mb-8">Flujo Energético de Campañas</h3>
           <div className="h-[300px] w-full flex items-center justify-center opacity-20">
              <p className="text-xs uppercase font-orbitron">Hidratando métricas desde Córtex Central...</p>
           </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-orbitron font-bold metallic-text mb-6 uppercase">Algoritmos Activos</h3>
            <div className="space-y-6">
              <AlgorithmStatus label="Meta Engine" value={98} />
              <AlgorithmStatus label="Google Nexus" value={82} />
              <AlgorithmStatus label="TikTok Neural" value={94} />
            </div>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string, value: string, trend: string, icon: React.ReactNode, color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl group hover:border-cyan-500/30 transition-all shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-slate-800`}>{icon}</div>
      <span className="text-[10px] font-bold text-emerald-400">{trend}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-slate-500 text-[9px] font-bold uppercase">{title}</span>
      <span className="text-2xl font-orbitron font-bold mt-1">{value}</span>
    </div>
  </div>
);

const AlgorithmStatus: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-orbitron">
      <span className="text-slate-400 uppercase">{label}</span>
      <span className="text-cyan-400">{value}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-cyan-500" />
    </div>
  </div>
);

export default Dashboard;
