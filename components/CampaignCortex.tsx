
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Search, 
  Music, 
  Zap, 
  Cpu,
  Star,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Copy
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PlatformStatus, Campaign, UserRole } from '../types';

const PLATFORMS: PlatformStatus[] = [
  { name: 'Meta Ads API', status: 'ONLINE', latency: '42ms' },
  { name: 'Google Ads API', status: 'ONLINE', latency: '12ms' },
  { name: 'TikTok Marketing API', status: 'DEGRADED', latency: '210ms' },
];

const ACTIVE_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Inmobiliaria Conversión V2', platform: 'META', budget: 5000, spent: 3200, status: 'ACTIVE', roas: 5.2 },
  { id: '2', name: 'Búsqueda Hipotecas - Broad', platform: 'GOOGLE', budget: 2000, spent: 1850, status: 'LEARNING', roas: 3.1 },
  { id: '3', name: 'Viral Hook 01 - Branding', platform: 'TIKTOK', budget: 1500, spent: 450, status: 'ACTIVE', roas: 2.8 },
];

const CampaignCortex: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const isClient = userRole === UserRole.CLIENT;
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');

  const generateNeuralCopy = async () => {
    setAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Genera un copy publicitario disruptivo para Meta Ads de una inmobiliaria de lujo. Usa psicología de escasez, lenguaje neural de alto impacto y termina con un llamado a la acción magnético. En español.",
      });
      setGeneratedCopy(response.text || "Fallo en la síntesis creativa.");
    } catch (error) {
      setGeneratedCopy("Error: Nodo de IA desconectado.");
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {!isClient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORMS.map((plat) => (
            <div key={plat.name} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                  {plat.name.includes('Meta') ? <Facebook size={20} /> : plat.name.includes('Google') ? <Search size={20} /> : <Music size={20} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold metallic-text uppercase tracking-tight">{plat.name}</h4>
                  <p className="text-[9px] text-slate-500 font-mono uppercase">LATENCIA: {plat.latency}</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm shadow-xl gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
            <Cpu className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-bold text-cyan-400 uppercase tracking-tight">Córtex Operativo</h3>
            <p className="text-sm text-slate-400">
              {isClient ? 'Estado actual de tus inversiones publicitarias.' : 'Optimizando frecuencias algorítmicas en tiempo real.'}
            </p>
          </div>
        </div>
        
        {!isClient ? (
          <div className="flex gap-4">
             <div className="relative group">
              <button 
                onClick={generateNeuralCopy}
                disabled={aiGenerating}
                className="px-6 py-4 bg-cyan-500 text-slate-950 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-cyan-500/20 flex items-center gap-2"
              >
                {aiGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                GENERAR COPY IA
              </button>
            </div>
            <div className="relative group">
              <button className="px-6 py-4 bg-slate-950 border border-cyan-500/50 text-cyan-400 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-500/10 transition-all shadow-cyan-500/20">
                OPTIMIZAR ALGORITMO
              </button>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950 border border-cyan-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                 <span className="text-[9px] font-mono text-cyan-400">Grabovoi: 212 585 212</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
             <Star className="text-emerald-400" size={18} />
             <span className="text-[10px] font-orbitron text-emerald-400 uppercase font-black">Cuenta Premium Activa</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-orbitron font-bold metallic-text uppercase tracking-widest text-xs">Estado de Campañas</h3>
            <span className="text-[10px] text-slate-500 font-mono">Grabovoi Active: 212 585 212</span>
          </div>
          <div className="space-y-8">
            {ACTIVE_CAMPAIGNS.map(camp => (
              <div key={camp.id} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-100 uppercase tracking-tight">{camp.name}</span>
                    <span className="text-[8px] font-orbitron px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded uppercase">{camp.platform}</span>
                  </div>
                  <span className="text-sm font-black text-cyan-400 font-mono">{camp.roas}x ROAS</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(camp.spent / camp.budget) * 100}%` }} className="h-full bg-cyan-500" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                  <span>${camp.spent.toLocaleString()}</span>
                  <span>PRESUPUESTO: ${camp.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col min-h-[400px]">
           <h3 className="font-orbitron font-bold metallic-text uppercase tracking-widest text-xs mb-8">Creatividad Sináptica</h3>
           
           <AnimatePresence mode="wait">
            {generatedCopy ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 bg-slate-950/50 border border-cyan-500/20 rounded-2xl p-6 relative group">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedCopy}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedCopy)}
                    className="absolute top-4 right-4 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => setGeneratedCopy('')}
                  className="mt-4 text-[10px] font-orbitron text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-widest self-center"
                >
                  Limpiar Síntesis
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-cyan-500/10 blur-xl animate-pulse" />
                  <Sparkles className="text-slate-700" size={32} />
                </div>
                <div>
                   <h4 className="font-orbitron font-bold text-slate-500 uppercase text-xs mb-2">Generador Neural</h4>
                   <p className="text-[10px] text-slate-600 uppercase max-w-[250px]">Presione el botón superior para sintetizar creativos de alta conversión mediante el nodo Gemini 3.</p>
                </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CampaignCortex;
