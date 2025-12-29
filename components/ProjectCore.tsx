
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Zap, 
  ChevronRight, 
  Activity,
  Box,
  Brain,
  Sparkles,
  MessageSquare,
  Wand2,
  Send,
  RefreshCw,
  Cpu,
  Trophy,
  AlertCircle,
  Image as ImageIcon,
  Smartphone,
  Eye,
  Check,
  X
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { NeuralProject, Task, ProjectStep, ProjectFeedback, UserRole } from '../types';

const MOCK_PROJECTS: NeuralProject[] = [
  {
    id: 'p1',
    name: 'Aurum Properties - Branding V4',
    progress: 65,
    synapseLevel: 82,
    tasks: [
      { id: 't1', title: 'Diseño de Identidad Visual', priority: 'CRITICAL', completed: true, timeSpent: '4h 20m' },
      { id: 't2', title: 'Redacción de Copy Neural', priority: 'STABLE', completed: false, timeSpent: '1h 30m' },
    ],
    roadmap: [
      { id: 's1', instruction: 'Optimizar paleta de colores para retención visual', status: 'DONE', source: 'SYSTEM' },
      { id: 's2', instruction: 'Generar variantes de logo con IA', status: 'EXECUTING', source: 'SYSTEM' }
    ],
    feedbacks: [
      { id: 'f1', sender: 'Cliente Aurum', text: 'El logo actual necesita más "glow" cian.', timestamp: new Date(), sentiment: 'NEUTRAL' }
    ],
    interactionStatus: 'IDLE'
  }
];

