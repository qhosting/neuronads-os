
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, ChevronDown, ChevronUp, ExternalLink, Filter, Building2, Globe, X, FileText, CreditCard, Zap, Download, Layers, Activity, ArrowRight } from 'lucide-react';
import { Client } from '../types';

const CRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Activity className="text-cyan-400 animate-spin" size={48} />
      <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">Sincronizando Nodos de Clientes...</span>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold metallic-text uppercase tracking-tight">Córtex de Clientes</h2>
          <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em] mt-1">Nodos Operativos Reales en Tiempo Real</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <PlusCircle size={18} /> NUEVO VÍNCULO NEURAL
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between bg-slate-900/20 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text" 
              placeholder="Rastrear nodo por nombre..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {clients.length === 0 ? (
            <div className="p-20 text-center opacity-30">
               <Globe size={64} className="mx-auto mb-4 text-slate-600" />
               <p className="font-orbitron uppercase text-xs">No hay nodos de clientes activos en la base de datos.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-slate-600 text-[9px] uppercase tracking-[0.2em] font-orbitron border-b border-slate-800 bg-slate-950/30">
                  <th className="px-8 py-5 w-10"></th>
                  <th className="px-2 py-5">Entidad / Nodo</th>
                  <th className="px-8 py-5">Naturaleza</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5">Inversión</th>
                  <th className="px-8 py-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                  <React.Fragment key={client.id}>
                    <tr onClick={() => setSelectedClient(client)} className="hover:bg-slate-800/30 cursor-pointer transition-colors">
                      <td className="px-8 py-5">
                        <button onClick={(e) => toggleRow(client.id, e)} className="p-1.5 rounded-lg border border-slate-800 text-slate-500">
                          {expandedRows.includes(client.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td className="px-2 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${client.type === 'SATELLITE' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                            {client.type === 'SATELLITE' ? <Building2 size={18} /> : <Globe size={18} />}
                          </div>
                          <div>
                            <span className="block font-bold text-sm text-slate-200">{client.name}</span>
                            <span className="text-[9px] text-slate-600 font-mono">NODE-ID: {client.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-orbitron px-2 py-1 rounded-lg border ${client.type === 'SATELLITE' ? 'border-cyan-500/20 text-cyan-400' : 'border-slate-800 text-slate-500'}`}>
                          {client.type}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
                          <span className={`text-[10px] font-bold uppercase ${client.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-500'}`}>{client.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-sm text-slate-300 font-bold">${Number(client.fee).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-600 hover:text-cyan-400"><ExternalLink size={16} /></button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRM;
