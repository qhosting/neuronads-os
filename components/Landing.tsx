
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Brain, 
  ChevronRight, 
  ShieldCheck, 
  Cpu,
  ArrowRight,
  MousePointer2,
  BarChart3,
  X,
  Target,
  TrendingUp,
  Layers,
  Globe,
  PieChart,
  Terminal,
  MessageSquare,
  CheckCircle2,
  Search,
  Layout,
  Instagram,
  Facebook
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingProps {
  onEnterLogin: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onEnterLogin }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const [password, setPassword] = useState('');
  const [isEstablishing, setIsEstablishing] = useState(false);
  const [metrics, setMetrics] = useState({ adSpend: 8450200, avgRoas: 5.2, activeNodes: 312 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        adSpend: prev.adSpend + Math.floor(Math.random() * 1000),
        avgRoas: parseFloat((prev.avgRoas + (Math.random() * 0.01 - 0.005)).toFixed(2)),
        activeNodes: prev.activeNodes
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEstablishing(true);

    // Inferencia de Rol por Email
    let role: UserRole = UserRole.CLIENT;
    const identifier = nodeId.toLowerCase();
    
    if (identifier.includes('ceo') || identifier.includes('master') || identifier === 'admin@neuronads.com') {
      role = UserRole.CEO;
    } else if (identifier.includes('staff') || identifier.includes('op') || identifier.includes('agent')) {
      role = UserRole.STAFF;
    }

    setTimeout(() => {
      onEnterLogin(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-inter overflow-x-hidden relative">
      {/* CAPA DE FONDO: GRID DINÁMICO */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* GRADIENTES NEURALES */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Brain size={22} className="text-cyan-400" />
            </div>
            <span className="font-orbitron font-black text-xl tracking-tighter text-white">NEURONADS<span className="text-cyan-500">.</span>OS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            <div className="flex gap-8 text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-[0.3em]">
              <a href="#soluciones" className="hover:text-cyan-400 transition-colors">Soluciones</a>
              <a href="#performance" className="hover:text-cyan-400 transition-colors">Performance</a>
              <a href="#terminal" className="hover:text-cyan-400 transition-colors">Uplink</a>
            </div>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="px-6 py-2 bg-transparent border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-orbitron font-black hover:bg-cyan-500/10 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              CLIENT ACCESS
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5">
              <Zap size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-orbitron font-black text-cyan-400 uppercase tracking-[0.2em]">Agencia AdTech de Alto Rendimiento</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-orbitron font-black leading-[0.85] uppercase tracking-tighter text-white">
              Escalado <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Predictivo</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-xl">
              Dominamos los algoritmos de <span className="text-white font-bold">Meta, Google y TikTok</span> para transformar tu inversión publicitaria en una máquina de generación de ingresos.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={() => setIsDiscoveryOpen(true)}
                className="group px-12 py-6 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron font-black text-sm transition-all hover:scale-105 hover:bg-cyan-400 shadow-[0_20px_50px_rgba(34,211,238,0.3)] flex items-center justify-center gap-4"
              >
                SOLICITAR AUDITORÍA ADS
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-10 py-6 bg-slate-900 border border-white/10 text-white rounded-2xl font-orbitron font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                TERMINAL DE CLIENTE
              </button>
            </div>

            <div className="flex items-center gap-10 pt-10 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">Inversión Gestionada</p>
                <p className="text-3xl font-orbitron font-black text-white">${(metrics.adSpend/1000000).toFixed(1)}M+</p>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="space-y-1">
                <p className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">ROAS Histórico</p>
                <p className="text-3xl font-orbitron font-black text-cyan-400">{metrics.avgRoas}x</p>
              </div>
            </div>
          </motion.div>

          {/* VISUAL COMPONENT: NEURAL INTERFACE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-4 backdrop-blur-3xl shadow-2xl">
               <div className="bg-slate-950 rounded-[2.5rem] p-10 aspect-square border border-white/5 relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[10px] font-orbitron font-black text-cyan-500 uppercase tracking-widest">Global Matrix</span>
                       <h4 className="text-2xl font-orbitron font-black text-white uppercase tracking-tighter">Real-Time Cortex</h4>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                       <Activity size={24} className="animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-3">
                       <div className="flex justify-between text-[9px] font-orbitron text-slate-500 uppercase">
                          <span>Ad Efficiency</span>
                          <span className="text-cyan-400">98.4%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 2 }} className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                          <TrendingUp className="text-emerald-400 mb-2" size={18} />
                          <p className="text-[8px] font-orbitron text-slate-500 uppercase">LTV Scaling</p>
                          <p className="text-lg font-orbitron font-black text-white">+240%</p>
                       </div>
                       <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
                          <Target className="text-blue-400 mb-2" size={18} />
                          <p className="text-[8px] font-orbitron text-slate-500 uppercase">CPA Optimization</p>
                          <p className="text-lg font-orbitron font-black text-white">-42%</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-4 border-t border-white/5">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                     <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest italic">Handshake Active: Protocol 8888</span>
                  </div>
               </div>
            </div>
            
            {/* FLOATING DECOR */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse" />
          </motion.div>
        </div>
      </main>

      {/* SOLUTIONS SECTION */}
      <section id="soluciones" className="py-40 px-6 max-w-7xl mx-auto relative z-10">
         <div className="text-center mb-24 space-y-4">
            <h2 className="text-[10px] font-orbitron font-black text-cyan-500 uppercase tracking-[0.5em]">Ingeniería de Ventas</h2>
            <h3 className="text-5xl md:text-6xl font-orbitron font-black text-white uppercase tracking-tighter">Nodos Operativos NeuronAds</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <SolutionCard 
              icon={<Facebook className="text-blue-400" />}
              title="Social Ads Scaling"
              description="Dominio total de Meta & Instagram Ads enfocados en venta directa y generación de leads calificados."
              tags={['ROAS', 'Scaling', 'AI Copy']}
            />
            <SolutionCard 
              icon={<Search className="text-emerald-400" />}
              title="Search Dominance"
              description="Capturamos la intención de búsqueda en Google Ads con campañas de búsqueda y Performance Max."
              tags={['PMax', 'SEM', 'Keywords']}
            />
            <SolutionCard 
              icon={<Layout className="text-indigo-400" />}
              title="Conversion Web"
              description="Diseño y desarrollo de Landing Pages y Sitios Web optimizados para convertir tráfico en dinero."
              tags={['UX/UI', 'Speed', 'SEO']}
            />
            <SolutionCard 
              icon={<Cpu className="text-cyan-400" />}
              title="IA Operativa"
              description="Automatización de procesos de venta y calificación de leads mediante modelos de lenguaje propios."
              tags={['LLMs', 'CRM', 'Automations']}
            />
         </div>
      </section>

      {/* AUDIT MODAL (LEAD CAPTURE) */}
      <AnimatePresence>
        {isDiscoveryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDiscoveryOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />
              <div className="flex justify-between items-start mb-12">
                <div>
                   <h3 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">Auditoría Neural</h3>
                   <p className="text-[11px] font-orbitron text-cyan-400/70 uppercase tracking-widest mt-2">Diagnóstico de rendimiento publicitario</p>
                </div>
                <button onClick={() => setIsDiscoveryOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500"><X size={24} /></button>
              </div>

              <form className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Entidad de Negocio</label>
                       <input type="text" placeholder="Nombre de tu marca" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Punto de Contacto</label>
                       <input type="email" placeholder="Email corporativo" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Inversión Mensual Estimada</label>
                    <select className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-slate-300 outline-none focus:border-cyan-500/40 appearance-none transition-all">
                       <option>$1,000 - $5,000 USD</option>
                       <option>$5,000 - $20,000 USD</option>
                       <option>$20,000 - $50,000 USD</option>
                       <option>$50,000+ USD</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Desafío Crítico</label>
                    <textarea placeholder="¿Cuál es tu principal problema hoy? (Bajas ventas, CPA alto, falta de leads...)" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-500/40 h-32 resize-none transition-all" />
                 </div>
                 
                 <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center gap-5">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
                      <ShieldCheck size={28} />
                    </div>
                    <p className="text-[11px] text-slate-400 uppercase leading-relaxed font-mono">Nuestro Córtex IA analizará tu presencia digital para entregarte un reporte de viabilidad y escalamiento en 24 horas.</p>
                 </div>

                 <button className="w-full py-6 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron font-black text-sm hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/20 flex items-center justify-center gap-4">
                    SOLICITAR DIAGNÓSTICO ESTRATÉGICO <ChevronRight size={20} />
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL (SMART INFERENCE) */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLoginOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[3rem] p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-600 to-blue-600" />
              
              <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                  <Cpu className="text-cyan-400 animate-pulse" size={38} />
                </div>
                <h3 className="text-3xl font-orbitron font-black text-white uppercase tracking-widest text-center">Uplink</h3>
                <p className="text-[10px] font-orbitron text-cyan-400/60 uppercase tracking-[0.5em] mt-3">Node Connection Requiered</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">ID Operativo / Email</label>
                  <input 
                    type="text" 
                    placeholder="user@neuronads.com" 
                    required 
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm font-mono text-white focus:border-cyan-500/50 outline-none transition-all placeholder:opacity-20" 
                  />
                  <p className="text-[8px] text-slate-600 uppercase italic font-mono">Security protocol will infer your node access level.</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:border-cyan-500/50 outline-none transition-all" 
                  />
                </div>
                
                <button 
                  disabled={isEstablishing}
                  className="w-full py-6 bg-gradient-to-r from-cyan-600 to-cyan-400 text-slate-950 rounded-2xl font-orbitron font-black text-xs hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-4 uppercase"
                >
                  {isEstablishing ? 'Synchronizing Node...' : (
                    <>Establish Connection <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="mt-12 flex items-center justify-center gap-4">
                 <ShieldCheck size={18} className="text-emerald-500" />
                 <span className="text-[9px] font-orbitron text-slate-500 uppercase tracking-[0.4em]">Protocol 8888 Secured</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-10 py-32 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-600 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Brain size={32} className="text-slate-800" />
            <span className="font-orbitron font-black text-xl tracking-widest opacity-40">NEURONADS</span>
          </div>
          <p className="text-xs max-w-xs font-light leading-relaxed">Agencia de inteligencia publicitaria orientada a resultados masivos y escalado de capital mediante tecnología AdTech.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-[10px] font-mono uppercase tracking-widest">
          <div className="flex flex-col gap-4">
            <span className="text-slate-400 font-bold">Base Central</span>
            <span className="text-slate-600">Digital Tower, L12<br/>Financial District</span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-slate-400 font-bold">Canales</span>
            <span className="text-slate-600">ops@neuronads.com<br/>+1 800 NEURAL</span>
          </div>
          <div className="flex flex-col gap-4 hidden md:flex">
            <span className="text-slate-400 font-bold">Infraestructura</span>
            <span className="text-slate-600">Uplink: 8888<br/>Latency: 4ms</span>
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase text-slate-800 tracking-[0.5em]">
           ©2024 NEURONADS OS - ADTECH SYNERGY
        </div>
      </footer>
    </div>
  );
};

const SolutionCard: React.FC<{ icon: React.ReactNode, title: string, description: string, tags: string[] }> = ({ icon, title, description, tags }) => (
  <motion.div 
    whileHover={{ y: -15, borderColor: 'rgba(34, 211, 238, 0.4)' }}
    className="bg-slate-900/50 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl group transition-all shadow-2xl"
  >
     <div className="p-5 bg-slate-950 border border-white/5 rounded-2xl w-fit mb-10 shadow-inner group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all">
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
     </div>
     <h4 className="text-2xl font-orbitron font-black text-white uppercase tracking-tight mb-5">{title}</h4>
     <p className="text-slate-400 text-sm leading-relaxed font-light mb-8">{description}</p>
     <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="text-[8px] font-orbitron font-bold text-slate-500 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">{tag}</span>
        ))}
     </div>
  </motion.div>
);

export default Landing;