const ProjectCore: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const isClient = userRole === UserRole.CLIENT;
  const [projects, setProjects] = useState<NeuralProject[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const updateProject = (id: string, updates: Partial<NeuralProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generateProgressVisual = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A photorealistic, futuristic high-tech branding dashboard for "${activeProject.name}", featuring neon cyan synaptic circuits, architecturally complex glowing elements, ultra-detailed textures, cinematic lighting, 4k resolution.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
      if (imageUrl) {
        updateProject(activeProject.id, { progressImage: imageUrl });
      }
    } catch (error) {
      console.error("Falla en síntesis visual:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerClientInteraction = async () => {
    setIsProcessing(true);
    updateProject(activeProject.id, { interactionStatus: 'AWAITING_CLIENT' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como el Córtex IA de NeuronAds. Estamos enviando este avance: "${activeProject.name}" al cliente. 
      Escribe un mensaje de WhatsApp (Chatwoot) persuasivo y profesional que presente el avance y le pida observaciones específicas sobre el diseño y el tono. 
      Inyecta el código Grabovoi 212 585 212 para armonizar la respuesta.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const systemLog: ProjectFeedback = {
        id: `sys-${Date.now()}`,
        sender: 'SISTEMA (Chatwoot)',
        text: `MENSAJE ENVIADO VIA WHATSAPP: ${response.text?.substring(0, 100)}...`,
        timestamp: new Date(),
        sentiment: 'POSITIVE'
      };
      
      updateProject(activeProject.id, { 
        feedbacks: [systemLog, ...(activeProject.feedbacks || [])] 
      });

      setTimeout(async () => {
        const clientSimulatedResponse = "Me gusta el avance visual generado, pero quiero que las tipografías sean más delgadas y el fondo un poco menos oscuro. ¿Podemos optimizar eso?";
        handleIncomingClientFeedback(clientSimulatedResponse);
      }, 4000);

    } catch (error) {
      console.error("Error en uplink con cliente:", error);
      updateProject(activeProject.id, { interactionStatus: 'IDLE' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncomingClientFeedback = async (text: string) => {
    updateProject(activeProject.id, { interactionStatus: 'PROCESSING_FEEDBACK' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const analysisPrompt = `Analiza este feedback del cliente: "${text}". 
      Basado en el proyecto "${activeProject.name}", genera 2 o 3 pasos técnicos concretos para el Roadmap que resuelvan sus peticiones. 
      Devuelve un JSON array de objetos con "instruction" y "status" (siempre PENDING).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: analysisPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                instruction: { type: Type.STRING },
                status: { type: Type.STRING }
              }
            }
          }
        }
      });

      if (response.text) {
        const aiSteps = JSON.parse(response.text);
        const formattedSteps = aiSteps.map((s: any) => ({ ...s, id: `ai-${Math.random()}`, source: 'AI_FEEDBACK' }));

        const newFeedback: ProjectFeedback = {
          id: `f-${Date.now()}`,
          sender: 'CLIENTE (WhatsApp)',
          text: text,
          timestamp: new Date(),
          sentiment: 'POSITIVE'
        };

        updateProject(activeProject.id, { 
          roadmap: [...(activeProject.roadmap || []), ...formattedSteps],
          feedbacks: [newFeedback, ...(activeProject.feedbacks || [])],
          interactionStatus: 'IDLE'
        });
      }

    } catch (error) {
      console.error("Error analizando feedback:", error);
      updateProject(activeProject.id, { interactionStatus: 'IDLE' });
    }
  };

  const addFeedback = () => {
    if (!feedbackInput.trim()) return;

    const newFeedback: ProjectFeedback = {
      id: `f-${Date.now()}`,
      sender: isClient ? 'CLIENTE' : 'STAFF',
      text: feedbackInput,
      timestamp: new Date(),
      sentiment: 'NEUTRAL'
    };

    updateProject(activeProject.id, { 
      feedbacks: [newFeedback, ...(activeProject.feedbacks || [])] 
    });
    setFeedbackInput('');

    if (!isClient) {
      handleIncomingClientFeedback(feedbackInput);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative pb-20">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Córtex de Proyectos</h2>
          <div className="flex items-center gap-4 mt-2">
             <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">Efficiency Protocol: <span className="text-cyan-400">1888948</span></p>
             <div className="h-1 w-1 rounded-full bg-slate-700" />
             <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">NODE: {activeProject.id}</p>
          </div>
        </div>
        {!isClient && (
          <div className="flex gap-4">
            <button 
              onClick={() => setToolboxOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl font-orbitron text-[10px] font-black hover:border-cyan-500/50 hover:text-cyan-400 transition-all shadow-xl"
            >
              <Wand2 size={16} /> HERRAMIENTAS IA
            </button>
            <button 
              onClick={triggerClientInteraction}
              disabled={isProcessing || activeProject.interactionStatus !== 'IDLE'}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
            >
              {activeProject.interactionStatus === 'AWAITING_CLIENT' ? <Smartphone className="animate-bounce" size={16} /> : <MessageSquare size={16} />}
              {activeProject.interactionStatus === 'AWAITING_CLIENT' ? 'ESPERANDO CLIENTE...' : 'ENVIAR AVANCE (WA)'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: SELECTOR DE PROYECTOS */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 font-black">
            <Box size={14} className="text-cyan-400" /> Ecosistema Activo
          </h3>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedProjectId(project.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedProjectId === project.id 
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                : 'bg-slate-950 border-slate-900 hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-1.5 rounded-lg ${selectedProjectId === project.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-700'}`}>
                  <Activity size={12} />
                </div>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">LVL: {project.synapseLevel}</span>
              </div>
              <h4 className={`text-xs font-bold uppercase tracking-tight mb-4 ${selectedProjectId === project.id ? 'text-white' : 'text-slate-500'}`}>
                {project.name}
              </h4>
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${project.progress}%` }} 
                  className={`h-full ${selectedProjectId === project.id ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-800'}`} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* COLUMNA CENTRAL: TRABAJO & IA (IMAGEN INMERSIVA) */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-xl min-h-[700px] relative overflow-hidden group">
            
            {/* FONDO DE PROGRESO GENERADO POR IA (OCUPA TODA LA SECCIÓN) */}
            <AnimatePresence>
              {activeProject.progressImage ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 overflow-hidden"
                >
                  <motion.img 
                    src={activeProject.progressImage} 
                    alt="Neural Progress Render" 
                    className="w-full h-full object-cover brightness-[0.3] transition-all duration-[2000ms] ease-out group-hover:scale-110 group-hover:brightness-[0.45]"
                  />
                  {/* Capas de Gradiente para legibilidad del contenido superior */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
                  
                  {/* Indicador de Renderización IA */}
                  <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 border border-cyan-500/30 rounded-full backdrop-blur-md">
                    <Sparkles size={10} className="text-cyan-400 animate-pulse" />
                    <span className="text-[8px] font-orbitron font-bold text-cyan-400 uppercase tracking-[0.2em]">IA Inmersive View</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateProject(activeProject.id, { progressImage: undefined }); }}
                      className="ml-2 hover:text-white text-slate-500 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
                  <Cpu size={300} className="text-cyan-400" />
                </div>
              )}
            </AnimatePresence>

            {/* CONTENIDO OVERLAY */}
            <div className="relative z-10 p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Brain className="text-cyan-400 animate-pulse" size={24} />
                  </div>
                  <div>
                    <h4 className="font-orbitron font-bold text-white uppercase tracking-widest text-sm drop-shadow-md">{activeProject.name}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Neural Sync Level: {activeProject.synapseLevel}%</p>
                  </div>
                </div>
                {!isClient && (
                  <div className="flex gap-2">
                    <button 
                      onClick={generateProgressVisual}
                      disabled={isProcessing}
                      className="p-2.5 bg-slate-950/80 border border-slate-700 text-slate-400 rounded-xl hover:text-cyan-400 hover:border-cyan-500/50 transition-all backdrop-blur-sm"
                      title="Sintetizar Visualización de Progreso"
                    >
                      {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    </button>
                  </div>
                )}
              </div>

              {/* ROADMAP Y TAREAS */}
              <div className="flex-1 space-y-10">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="text-[10px] font-orbitron text-slate-300 uppercase tracking-widest flex items-center gap-2 font-black">
                      <Cpu size={14} className="text-cyan-400" /> Roadmap Neural de Ejecución
                    </h5>
                    {activeProject.interactionStatus === 'PROCESSING_FEEDBACK' && (
                      <span className="text-[8px] font-mono text-cyan-400 animate-pulse">SINCRO DE FEEDBACK...</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {activeProject.roadmap && activeProject.roadmap.length > 0 ? activeProject.roadmap.map((step) => (
                      <div key={step.id} className={`p-5 bg-slate-950/60 border rounded-2xl flex items-center justify-between group backdrop-blur-sm transition-all ${step.source === 'AI_FEEDBACK' ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.05)]' : 'border-slate-800'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-1.5 rounded-lg ${step.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {step.status === 'DONE' ? <CheckCircle2 size={12} /> : step.status === 'EXECUTING' ? <RefreshCw size={12} className="animate-spin" /> : <Circle size={12} />}
                          </div>
                          <div>
                            <span className={`text-xs font-medium uppercase tracking-tight ${step.status === 'DONE' ? 'text-slate-600 line-through' : 'text-slate-100'}`}>
                              {step.instruction}
                            </span>
                            {step.source === 'AI_FEEDBACK' && (
                              <span className="block text-[7px] font-mono text-cyan-500 mt-1 uppercase tracking-widest">Nodo Externo Inyectado</span>
                            )}
                          </div>
                        </div>
                        {step.status !== 'DONE' && (
                          <button 
                            onClick={() => {
                              const newRoadmap = activeProject.roadmap?.map(s => s.id === step.id ? { ...s, status: 'DONE' } as ProjectStep : s);
                              updateProject(activeProject.id, { roadmap: newRoadmap });
                            }}
                            className="p-2 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    )) : (
                      <div className="py-16 text-center border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-950/20">
                        <p className="text-[10px] font-orbitron text-slate-600 uppercase tracking-widest">Sin Roadmap. Use "Enviar Avance" para iniciar el bucle IA.</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h5 className="text-[10px] font-orbitron text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2 font-black">
                    <Zap size={14} className="text-cyan-400" /> Sinapsis Operativas
                  </h5>
                  <div className="space-y-3">
                    {activeProject.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/50 rounded-2xl group hover:bg-slate-950/60 transition-all backdrop-blur-[2px]">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              const newTasks = activeProject.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
                              updateProject(activeProject.id, { tasks: newTasks });
                            }}
                            className={`transition-colors ${task.completed ? 'text-emerald-400' : 'text-slate-700'}`}
                          >
                            {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                          </button>
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-tight ${task.completed ? 'text-slate-600' : 'text-slate-200'}`}>
                              {task.title}
                            </p>
                            <span className={`text-[8px] font-mono mt-1 block uppercase ${task.priority === 'CRITICAL' ? 'text-rose-500' : 'text-slate-500'}`}>
                              {task.priority} • {task.timeSpent}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: UPLINK FEEDBACK */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm h-full flex flex-col shadow-xl">
            <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-black">
              <MessageSquare size={14} className="text-cyan-400" /> Canal de Comunicación
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {activeProject.feedbacks && activeProject.feedbacks.length > 0 ? activeProject.feedbacks.map(f => (
                <div key={f.id} className={`p-4 border rounded-2xl relative overflow-hidden group transition-all ${f.sender.includes('SISTEMA') ? 'bg-slate-900/40 border-slate-800 opacity-60' : 'bg-slate-950 border-cyan-500/20 shadow-lg'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-orbitron uppercase font-black ${f.sender.includes('CLIENTE') ? 'text-cyan-400' : 'text-slate-500'}`}>{f.sender}</span>
                    <span className="text-[8px] font-mono text-slate-700">{f.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans italic leading-relaxed">"{f.text}"</p>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                  <MessageSquare size={32} className="text-slate-700 mb-2" />
                  <p className="text-[9px] font-orbitron text-slate-600 uppercase">Sin actividad detectada.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <textarea 
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder={isClient ? "Enviar observaciones..." : "Simular input de cliente..."}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans outline-none focus:border-cyan-500/50 resize-none h-24"
              />
              <button 
                onClick={addFeedback}
                className="w-full py-3 bg-slate-900 border border-slate-700 text-cyan-400 rounded-xl text-[10px] font-orbitron font-black hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} /> PROCESAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STAFF TOOLBOX */}
      <AnimatePresence>
        {toolboxOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setToolboxOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-[90] p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl"><Wand2 size={24} /></div>
                   <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-tighter">Cortex Staff Tools</h3>
                 </div>
                 <button onClick={() => setToolboxOpen(false)} className="text-slate-500 hover:text-white font-orbitron text-[10px]">CERRAR</button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <ToolSection title="Neural Copy Architect" icon={<Sparkles size={16} />}>
                   <button 
                    onClick={async () => {
                      setIsProcessing(true);
                      try {
                        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                        const res = await ai.models.generateContent({
                          model: 'gemini-3-flash-preview',
                          contents: `Genera 3 copys publicitarios de alto impacto para el proyecto "${activeProject.name}".`
                        });
                        alert(res.text);
                      } catch (err) { console.error(err); } finally { setIsProcessing(false); }
                    }}
                    className="w-full py-4 bg-cyan-500 text-slate-950 rounded-2xl font-orbitron font-black text-xs hover:bg-cyan-400 transition-all"
                   >
                     {isProcessing ? 'SINTETIZANDO...' : 'SINTETIZAR COPIES'}
                   </button>
                </ToolSection>

                <ToolSection title="Análisis de Obstáculos" icon={<Cpu size={16} />}>
                   <textarea placeholder="Describe el bloqueo técnico..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs mb-4 h-24 text-slate-300 outline-none focus:border-cyan-500/50" />
                   <button className="w-full py-4 bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-2xl font-orbitron font-black text-xs hover:bg-cyan-500/10">ANALIZAR SOLUCIÓN</button>
                </ToolSection>

                <ToolSection title="Eficiencia de Nodo" icon={<Trophy size={16} />}>
                   <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                     <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Racha Operativa: 14 Días</p>
                     <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase">Sincronización con el Holding Aurum en niveles óptimos.</p>
                   </div>
                </ToolSection>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/50">
    <div className="flex items-center gap-2">
      <div className="text-cyan-500">{icon}</div>
      <h4 className="text-[10px] font-orbitron font-black text-slate-400 uppercase tracking-widest">{title}</h4>
    </div>
    {children}
  </div>
);

export default ProjectCore;
