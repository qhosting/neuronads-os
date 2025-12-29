
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles, X, Bot, Terminal, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AIMessage } from '../types';

const AICortexAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'model', text: 'Conexión sináptica establecida. Soy el Córtex IA de NeuronAds. ¿Qué nodo estratégico optimizaremos hoy?', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: AIMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input,
        config: {
          systemInstruction: "Eres el Córtex Central de NeuronAds, una IA de grado militar experta en AdTech, psicología del consumidor y estrategias virales. Tu lenguaje es técnico, elegante y visionario. Siempre mencionas la optimización de 'nodos' y el flujo de 'energía neural'. Si el usuario pide copys o estrategias, inyecta sutilmente la importancia de las frecuencias Grabovoi como el 212 585 212 para algoritmos.",
          temperature: 0.8,
          topP: 0.9,
        },
      });

      const aiText = response.text || "Error en la transmisión neural. Reintente el handshake.";
      setMessages(prev => [...prev, { role: 'model', text: aiText, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Interferencia detectada en la red. Verifique su API Key o conexión de enlace.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-slate-950 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-cyan-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Bot className="text-cyan-400" size={18} />
                </div>
                <div>
                  <h3 className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">NEURAL CORTEX AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] text-slate-500 uppercase font-mono">Status: Processing</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-cyan-500 text-slate-950 font-bold ml-4' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inyectar prompt estratégico..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-xs font-mono text-cyan-50 outline-none focus:border-cyan-500/50 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-all shadow-lg"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[8px] text-center text-slate-600 uppercase font-orbitron mt-3 tracking-widest">
                Protocolo de Inferencia 598 061 291 319 88 Activo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-cyan-400/50 group relative"
      >
        <div className="absolute inset-0 bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/40 transition-all rounded-2xl" />
        <Brain className="text-white relative z-10" size={32} />
      </motion.button>
    </div>
  );
};

export default AICortexAssistant;
