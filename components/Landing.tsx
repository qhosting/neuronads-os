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
  Target,
  TrendingUp,
  Globe,
  Terminal,
  MessageSquare,
  CheckCircle2,
  Search,
  Layout,
  Instagram,
  Facebook,
  Music,
  MousePointer2,
  Sparkles,
  X,
  Layers,
  BarChart3
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
  const [metrics, setMetrics] = useState({ adSpend: 12450800, avgRoas: 5.4, activeNodes: 412 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        adSpend: prev.adSpend + Math.floor(Math.random() * 5000),
        avgRoas: parseFloat((prev.avgRoas + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        activeNodes: prev.activeNodes
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEstablishing(true);
    let role: UserRole = UserRole.CLIENT;
    const identifier = nodeId.toLowerCase();
    
    if (identifier.includes('ceo') || identifier.includes('master') || identifier === 'admin@neuronads.mx') {
      role = UserRole.CEO;
    } else if (identifier.includes('staff') || identifier.includes('op') || identifier.includes('agent')) {
      role = UserRole.STAFF;
    }

    setTimeout(() => {
      onEnterLogin(role);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30 font-inter overflow-x-hidden relative">
      {/* --- BACKGROUND INFRASTRUCTURE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(8,145,178,0.15)_0%,_transparent_50%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-slate-950/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Brain size={22} className="text-cyan-400" />
            </div>
            <span className="font-orbitron font-black text-xl tracking-tighter text-white">NEURONADS<span className="text-cyan-500">.</span>MX</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8 text-[9px] font-orbitron font-bold text-slate-400 uppercase tracking-[0.4em]">
              <a href="#performance" className="hover:text-cyan-400 transition-colors">Performance</a>
              <a href="#presence" className="hover:text-cyan-400 transition-colors">Web Presence</a>
              <a href="#content" className="hover:text-cyan-400 transition-colors">Neural Content</a>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900/50 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-orbitron font-black hover:bg-cyan-500/10 transition-all"
            >
              <Terminal size={12} className="group-hover:animate-pulse" />
              SATELLITE ACCESS
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-orbitron font-black text-cyan-400 uppercase tracking-[0.2em]">Next-Gen AdTech Synergy</span>
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-orbitron font-black leading-[0.9] uppercase tracking-tighter text-white mb-8">
              Dominio <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Algorítmico</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-xl mb-12">
              Transformamos la inversión en <span className="text-white font-bold">capital inteligente</span>. Somos el sistema operativo que tu marca necesita para escalar en Meta, Google y TikTok.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => setIsDiscoveryOpen(true)}
                className="group px-10 py-5 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron font-black text-xs transition-all hover:scale-105 hover:bg-cyan-400 shadow-[0_20px_50px_rgba(34,211,238,0.2)] flex items-center justify-center gap-3"
              >
                SINTETIZAR AUDITORÍA
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-8 py-5 bg-slate-950 border border-white/10 text-white rounded-2xl font-orbitron font-black text-[10px] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 tracking-widest"
              >
                ACCESO TERMINAL
              </button>
            </div>

            <div className="flex items-center gap-12 pt-16 mt-16 border-t border-white/5">
              <div>
                <p className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest mb-1">Inversión bajo Gestión</p>
                <p className="text-2xl font-orbitron font-black text-white">${(metrics.adSpend/1000000).toFixed(1)}M+</p>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div>
                <p className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest mb-1">ROAS Promedio</p>
                <p className="text-2xl font-orbitron font-black text-cyan-400">{metrics.avgRoas}x</p>
              </div>
            </div>
          </motion.div>

          {/* Neural Interface Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 bg-slate-900/40 border border-white/10 rounded-[3rem] p-4 backdrop-blur-3xl shadow-2xl">
              <div className="bg-slate-950 rounded-[2.5rem] p-10 aspect-square border border-white/5 flex flex-col justify-between overflow-hidden relative">
                {/* Simulated Data Streams */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   {[...Array(5)].map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ x: ['-100%', '100%'] }}
                       transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                       className="h-px w-full bg-cyan-400 absolute"
                       style={{ top: `${i * 25}%` }}
                     />
                   ))}
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <span className="text-[9px] font-orbitron font-black text-cyan-500 uppercase tracking-[0.3em]">Cortex Engine</span>
                    <h4 className="text-2xl font-orbitron font-black text-white uppercase tracking-tighter">Live Synthesis</h4>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Activity size={24} className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricMiniCard icon={<TrendingUp size={16} />} label="ROAS" value="5.8x" color="emerald" />
                    <MetricMiniCard icon={<Target size={16} />} label="CTR" value="4.2%" color="blue" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-orbitron text-slate-500 uppercase">
                      <span>Neural Calibration</span>
                      <span className="text-cyan-400">92.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '92.4%' }} 
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-4 border-t border-white/5 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Protocol 8888 Secured & Active</span>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-cyan-500/5 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* --- PLATFORM ECOSYSTEM --- */}
      <section className="py-20 border-y border-white/5 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[9px] font-orbitron font-black text-slate-500 uppercase tracking-[0.5em] mb-12">Nodos de Red Integrados</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
            <PlatformLogo icon={<Facebook size={24} />} name="Meta Ads" />
            <PlatformLogo icon={<Search size={24} />} name="Google Ads" />
            <PlatformLogo icon={<Music size={24} />} name="TikTok Business" />
            <PlatformLogo icon={<Instagram size={24} />} name="Instagram" />
            <PlatformLogo icon={<Globe size={24} />} name="Open Web" />
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="presence" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-orbitron font-black text-cyan-500 uppercase tracking-[0.5em] mb-4">Arquitectura de Crecimiento</h2>
          <h3 className="text-4xl md:text-5xl font-orbitron font-black text-white uppercase tracking-tighter max-w-2xl mx-auto leading-tight">
            Nodos de Ejecución de <span className="text-cyan-400">Alto Rendimiento</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<Zap className="text-cyan-400" />}
            title="Performance Scaling"
            description="Escalamiento masivo en Meta y Google Ads. Optimizamos tu CPA mediante síntesis predictiva de datos."
            metric="5.2x AVG ROAS"
            tags={['Ads', 'ROI', 'Scaling']}
          />
          <ServiceCard 
            icon={<Globe className="text-blue-400" />}
            title="Neural Web Presence"
            description="Desarrollo de ecosistemas web de alta conversión. No solo sitios, sino terminales de venta 24/7."
            metric="<1s Load Time"
            tags={['Web', 'UX', 'Speed']}
          />
          <ServiceCard 
            icon={<Sparkles className="text-indigo-400" />}
            title="Synaptic Content"
            description="Contenido diseñado para el algoritmo. Copywriting neural y visuales que detienen el scroll."
            metric="+240% Engagement"
            tags={['Content', 'Viral', 'AI']}
          />
        </div>
      </section>

      {/* --- CORE CAPABILITIES --- */}
      <section id="content" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-orbitron font-black text-cyan-500 uppercase tracking-widest tracking-[0.4em]">Capacidad Operativa</h4>
                    <h3 className="text-4xl font-orbitron font-black text-white uppercase tracking-tighter">Inteligencia que <br/> Sincroniza con tus Ventas</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <CapabilityItem 
                      icon={<Brain size={20} />} 
                      title="AI Copywriting Engine" 
                      text="Generamos miles de variantes de anuncios en segundos, encontrando el ángulo ganador matemáticamente." 
                    />
                    <CapabilityItem 
                      icon={<BarChart3 size={20} />} 
                      title="Atribución de Precisión" 
                      text="Sabemos exactamente de dónde viene cada centavo de tu retorno mediante trackeo avanzado." 
                    />
                    <CapabilityItem 
                      icon={<Layers size={20} />} 
                      title="Sistemas de Venta Web" 
                      text="Embudos de conversión que guían al usuario por un camino neural directo hacia la compra." 
                    />
                 </div>
              </div>

              <div className="order-1 lg:order-2">
                 <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-slate-900 flex flex-col p-1">
                       <div className="h-8 bg-slate-800 rounded-t-[2rem] flex items-center px-6 gap-2 border-b border-white/5">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="ml-4 text-[8px] font-mono text-slate-500 uppercase">neuronads_v2_dashboard.sys</span>
                       </div>
                       <div className="flex-1 bg-[#020617] p-8 flex flex-col justify-center gap-8">
                          <div className="space-y-4">
                             <div className="h-4 w-48 bg-slate-800 rounded-full animate-pulse" />
                             <div className="h-4 w-64 bg-slate-800 rounded-full animate-pulse delay-75" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                             <div className="h-24 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                                <Activity className="text-cyan-400" />
                             </div>
                             <div className="h-24 bg-slate-900 rounded-2xl" />
                             <div className="h-24 bg-slate-900 rounded-2xl" />
                          </div>
                       </div>
                    </div>
                    {/* Floating HUD elements */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-12 -right-6 p-4 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl z-20"
                    >
                       <div className="flex items-center gap-3">
                          <Target className="text-cyan-400" size={16} />
                          <span className="text-[10px] font-orbitron text-white uppercase">CPA Optimized</span>
                       </div>
                    </motion.div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-40 px-6">
         <div className="max-w-5xl mx-auto bg-gradient-to-tr from-cyan-600 to-blue-700 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 space-y-10">
               <h3 className="text-4xl md:text-6xl font-orbitron font-black text-slate-950 uppercase tracking-tighter leading-none">
                  ¿Listo para la <br/> Sincronización?
               </h3>
               <p className="text-xl text-slate-900 font-medium max-w-2xl mx-auto opacity-80 leading-relaxed">
                  Solo trabajamos con marcas que tienen el potencial de escalar. Solicita tu auditoría neural hoy mismo y descubre tu verdadera capacidad de ingresos.
               </p>
               <button 
                 onClick={() => setIsDiscoveryOpen(true)}
                 className="px-14 py-6 bg-slate-950 text-white rounded-2xl font-orbitron font-black text-sm hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto"
               >
                  SOLICITAR AUDITORÍA ADS <ArrowRight size={20} />
               </button>
            </div>
            
            {/* Grabovoi Floating Code */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20">
               <span className="text-[10px] font-orbitron font-black text-slate-900 uppercase tracking-[1em]">212 585 212</span>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-white/5 bg-slate-950/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Brain size={32} className="text-cyan-500" />
              <span className="font-orbitron font-black text-2xl tracking-tighter text-white uppercase">NEURONADS</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Agencia AdTech de alto rendimiento. Especialistas en escalado de capital mediante inteligencia algorítmica y arquitectura de conversión web.
            </p>
            <div className="flex gap-4">
               <FooterSocial icon={<Instagram size={18} />} />
               <FooterSocial icon={<Facebook size={18} />} />
               <FooterSocial icon={<Music size={18} />} />
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-orbitron font-black text-white uppercase tracking-widest">Navegación</h5>
            <ul className="space-y-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
              <li><a href="#" className="hover:text-cyan-400">Ads Scaling</a></li>
              <li><a href="#" className="hover:text-cyan-400">Web Architect</a></li>
              <li><a href="#" className="hover:text-cyan-400">Neural Copy</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-orbitron font-black text-white uppercase tracking-widest">Infraestructura</h5>
            <div className="space-y-4 font-mono text-[10px] text-slate-600 uppercase">
               <p>Uplink: 8888 Secured</p>
               <p>Latency: 12ms Global</p>
               <p>Node: Alpha Central</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center">
           <p className="text-[9px] font-orbitron font-black text-slate-700 uppercase tracking-[1em]">©2024 NEURONADS MX | OPTIMIZED BY AI</p>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isDiscoveryOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDiscoveryOpen(false)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-500" />
              <div className="flex justify-between items-start mb-12">
                <div>
                   <h3 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">Neural Audit</h3>
                   <p className="text-[10px] font-orbitron text-cyan-400 uppercase tracking-widest mt-2">Diagnóstico de Potencial Escalamiento</p>
                </div>
                <button onClick={() => setIsDiscoveryOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500"><X size={24} /></button>
              </div>

              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Entidad</label>
                       <input type="text" placeholder="Marca / Empresa" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-500/40" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Contacto</label>
                       <input type="email" placeholder="Email Corporativo" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-500/40" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Canal de Interés</label>
                    <div className="grid grid-cols-3 gap-3">
                       {['Paid Ads', 'Web Conversion', 'Content Creation'].map(opt => (
                         <button key={opt} type="button" className="py-4 border border-white/5 rounded-xl text-[9px] font-orbitron font-bold text-slate-500 hover:border-cyan-500/50 hover:text-white transition-all">
                            {opt}
                         </button>
                       ))}
                    </div>
                 </div>
                 <button className="w-full py-6 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron font-black text-xs hover:bg-cyan-400 transition-all shadow-2xl flex items-center justify-center gap-3">
                    INICIAR SÍNTESIS DE REPORTE <ArrowRight size={18} />
                 </button>
              </form>
            </motion.div>
          </div>
        )}

        {isLoginOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLoginOpen(false)} className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />
              
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/10 flex items-center justify-center mb-6">
                  <Cpu className="text-cyan-400 animate-pulse" size={32} />
                </div>
                <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-widest">Handshake</h3>
                <p className="text-[9px] font-orbitron text-slate-500 uppercase tracking-[0.4em] mt-2">Node connection required</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">ID Operativo</label>
                  <input 
                    type="text" 
                    required 
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm font-mono text-white focus:border-cyan-500/50 outline-none transition-all placeholder:opacity-20" 
                    placeholder="NODE_USER_01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:border-cyan-500/50 outline-none transition-all" 
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  disabled={isEstablishing}
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl font-orbitron font-black text-[10px] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                >
                  {isEstablishing ? 'Sincronizando...' : (
                    <>Establecer Vínculo <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <div className="mt-10 flex items-center justify-center gap-3 text-slate-600">
                 <ShieldCheck size={16} />
                 <span className="text-[8px] font-orbitron uppercase tracking-[0.3em]">Protocol 8888 Active</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlatformLogo: React.FC<{ icon: React.ReactNode, name: string }> = ({ icon, name }) => (
  <div className="flex items-center gap-3">
    <div className="text-white">{icon}</div>
    <span className="text-[11px] font-orbitron font-black text-white uppercase tracking-tighter">{name}</span>
  </div>
);

const MetricMiniCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="p-3 bg-slate-950/50 border border-white/5 rounded-2xl">
    <div className={`text-${color}-400 mb-1`}>{icon}</div>
    <p className="text-[7px] font-orbitron text-slate-500 uppercase">{label}</p>
    <p className="text-xs font-orbitron font-black text-white">{value}</p>
  </div>
);

const ServiceCard: React.FC<{ icon: React.ReactNode, title: string, description: string, metric: string, tags: string[] }> = ({ icon, title, description, metric, tags }) => (
  <motion.div 
    whileHover={{ y: -10, borderColor: 'rgba(34, 211, 238, 0.3)' }}
    className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl group transition-all flex flex-col h-full"
  >
    <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all">
       {React.cloneElement(icon as React.ReactElement, { size: 28 })}
    </div>
    <h4 className="text-2xl font-orbitron font-black text-white uppercase tracking-tight mb-4">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed font-light mb-8 flex-1">{description}</p>
    <div className="pt-6 border-t border-white/5 flex flex-col gap-6">
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-orbitron font-black text-cyan-400 uppercase tracking-widest">{metric}</span>
          <div className="flex gap-1.5">
             {tags.map(tag => (
               <span key={tag} className="text-[7px] font-orbitron font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded-full border border-white/5">{tag}</span>
             ))}
          </div>
       </div>
    </div>
  </motion.div>
);

const CapabilityItem: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => (
  <div className="flex gap-6 group">
     <div className="w-12 h-12 flex-shrink-0 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
        {icon}
     </div>
     <div className="space-y-1">
        <h5 className="text-sm font-orbitron font-black text-white uppercase tracking-tight">{title}</h5>
        <p className="text-xs text-slate-500 leading-relaxed font-light">{text}</p>
     </div>
  </div>
);

const FooterSocial: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <a href="#" className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-600 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
    {icon}
  </a>
);

export default Landing;