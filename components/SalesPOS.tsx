
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Tag, 
  Plus, 
  Minus, 
  Trash2, 
  Zap, 
  CheckCircle,
  Receipt,
  Sparkles,
  Search,
  Handshake,
  TrendingUp,
  Cpu,
  Calendar,
  Clock
} from 'lucide-react';
import { ServiceItem, Transaction } from '../types';

const CATALOG: ServiceItem[] = [
  { id: 's1', name: 'Neural Branding Pack', description: 'Identidad visual basada en arquetipos cuánticos.', price: 1500, category: 'BRANDING', billingCycle: 'ONCE' },
  { id: 's2', name: 'Synaptic Ads Scaling', description: 'Escalamiento dinámico de campañas en Meta y Google Ads, con enfoque en la optimización predictiva de ROI basada en IA.', price: 2500, category: 'ADS', billingCycle: 'MONTHLY' },
  { id: 's3', name: 'AI Cortex Integration', description: 'Implementación de LLMs personalizados en flujos.', price: 4000, category: 'AI', billingCycle: 'ONCE' },
  { id: 's4', name: 'Viral Inoculation Strategy', description: 'Diseño de contenido con gancho neural.', price: 1200, category: 'CONSULTING', billingCycle: 'MONTHLY' },
];

const SalesPOS: React.FC = () => {
  const [cart, setCart] = useState<{item: ServiceItem, qty: number}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCart = (service: ServiceItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === service.id);
      if (existing) {
        return prev.map(i => i.item.id === service.id ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, { item: service, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  const processHandshake = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        clientId: 'GUEST-NODE',
        clientName: 'Cliente Final',
        items: cart.map(c => ({ serviceId: c.item.id, name: c.item.name, price: c.item.price, billingCycle: c.item.billingCycle })),
        total: total,
        timestamp: new Date(),
        status: 'COMPLETED'
      };
      setTransactions([newTransaction, ...transactions]);
      setCart([]);
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Neural Sales Engine</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Abundance Protocol: 318 798</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Node: POS_ALPHA_01</span>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input type="text" placeholder="Buscar servicio..." className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-slate-300 outline-none focus:border-cyan-500/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATALOG.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => addToCart(service)}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl cursor-pointer hover:border-cyan-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className={`text-[8px] font-orbitron px-2 py-0.5 rounded border ${service.billingCycle === 'MONTHLY' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-slate-700 text-slate-500 bg-slate-800'}`}>
                  {service.billingCycle === 'MONTHLY' ? 'RECURRENTE' : 'ÚNICO'}
                </span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                  {service.category === 'AI' ? <Cpu size={20} /> : service.category === 'ADS' ? <TrendingUp size={20} /> : <Sparkles size={20} />}
                </div>
                <div className="text-right">
                   <span className="text-xl font-orbitron font-black text-white">${service.price.toLocaleString()}</span>
                   {service.billingCycle === 'MONTHLY' && <span className="block text-[8px] text-slate-500 font-mono">/ MES</span>}
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-tight mb-2">{service.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase leading-relaxed font-mono line-clamp-2">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mt-8">
          <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Receipt size={14} className="text-cyan-400" /> Transmisiones Recientes</h3>
          <div className="space-y-3">
            {transactions.length > 0 ? transactions.slice(0, 3).map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-950/50 border border-slate-800 rounded-xl font-mono text-[10px]">
                <div className="flex gap-4">
                  <span className="text-cyan-400">{tx.id}</span>
                  <span className="text-slate-500">{tx.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="text-slate-300">{tx.items.length} NODOS</span>
                  <span className="text-emerald-400 font-bold">${tx.total.toLocaleString()}</span>
                </div>
              </div>
            )) : <div className="text-center py-8 text-slate-600 text-[10px] uppercase font-orbitron">No hay transmisiones detectadas.</div>}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col h-[700px] sticky top-8 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="text-cyan-400" size={24} />
              <h3 className="text-lg font-orbitron font-black text-white uppercase tracking-widest">Neural Cart</h3>
            </div>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">HANDSHAKE READY</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {cart.map((entry) => (
                <motion.div key={entry.item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl relative group">
                  <button onClick={() => removeFromCart(entry.item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight truncate pr-2 block">{entry.item.name}</span>
                      <span className="text-[8px] font-mono text-cyan-500/70">{entry.item.billingCycle === 'MONTHLY' ? 'Suscripción Mensual' : 'Pago por Servicio'}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-400">${(entry.item.price * entry.qty).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800">
                      <button onClick={() => updateQty(entry.item.id, -1)} className="p-1.5 text-slate-500 hover:text-cyan-400"><Minus size={12} /></button>
                      <span className="text-xs font-mono text-slate-200 w-6 text-center">{entry.qty}</span>
                      <button onClick={() => updateQty(entry.item.id, 1)} className="p-1.5 text-slate-500 hover:text-cyan-400"><Plus size={12} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-8 bg-slate-950 border-t border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono"><span>Fee n8n Sync</span><span>${(total * 0.1).toLocaleString()}</span></div>
              <div className="h-px bg-slate-800 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-xs font-orbitron font-bold text-slate-400 uppercase tracking-widest">Total Abundancia</span>
                <span className="text-3xl font-orbitron font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">${(total * 1.1).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={processHandshake}
              disabled={cart.length === 0 || isProcessing}
              className={`w-full py-5 rounded-2xl font-orbitron font-black text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group
                ${cart.length === 0 ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]'}
              `}
            >
              {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap size={18} /></motion.div> : showSuccess ? <CheckCircle size={18} /> : <Handshake size={18} />}
              {isProcessing ? "PROCESANDO SINAPSIS..." : showSuccess ? "VÍNCULO COMPLETADO" : "EJECUTAR HANDSHAKE"}
            </button>
            <p className="text-[8px] text-center text-slate-600 uppercase font-orbitron tracking-widest opacity-50">Protección Grabovoi 8888 activa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPOS;
