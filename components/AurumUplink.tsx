
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Database, 
  Send, 
  Lock, 
  ShieldCheck, 
  Server,
  Activity,
  ArrowRight,
  MessageSquare,
  Repeat
} from 'lucide-react';

const AurumUplink: React.FC<{ onConnect: () => void, isConnected: boolean }> = ({ onConnect, isConnected }) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 backdrop-blur-sm relative overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="p-8 rounded-full bg-slate-950 border border-slate-800 relative group">
            <motion.div 
              animate={isConnected ? { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
              className={`absolute inset-0 rounded-full ${isConnected ? 'bg-cyan-500/20 blur-2xl' : ''}`}
            />
            {isConnected ? (
              <ShieldCheck size={72} className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
            ) : (
              <Lock size={72} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-orbitron font-black metallic-text mb-4 tracking-tighter uppercase">Aurum Control Center</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              Enlace de alta prioridad con la Matriz Corporativa Aurum. Integración directa con motores de automatización y comunicación omnicanal.
            </p>
          </div>

          {!isConnected ? (
            <button 
              onClick={onConnect}
              className="px-14 py-5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl font-orbitron text-xs font-black shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all active:scale-95 text-slate-950"
            >
              ESTABLECER SINCRONIZACIÓN DIGITAL
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-4 px-8 py-3 bg-cyan-500/5 border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                <span className="text-xs font-orbitron text-cyan-400 uppercase tracking-[0.3em]">Conexión Segura: 8888</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Integración n8n & Chatwoot */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm flex flex-col shadow-xl">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30 shadow-lg">
               <Repeat size={24} className="animate-pulse" />
             </div>
             <div>
               <h3 className="font-orbitron font-bold metallic-text uppercase text-sm tracking-widest">Neural Integrations</h3>
               <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">n8n + Chatwoot Bridge</p>
             </div>
          </div>
          
          <div className="space-y-5 flex-1">
             <IntegrationItem icon={<Repeat size={14} />} name="n8n Workflow Engine" status="CONNECTED" url="v3.aurum-n8n.io" latency="14ms" />
             <IntegrationItem icon={<MessageSquare size={14} />} name="Chatwoot Omnihub" status="CONNECTED" url="chat.neuronads.com" latency="32ms" />
             <IntegrationItem icon={<Database size={14} />} name="Odoo ERP Link" status="SYNCING" url="erp.holding.sys" latency="156ms" />
          </div>

          <button 
            disabled={!isConnected || syncing}
            onClick={handleSync}
            className={`mt-10 w-full py-4 rounded-xl border font-orbitron text-[10px] font-black tracking-widest transition-all flex items-center justify-center gap-3 
              ${!isConnected ? 'border-slate-800 text-slate-700 cursor-not-allowed' : 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 shadow-lg hover:shadow-cyan-500/10'}`}
          >
            {syncing ? (
              <>
                <Activity size={18} className="animate-spin" />
                REFRESCANDO NODOS...
              </>
            ) : (
              <>
                <Send size={18} />
                SINC. MANUAL GLOBAL
              </>
            )}
          </button>
        </div>

        {/* Console Log */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col">
          <h3 className="font-orbitron font-bold metallic-text uppercase text-sm tracking-widest mb-6">Uplink Activity Log</h3>
          <div className="flex-1 font-mono text-[9px] text-slate-500 space-y-2 uppercase">
            <p className="text-cyan-400/70">> [08:42:11] n8n: Trigger "New Lead" detectado en Meta Ads.</p>
            <p className="text-emerald-400/70">> [08:42:13] Chatwoot: Conversación iniciada en Nodo #442.</p>
            <p className="text-slate-600">> [08:45:01] System: Heartbeat 8888 exitoso.</p>
            <p className="text-cyan-400/70">> [08:48:22] n8n: Pipeline de calificación de lead completado.</p>
            <p className="text-amber-400/70">> [08:50:11] Chatwoot: Latencia elevada en canal TikTok.</p>
            <p className="text-slate-600">> [08:52:00] Aurum: Sincronización de facturación completada.</p>
          </div>
          <div className="mt-8 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
             <div className="flex justify-between items-center text-[10px] font-orbitron">
                <span className="text-slate-400">ANCHO DE BANDA NEURAL</span>
                <span className="text-cyan-400">88.4 Gbps</span>
             </div>
             <div className="h-1 w-full bg-slate-900 mt-2 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationItem: React.FC<{ icon: React.ReactNode, name: string, status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING', url: string, latency: string }> = ({ icon, name, status, url, latency }) => (
  <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl hover:border-cyan-500/20 transition-all group">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/30 transition-colors ${status === 'CONNECTED' ? 'text-cyan-400' : status === 'SYNCING' ? 'text-amber-400' : 'text-slate-600'}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200 uppercase tracking-tight">{name}</p>
          <p className="text-[9px] font-mono text-slate-500 mt-0.5">{url}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-[8px] font-orbitron px-2 py-0.5 rounded-full border ${status === 'CONNECTED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : status === 'SYNCING' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5 animate-pulse' : 'border-slate-800 text-slate-600'}`}>
          {status}
        </span>
        <p className="text-[9px] font-mono text-slate-600 mt-1 uppercase">L: {latency}</p>
      </div>
    </div>
  </div>
);

export default AurumUplink;
