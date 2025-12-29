
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp,
  ExternalLink, 
  Filter,
  Building2,
  Globe,
  X,
  FileText,
  CreditCard,
  Zap,
  CheckCircle2,
  AlertCircle,
  Download,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Client, Invoice } from '../types';

const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', 
    name: 'Aurum Properties', 
    type: 'SATELLITE', 
    status: 'ACTIVE', 
    fee: 4500, 
    renewalDate: '2024-12-15',
    contractedServices: ['Neural Branding Pack', 'Synaptic Ads Scaling', 'Monthly Audit Node'],
    invoices: [
      { id: 'INV-8801', amount: 4500, date: '2024-11-01', status: 'PAID', concept: 'Ciclo Operativo Noviembre' },
      { id: 'INV-8742', amount: 4500, date: '2024-10-01', status: 'PAID', concept: 'Ciclo Operativo Octubre' },
      { id: 'INV-8910', amount: 4500, date: '2024-12-01', status: 'PENDING', concept: 'Ciclo Operativo Diciembre' },
    ]
  },
  { 
    id: '2', 
    name: 'Cyberdine Systems', 
    type: 'EXTERNAL', 
    status: 'ACTIVE', 
    fee: 2800, 
    renewalDate: '2024-11-20',
    contractedServices: ['Synaptic Ads Scaling', 'Viral Inoculation Strategy'],
    invoices: [
      { id: 'INV-9011', amount: 2800, date: '2024-11-15', status: 'PAID', concept: 'Ads Scaling - Tier 2' },
    ]
  },
  { 
    id: '3', 
    name: 'Lunar Tech Holding', 
    type: 'SATELLITE', 
    status: 'PAUSED', 
    fee: 1500, 
    renewalDate: '2024-12-01',
    contractedServices: ['Neural Branding Pack'],
    invoices: [
      { id: 'INV-7721', amount: 1500, date: '2024-09-01', status: 'OVERDUE', concept: 'Initial Node Setup' },
    ]
  },
];

const CRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold metallic-text uppercase tracking-tight">Córtex de Clientes</h2>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mt-1">Gestión de Nodos y Vínculos de Abundancia</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <PlusCircle size={18} /> NUEVO VÍNCULO NEURAL
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl transition-all">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between bg-slate-900/20 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text" 
              placeholder="Rastrear nodo por nombre..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-cyan-400 transition-colors border border-slate-800 rounded-lg text-[9px] font-orbitron uppercase">
               <Filter size={14} /> Filtros
             </button>
             <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-cyan-400 transition-colors border border-slate-800 rounded-lg text-[9px] font-orbitron uppercase">
               <Download size={14} /> Exportar
             </button>
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-slate-600 text-[9px] uppercase tracking-[0.2em] font-orbitron border-b border-slate-800 bg-slate-950/30">
                <th className="px-8 py-5 w-10"></th>
                <th className="px-2 py-5">Entidad / Nodo</th>
                <th className="px-8 py-5">Naturaleza</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Inversión Mensual</th>
                <th className="px-8 py-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                <React.Fragment key={client.id}>
                  {/* MAIN ROW */}
                  <tr 
                    onClick={() => setSelectedClient(client)}
                    className={`group cursor-pointer transition-colors ${expandedRows.includes(client.id) ? 'bg-cyan-500/5' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-8 py-5">
                      <button 
                        onClick={(e) => toggleRow(client.id, e)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-all text-slate-500 hover:text-cyan-400"
                      >
                        {expandedRows.includes(client.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td className="px-2 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${client.type === 'SATELLITE' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                          {client.type === 'SATELLITE' ? <Building2 size={18} /> : <Globe size={18} />}
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-slate-200 tracking-tight">{client.name}</span>
                          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">ID: NODE-0{client.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-orbitron px-2.5 py-1 rounded-lg border ${client.type === 'SATELLITE' ? 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5' : 'border-slate-800 text-slate-500'}`}>
                        {client.type === 'SATELLITE' ? 'SATÉLITE' : 'EXTERNO'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${client.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {client.status === 'ACTIVE' ? 'ONLINE' : 'PAUSED'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm text-slate-300 font-bold">${client.fee.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-600 hover:text-cyan-400 transition-colors"><ExternalLink size={16} /></button>
                    </td>
                  </tr>

                  {/* EXPANDABLE ROW */}
                  <AnimatePresence>
                    {expandedRows.includes(client.id) && (
                      <motion.tr 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-950/40"
                      >
                        <td colSpan={6} className="px-20 py-8">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-l-2 border-cyan-500/20 pl-8 ml-2 py-2">
                            
                            {/* SERVICIOS CONTRATADOS */}
                            <section>
                              <div className="flex items-center gap-2 mb-6">
                                <Layers size={14} className="text-cyan-400" />
                                <h4 className="text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-[0.3em]">Nodos de Servicio Activos</h4>
                              </div>
                              <div className="space-y-3">
                                {client.contractedServices.map((service, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-xl group hover:border-cyan-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                      <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
                                        <Zap size={12} />
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight">{service}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Activity size={10} className="text-cyan-400 animate-pulse" />
                                      <span className="text-[8px] font-mono text-slate-600 uppercase">SYNC: OK</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>

                            {/* HISTORIAL DE FACTURAS */}
                            <section>
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                  <CreditCard size={14} className="text-cyan-400" />
                                  <h4 className="text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-[0.3em]">Transmisiones de Pago</h4>
                                </div>
                                <button className="text-[9px] font-orbitron text-cyan-400 hover:underline uppercase tracking-widest flex items-center gap-1">
                                  VER TODO <ArrowRight size={10} />
                                </button>
                              </div>
                              <div className="space-y-2">
                                {client.invoices.slice(0, 3).map((inv) => (
                                  <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${inv.status === 'PAID' ? 'bg-emerald-400' : inv.status === 'OVERDUE' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                      <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{inv.concept}</p>
                                        <p className="text-[8px] font-mono text-slate-500 uppercase">{inv.id} • {inv.date}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-bold text-slate-200 font-mono">${inv.amount.toLocaleString()}</p>
                                      <span className={`text-[8px] font-orbitron uppercase tracking-tighter ${inv.status === 'PAID' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {inv.status === 'PAID' ? 'Sincronizado' : 'Pendiente'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>

                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETALLE DEL NODO (SLIDE-OVER - Mantenido para gestión profunda) */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[70] flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                      <Building2 size={24} />
                    </div>
                    <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-tighter">{selectedClient.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>Grabovoi Protocol: 519 7148</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-cyan-400">Node Secure</span>
                  </div>
                </div>
                <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-[0.3em]">Métricas de Vínculo</h4>
                     <Activity size={14} className="text-cyan-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <span className="text-[8px] font-orbitron text-slate-600 uppercase">LTV Acumulado</span>
                      <p className="text-xl font-bold text-white mt-1 font-mono">$18,200</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <span className="text-[8px] font-orbitron text-slate-600 uppercase">Salud de Red</span>
                      <p className="text-xl font-bold text-emerald-400 mt-1 font-orbitron">98.2%</p>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Layers size={16} className="text-cyan-400" />
                    <h4 className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-[0.3em]">Servicios Detallados</h4>
                  </div>
                  <div className="grid gap-3">
                    {selectedClient.contractedServices.map((service, i) => (
                      <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-tight">{service}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] font-orbitron text-slate-600 uppercase border border-slate-800 px-2 py-0.5 rounded tracking-widest">ACTIVO</span>
                        </div>
                      </div>
                    ))}
                    <button className="py-3 border border-dashed border-slate-800 rounded-2xl text-[9px] font-orbitron text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-[0.3em]">
                      + INYECTAR SERVICIO
                    </button>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-orbitron font-bold text-slate-300 hover:text-white transition-all">
                  <FileText size={16} /> REPORTE IA
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-cyan-500 text-slate-950 rounded-2xl text-[10px] font-orbitron font-black shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <CreditCard size={16} /> FACTURAR
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRM;
