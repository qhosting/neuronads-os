import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Trash2, 
  Send, 
  CheckCircle, 
  Brain, 
  Cpu,
  X,
  PlusCircle,
  Smartphone,
  MessageSquare,
  ArrowRight,
  Shield,
  Check,
  Scale,
  MapPin,
  Mail,
  Download,
  FileCheck,
  Printer,
  Share2,
  Eye,
  Terminal,
  Sparkles,
  Clock
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Quotation, QuotationItem, UserRole, IncomingRequest, ServiceItem, PdfTemplateConfig } from '../types';

const CATALOG_ITEMS: ServiceItem[] = [
  { id: 's1', name: 'Arquitectura de Marca', description: 'Desarrollo de identidad corporativa basado en posicionamiento competitivo y análisis de mercado.', price: 1500, category: 'BRANDING', billingCycle: 'ONCE' },
  { id: 's2', name: 'Performance Marketing Ads', description: 'Optimización de campañas en Meta y Google Ads enfocadas en retorno de inversión (ROI).', price: 2500, category: 'ADS', billingCycle: 'MONTHLY' },
  { id: 's3', name: 'Automatización con IA', description: 'Integración de modelos de lenguaje para optimización de procesos comerciales y atención al cliente.', price: 4000, category: 'AI', billingCycle: 'ONCE' },
  { id: 's4', name: 'Consultoría Estratégica', description: 'Planificación táctica orientada a la retención de usuarios y maximización de conversión.', price: 800, category: 'CONSULTING', billingCycle: 'ONCE' },
];

const DEFAULT_PDF_CONFIG: PdfTemplateConfig = {
  primaryColor: '#0f172a',
  accentColor: '#0891b2',
  companyName: 'NEURONADS AGENCY',
  companySlogan: 'INTELIGENCIA DE MERCADO & ADTECH SOLUTIONS',
  companyEmail: 'ops@neuronads.mx',
  companyAddress: 'FINANCIAL DISTRICT, CORPORATE ALPHA, LEVEL 12',
  companyTaxId: 'ID-PROC-2024-ADTECH',
  authorizedSignature: 'DIRECCIÓN DE OPERACIONES',
  taxPercentage: 16,
  terms: 'La presente cotización tiene una validez de 15 días naturales. Los servicios se rigen bajo los estándares de calidad y contratos de NeuronAds.',
  footerCode: '8888',
  showAiBadges: true,
  headerType: 'CORPORATE',
  executiveSummaryTitle: 'ANÁLISIS DE PROYECCIÓN ESTRATÉGICA',
  typographyStyle: 'MODERN'
};

const MOCK_REQUESTS: IncomingRequest[] = [
  { id: 'req-1', platform: 'WHATSAPP', clientName: 'Roberto Gomez', message: 'Hola, me interesa cotizar un servicio de branding y también correr anuncios en TikTok.', timestamp: new Date(), processed: false },
  { id: 'req-2', platform: 'WEB', clientName: 'Elena Pro', message: 'Quisiera integrar una IA que responda mis correos automáticamente.', timestamp: new Date(), processed: false },
];

