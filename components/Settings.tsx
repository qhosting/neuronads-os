import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  Cpu, 
  Save,
  Tag,
  Sparkles,
  FileText,
  Palette,
  AlignLeft,
  Smartphone,
  CheckCircle2,
  Percent,
  PenTool,
  Fingerprint,
  Layout,
  Type as TypeIcon
} from 'lucide-react';
import { PdfTemplateConfig } from '../types';

const DEFAULT_PDF_CONFIG: PdfTemplateConfig = {
  primaryColor: '#020617',
  accentColor: '#22d3ee',
  companyName: 'NEURONADS MASTER NODE',
  companySlogan: 'NEURAL MARKETING & ADTECH SOLUTIONS',
  companyEmail: 'finance@neuronads.mx',
  companyAddress: 'AURUM DATA TOWER, LEVEL 88',
  companyTaxId: 'TAX-SYNAPSE-2024-X',
  authorizedSignature: 'DIRECTOR DE OPERACIONES NEURALES',
  taxPercentage: 16,
  terms: 'Esta arquitectura financiera es válida por 15 días. Sujeta a la armonización de nodos operativos de la red NeuronAds.',
  footerCode: '54121381948',
  showAiBadges: true,
  headerType: 'FUTURISTIC',
  executiveSummaryTitle: 'ANÁLISIS ESTRATÉGICO DE IMPACTO',
  typographyStyle: 'MODERN'
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PDF' | 'IA' | 'API'>('PDF');
  const [pdfConfig, setPdfConfig] = useState<PdfTemplateConfig>(() => {
    const saved = localStorage.getItem('neuron_pdf_config');
    return saved ? JSON.parse(saved) : DEFAULT_PDF_CONFIG;
  });
  const [showSaved, setShowSaved] = useState(false);

  const saveConfig = () => {
    localStorage.setItem('neuron_pdf_config', JSON.stringify(pdfConfig));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    window.dispatchEvent(new Event('neuron_settings_updated'));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Córtex de Configuración</h2>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] mt-1">Terminal de Control Maestro NeuronAds OS</p>
        </div>
        <button 
          onClick={saveConfig}
          className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-[0_0_25px_rgba(34,211,238,0.3)] group"
        >
          <Save size={16} className={showSaved ? 'hidden' : 'group-hover:scale-110 transition-transform'} />
          {showSaved ? <CheckCircle2 size={16} className="animate-bounce" /> : 'GUARDAR CAMBIOS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <SettingsNavButton icon={<Tag size={16} />} label="Catálogo" active={activeTab === 'SERVICES'} onClick={() => setActiveTab('SERVICES')} />
          <SettingsNavButton icon={<FileText size={16} />} label="PDF Architect" active={activeTab === 'PDF'} onClick={() => setActiveTab('PDF')} />
          <SettingsNavButton icon={<Cpu size={16} />} label="Parámetros IA" active={activeTab === 'IA'} onClick={() => setActiveTab('IA')} />
          <SettingsNavButton icon={<Key size={16} />} label="API Connect" active={activeTab === 'API'} onClick={() => setActiveTab('API')} />
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'PDF' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
                  <div className="absolute top-4 right-8 opacity-5"><FileText size={150} /></div>
                  
                  <h3 className="font-orbitron font-bold text-cyan-400 text-[10px] uppercase mb-10 flex items-center gap-2 tracking-[0.4em]">
                    <Palette size={18} /> Arquitectura de Identidad Visual PDF
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      {/* Estilo de Cabecera */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Layout size={12} className="text-cyan-400" /> Estilo de Plantilla
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['MINIMAL', 'CORPORATE', 'FUTURISTIC'].map(style => (
                            <button 
                              key={style}
                              onClick={() => setPdfConfig({...pdfConfig, headerType: style as any})}
                              className={`py-3 rounded-xl border text-[9px] font-orbitron font-black transition-all ${pdfConfig.headerType === style ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-lg' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'}`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Palette size={12} className="text-cyan-400" /> Colores del Handshake
                        </label>
                        <div className="flex gap-4">
                          {[
                            { name: 'Cyan', main: '#020617', acc: '#22d3ee' },
                            { name: 'Gold', main: '#1c1917', acc: '#fbbf24' },
                            { name: 'Emerald', main: '#020617', acc: '#10b981' },
                            { name: 'DeepBlue', main: '#0f172a', acc: '#38bdf8' }
                          ].map(theme => (
                            <button 
                              key={theme.name} 
                              onClick={() => setPdfConfig({...pdfConfig, primaryColor: theme.main, accentColor: theme.acc})}
                              className={`w-12 h-12 rounded-2xl border-2 transition-all relative overflow-hidden flex ${pdfConfig.accentColor === theme.acc ? 'ring-2 ring-cyan-500 ring-offset-4 ring-offset-slate-900 scale-110 shadow-lg' : 'border-slate-800'}`}
                            >
                               <div className="flex-1" style={{ backgroundColor: theme.main }} />
                               <div className="w-1/3" style={{ backgroundColor: theme.acc }} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Entidad Legal Emisora</label>
                        <input 
                          type="text" 
                          value={pdfConfig.companyName}
                          onChange={e => setPdfConfig({...pdfConfig, companyName: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1">Título Resumen Ejecutivo</label>
                        <input 
                          type="text" 
                          value={pdfConfig.executiveSummaryTitle}
                          onChange={e => setPdfConfig({...pdfConfig, executiveSummaryTitle: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-2">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1 flex items-center justify-between">
                          <span>Cláusulas del Handshake</span>
                          <AlignLeft size={10} />
                        </label>
                        <textarea 
                          value={pdfConfig.terms}
                          onChange={e => setPdfConfig({...pdfConfig, terms: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] text-slate-400 italic h-32 resize-none outline-none focus:border-cyan-500/50 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Fingerprint size={12} className="text-cyan-400" /> Sello de Frecuencia Grabovoi
                        </label>
                        <input 
                          type="text" 
                          value={pdfConfig.footerCode}
                          onChange={e => setPdfConfig({...pdfConfig, footerCode: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-cyan-400 font-mono tracking-widest outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between p-5 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Sparkles size={16} className="text-cyan-400" />
                          <div>
                            <p className="text-[10px] font-orbitron text-white uppercase tracking-widest font-black">Insignias IA</p>
                            <p className="text-[8px] text-slate-500 uppercase font-mono tracking-tighter">Distintivos de procesamiento Gemini</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pdfConfig.showAiBadges} 
                            onChange={e => setPdfConfig({...pdfConfig, showAiBadges: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                       <Smartphone size={24} />
                     </div>
                     <div>
                       <h4 className="text-xs font-orbitron font-black text-emerald-400 uppercase tracking-widest">Sincronización de Canal</h4>
                       <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">La identidad PDF se sincroniza con el Uplink de WhatsApp y n8n.</p>
                     </div>
                   </div>
                   <button className="text-[10px] font-orbitron font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                     RECARGAR NODOS <AlignLeft size={14} />
                   </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SettingsNavButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
      active ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-lg' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
    }`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-[10px] font-orbitron font-black uppercase tracking-widest">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
  </button>
);

export default Settings;