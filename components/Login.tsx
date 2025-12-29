
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Fingerprint, ChevronLeft, ShieldCheck, Cpu } from 'lucide-react';

const Login: React.FC<{ onLoginSuccess: () => void, onBack: () => void }> = ({ onLoginSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
      
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-slate-500 hover:text-cyan-400 flex items-center gap-2 font-orbitron text-[10px] uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={16} /> Volver a la Web
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-3xl backdrop-blur-xl shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
             <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center shadow-2xl">
                <Cpu className="text-cyan-400 animate-pulse" size={40} />
             </div>
          </div>

          <div className="text-center mt-10 mb-8">
            <h2 className="text-2xl font-orbitron font-black text-white tracking-widest uppercase">Acceso Staff</h2>
            <p className="text-[10px] font-orbitron text-cyan-400/60 uppercase tracking-[0.4em] mt-1">Terminal NeuronAds OS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">ID Operativo</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="USER_NODE_01" 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-sm font-mono focus:border-cyan-500 outline-none transition-all placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Clave de Nodo</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-sm focus:border-cyan-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-orbitron text-slate-500 px-1">
               <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                  <input type="checkbox" className="accent-cyan-500" /> Recordar Nodo
               </label>
               <a href="#" className="hover:text-cyan-400">¿Olvido de Clave?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-cyan-600 to-cyan-400 text-slate-950 rounded-xl font-orbitron font-black text-xs hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>Sincronizar Handshake <Fingerprint size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-center gap-3">
             <ShieldCheck size={16} className="text-emerald-500" />
             <span className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Protocolo Aurum 8888 Activo</span>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
              Authorized personnel only. Intrusions will be logged by Aurum Holding Systems.
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