const QuotationEngine: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const isClient = userRole === UserRole.CLIENT;
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [requests, setRequests] = useState<IncomingRequest[]>(MOCK_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);
  const [pdfConfig, setPdfConfig] = useState<PdfTemplateConfig>(DEFAULT_PDF_CONFIG);
  
  const [newQtTitle, setNewQtTitle] = useState('');
  const [newQtClient, setNewQtClient] = useState('');
  const [newQtItems, setNewQtItems] = useState<QuotationItem[]>([]);
  const [newQtJustification, setNewQtJustification] = useState('');

  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('neuron_pdf_config');
      if (saved) setPdfConfig(JSON.parse(saved));
    };
    loadConfig();
    window.addEventListener('neuron_settings_updated', loadConfig);
    return () => window.removeEventListener('neuron_settings_updated', loadConfig);
  }, []);

  const processIncomingRequest = async (req: IncomingRequest) => {
    setIsAiProcessing(true);
    setNewQtClient(req.clientName);
    setNewQtTitle(`Propuesta Técnica: ${req.clientName}`);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analiza este requerimiento: "${req.message}". Genera una selección de servicios comerciales del catálogo: ${CATALOG_ITEMS.map(i => `${i.name} ($${i.price})`).join(', ')}. Devuelve un JSON array de objetos con "name", "price", "description" y "quantity".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.NUMBER },
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER }
              }
            }
          }
        }
      });

      const items = JSON.parse(response.text || '[]');
      setNewQtItems(items.map((i: any) => ({ ...i, id: Math.random().toString(36).substr(2, 9) })));
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, processed: true } : r));
      
      const justificationResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Redacta un resumen ejecutivo formal de 3 líneas para: ${items.map((i: any) => i.name).join(', ')}. Enfoque: ROI y Eficiencia Operativa. Sin misticismos.`
      });
      setNewQtJustification(justificationResponse.text || '');
      setIsModalOpen(true);
    } catch (error) {
      console.error("Falla en motor IA:", error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const createQuotation = () => {
    const qt: Quotation = {
      id: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: 'EXT-NODE',
      clientName: newQtClient,
      title: newQtTitle,
      items: newQtItems,
      total: newQtItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
      status: 'DRAFT',
      createdAt: new Date(),
      aiJustification: newQtJustification,
      terms: pdfConfig.terms
    };
    setQuotations([qt, ...quotations]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewQtTitle('');
    setNewQtClient('');
    setNewQtItems([]);
    setNewQtJustification('');
  };

  const transmitQuotation = (qt: Quotation) => {
    alert(`Documento ${qt.id} enviado exitosamente.`);
    setQuotations(prev => prev.map(q => q.id === qt.id ? { ...q, status: 'SENT' } : q));
  };

  const downloadPdf = () => {
    window.print();
  };

  const subtotal = previewQuotation?.total || 0;
  const taxAmount = (subtotal * pdfConfig.taxPercentage) / 100;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-0">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8 no-print">
        <div>
          <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Motor de Propuestas</h2>
          <div className="flex items-center gap-4 mt-2">
             <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">Protocolo de Validación: <span className="text-cyan-400">{pdfConfig.footerCode}</span></p>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
             <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Servidor: Activo</p>
          </div>
        </div>
        {!isClient && (
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-lg"
          >
            <PlusCircle size={18} /> NUEVA PROPUESTA MANUAL
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {!isClient && (
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 font-black">
              <Terminal size={14} className="text-cyan-400" /> Requerimientos Entrantes
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {requests.map((req) => (
                <motion.div 
                  key={req.id}
                  whileHover={!req.processed ? { y: -2 } : {}}
                  className={`p-5 rounded-2xl border transition-all ${req.processed ? 'bg-slate-900/20 border-slate-800 opacity-50' : 'bg-slate-900/60 border-cyan-500/30 cursor-pointer shadow-lg'}`}
                  onClick={() => !req.processed && !isAiProcessing && processIncomingRequest(req)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${req.processed ? 'bg-slate-800' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        {req.platform === 'WHATSAPP' ? <Smartphone size={12} /> : <MessageSquare size={12} />}
                      </div>
                      <span className="text-[8px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">{req.platform}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-tight">{req.clientName}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-sans">"{req.message}"</p>
                  {!req.processed ? (
                    <div className="mt-4 flex items-center justify-between text-[8px] font-orbitron text-cyan-400 font-black tracking-widest">
                      <div className="flex items-center gap-2"><Brain size={12} className="animate-pulse" /> GENERAR CON IA</div>
                      <ArrowRight size={12} />
                    </div>
                  ) : <div className="mt-4 flex items-center gap-2 text-[8px] font-orbitron text-emerald-500 font-black tracking-widest"><CheckCircle size={12} /> PROCESADO</div>}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className={isClient ? "lg:col-span-12" : "lg:col-span-8"}>
          <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-black">
            <FileText size={14} className="text-cyan-400" /> Registro de Propuestas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {quotations.map((qt) => (
                <motion.div 
                  layout
                  key={qt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl p-7 relative overflow-hidden group transition-all shadow-xl hover:border-cyan-500/30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-cyan-400">
                        <FileCheck size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{qt.title}</h4>
                        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">{qt.id} • {qt.clientName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-6">
                    <div className="text-2xl font-orbitron font-black text-white">${qt.total.toLocaleString()}</div>
                    <span className="text-[8px] font-orbitron px-2 py-0.5 rounded border border-slate-700 text-slate-500 uppercase tracking-widest">{qt.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/50">
                    <button onClick={() => setPreviewQuotation(qt)} className="flex items-center justify-center gap-2 py-3.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-[9px] font-orbitron font-black hover:text-white transition-all"><Eye size={14} /> REVISAR PDF</button>
                    <button onClick={() => { setPreviewQuotation(qt); setTimeout(() => window.print(), 500); }} className="flex items-center justify-center gap-2 py-3.5 bg-cyan-500 text-slate-950 rounded-xl text-[9px] font-orbitron font-black hover:bg-cyan-400 transition-all shadow-lg"><Download size={14} /> DESCARGAR</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 no-print">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
                    <Brain size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-tighter">Configurador de Propuesta</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Razón Social del Cliente</label>
                       <input type="text" value={newQtClient} onChange={e => setNewQtClient(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Nombre del Proyecto</label>
                       <input type="text" value={newQtTitle} onChange={e => setNewQtTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-orbitron text-slate-500 uppercase tracking-widest">Resumen de Impacto</label>
                       <textarea value={newQtJustification} onChange={e => setNewQtJustification(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-[11px] text-slate-400 h-44 outline-none resize-none leading-relaxed font-sans italic" />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <span className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Desglose Técnico</span>
                       <button onClick={() => setNewQtItems([...newQtItems, { id: Date.now().toString(), name: 'Nuevo Servicio', price: 0, description: '', quantity: 1 }])} className="text-cyan-400 hover:text-white transition-colors"><PlusCircle size={18} /></button>
                    </div>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                       {newQtItems.map((item, idx) => (
                         <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-cyan-500/20 transition-all">
                            <div className="flex justify-between items-start">
                               <input type="text" value={item.name} onChange={e => {
                                 const updated = [...newQtItems]; updated[idx].name = e.target.value; setNewQtItems(updated);
                               }} className="bg-transparent border-b border-slate-800 text-xs text-white outline-none font-bold uppercase w-2/3" />
                               <button onClick={() => setNewQtItems(newQtItems.filter((_, i) => i !== idx))} className="text-slate-800 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                            <div className="flex gap-4">
                               <div className="flex-1">
                                  <input type="text" value={item.description} onChange={e => {
                                    const updated = [...newQtItems]; updated[idx].description = e.target.value; setNewQtItems(updated);
                                  }} className="w-full bg-transparent text-[10px] text-slate-500 outline-none border-b border-slate-800 pb-1" placeholder="Descripción técnica..." />
                               </div>
                               <div className="w-20">
                                  <input type="number" value={item.price} onChange={e => {
                                    const updated = [...newQtItems]; updated[idx].price = Number(e.target.value); setNewQtItems(updated);
                                  }} className="w-full bg-transparent text-[11px] text-cyan-400 font-mono outline-none text-right border-b border-slate-800 pb-1" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                       <div className="space-y-1">
                          <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">Inversión Estimada</span>
                          <div className="text-3xl font-orbitron font-black text-white">${newQtItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString()}</div>
                       </div>
                       <button onClick={createQuotation} className="px-10 py-4 bg-cyan-500 text-slate-950 rounded-xl font-orbitron font-black text-xs hover:bg-cyan-400 transition-all shadow-lg">FINALIZAR DOCUMENTO</button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewQuotation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 bg-slate-950/98 backdrop-blur-2xl">
            <button onClick={() => setPreviewQuotation(null)} className="absolute top-8 right-8 p-3 bg-slate-900 border border-slate-800 rounded-full text-white hover:scale-110 transition-all z-[120] no-print shadow-2xl"><X size={24} /></button>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl bg-white text-slate-950 p-8 sm:p-20 shadow-2xl h-[98vh] sm:h-[95vh] overflow-y-auto printable-area flex flex-col relative rounded-sm font-sans"
              style={{ borderTop: `18px solid ${pdfConfig.accentColor}` }}
              id="quotation-pdf-root"
            >
              <div className="absolute top-6 right-16 pointer-events-none opacity-20 no-print">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">SECURE_NODE: {pdfConfig.footerCode}</span>
              </div>

              {/* PDF HEADER VARIANTS */}
              <div className="mb-16 relative z-10">
                {pdfConfig.headerType === 'FUTURISTIC' ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 flex items-center justify-center shadow-2xl rounded-3xl" style={{ backgroundColor: pdfConfig.primaryColor }}>
                         <Cpu size={46} className="text-white" />
                      </div>
                      <div>
                         <span className="font-orbitron font-black text-3xl tracking-tighter block uppercase leading-none" style={{ color: pdfConfig.primaryColor }}>{pdfConfig.companyName}</span>
                         <div className="flex items-center gap-2 mt-2">
                           <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                           <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-slate-400 block">{pdfConfig.companySlogan}</span>
                         </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="inline-flex flex-col items-end gap-1 bg-slate-900 text-white px-10 py-6 rounded-2xl shadow-2xl" style={{ borderRight: `6px solid ${pdfConfig.accentColor}` }}>
                          <span className="text-[9px] font-orbitron uppercase tracking-widest opacity-60">Handshake ID</span>
                          <span className="text-3xl font-mono font-black">{previewQuotation.id}</span>
                          <span className="text-[10px] font-mono uppercase opacity-50 mt-1">{previewQuotation.createdAt.toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>
                ) : pdfConfig.headerType === 'CORPORATE' ? (
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-10">
                    <div className="space-y-4">
                       <h1 className="text-4xl font-orbitron font-black tracking-tighter uppercase" style={{ color: pdfConfig.primaryColor }}>{pdfConfig.companyName}</h1>
                       <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-4">
                          <span className="flex items-center gap-2"><MapPin size={12} /> {pdfConfig.companyAddress}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span className="flex items-center gap-2"><Mail size={12} /> {pdfConfig.companyEmail}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] font-orbitron font-bold text-slate-400 uppercase tracking-widest mb-1">PROYECTO TÉCNICO</p>
                       <p className="text-2xl font-black uppercase text-slate-900">{previewQuotation.id}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-1 w-24 bg-slate-900" style={{ backgroundColor: pdfConfig.accentColor }} />
                    <h1 className="text-3xl font-orbitron font-black uppercase" style={{ color: pdfConfig.primaryColor }}>{pdfConfig.companyName}</h1>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-[0.4em]">{pdfConfig.companySlogan}</p>
                  </div>
                )}
              </div>

              {/* CLIENT INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 relative z-10 items-center">
                 <div className="p-10 bg-slate-50 border-l-[6px] rounded-r-2xl" style={{ borderColor: pdfConfig.accentColor }}>
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">CLIENT_NODE:</h5>
                    <p className="text-4xl font-orbitron font-black uppercase tracking-tighter mb-2 text-slate-900 leading-none">{previewQuotation.clientName}</p>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-slate-400 uppercase">
                       <Clock size={12} />
                       <span>HANDSHAKE EXPIRES: 15 DAYS</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[12px] font-orbitron font-bold text-slate-400 uppercase tracking-widest mb-2">SINTESIS DE PROYECTO:</p>
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">{previewQuotation.title}</h4>
                 </div>
              </div>

              {/* AI ANALYSIS SECTION */}
              <div className="mb-16 relative z-10 p-12 bg-slate-900 text-white rounded-3xl shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Brain size={120} className="text-cyan-400" />
                 </div>
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                          <Sparkles size={20} />
                       </div>
                       <h4 className="text-[11px] font-orbitron font-black tracking-[0.4em] uppercase text-cyan-500">{pdfConfig.executiveSummaryTitle}</h4>
                    </div>
                    {pdfConfig.showAiBadges && (
                       <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[9px] font-orbitron font-black text-cyan-400 uppercase tracking-widest">
                          Gemini 3 Optimized
                       </div>
                    )}
                 </div>
                 <p className="text-xl font-sans italic leading-relaxed opacity-95 border-l-[4px] border-cyan-500/50 pl-10 max-w-3xl">"{previewQuotation.aiJustification}"</p>
              </div>

              {/* SERVICES TABLE */}
              <div className="flex-1 relative z-10 mb-16">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-[4px] border-slate-900 text-[12px] font-black uppercase tracking-widest text-slate-900">
                      <th className="py-8 text-left w-20 pr-6">CANT.</th>
                      <th className="py-8 text-left">ESPECIFICACIÓN DE SERVICIO</th>
                      <th className="py-8 text-right px-8">UNITARIO</th>
                      <th className="py-8 text-right">INVERSIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewQuotation.items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-10 text-left font-mono font-black text-slate-400 text-lg">{item.quantity}</td>
                        <td className="py-10 pr-10">
                          <p className="font-black text-xl uppercase tracking-tighter mb-3 text-slate-900">{item.name}</p>
                          <p className="text-[14px] text-slate-500 font-sans leading-relaxed font-light">{item.description}</p>
                        </td>
                        <td className="py-10 text-right px-8 font-mono font-bold text-slate-400 italic text-base">${item.price.toLocaleString()}</td>
                        <td className="py-10 text-right font-mono font-black text-2xl text-slate-900">${(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FINANCIAL SUMMARY */}
              <div className="flex justify-end mb-20">
                 <div className="w-full sm:w-[420px] p-12 bg-slate-950 text-white rounded-3xl shadow-2xl relative overflow-hidden" style={{ borderBottom: `8px solid ${pdfConfig.accentColor}` }}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Terminal size={100} className="text-cyan-400" />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center text-slate-500 text-[12px] font-black uppercase tracking-widest">
                         <span>SUBTOTAL NETO</span>
                         <span className="font-mono text-xl">${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 text-[12px] font-black uppercase tracking-widest">
                         <span>IMPUESTO FISCAL ({pdfConfig.taxPercentage}%)</span>
                         <span className="font-mono text-xl">${taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-800 my-8" />
                      <div className="flex justify-between items-end">
                         <div className="flex flex-col">
                            <span className="text-[11px] font-orbitron font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">ABUNDANCE TOTAL</span>
                            <span className="text-5xl font-orbitron font-black tracking-tighter">${grandTotal.toLocaleString()}</span>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* FOOTER & SIGNATURE */}
              <div className="mt-auto pt-16 border-t-[3px] border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                 <div className="space-y-6">
                    <h5 className="text-[12px] font-black uppercase tracking-widest text-slate-900">MARCO LEGAL & TÉRMINOS</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans italic">{pdfConfig.terms}</p>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <Shield size={18} className="text-slate-300" />
                       <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] font-bold">NODE_VALIDATION: {pdfConfig.footerCode}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end justify-end">
                    <div className="text-center w-72 mb-12">
                       <div className="h-20 flex items-center justify-center italic font-serif text-3xl opacity-60 text-slate-400 mb-2">NeuronAds_Auth</div>
                       <div className="border-t-2 border-slate-200 pt-4">
                          <p className="font-orbitron font-black text-[12px] uppercase tracking-widest mb-1 text-slate-900">{pdfConfig.authorizedSignature}</p>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Verified Operation Center</p>
                       </div>
                    </div>
                    <div className="flex gap-4 no-print w-full justify-end">
                       <button onClick={downloadPdf} className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-slate-900/40"><Download size={20} /> IMPRIMIR PROPUESTA</button>
                       <button onClick={() => transmitQuotation(previewQuotation)} className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-10 py-5 bg-cyan-500 text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-cyan-500/40"><Share2 size={20} /> TRANSMITIR NODO</button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #root { background: white !important; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm;
            min-height: 297mm;
            margin: 0; 
            padding: 25mm !important; 
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default QuotationEngine;