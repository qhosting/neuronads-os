
import React, { useState, useEffect } from 'react';
/* Fix: Import from framer-motion instead of framer-presence */
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Activity, Box, Brain, Sparkles, MessageSquare, Wand2, Send, RefreshCw, Cpu, X, ImageIcon } from 'lucide-react';
import { NeuralProject, UserRole } from '../types';

const ProjectCore: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const [projects, setProjects] = useState<NeuralProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  if (loading) return <div className="p-10 text-center animate-pulse">Sincronizando Proyectos...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Córtex de Proyectos</h2>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Línea de Tiempo Operativa Real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-orbitron text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Box size={14} className="text-cyan-400" /> Nodos de Ejecución
          </h3>
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProjectId(project.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedProjectId === project.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg' : 'bg-slate-950 border-slate-900'}`}
            >
              <h4 className={`text-xs font-bold uppercase mb-2 ${selectedProjectId === project.id ? 'text-white' : 'text-slate-500'}`}>{project.name}</h4>
              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${project.progress}%` }} className="h-full bg-cyan-500" />
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-[10px] text-slate-600 uppercase">Sin proyectos en base de datos.</p>}
        </div>

        <div className="lg:col-span-9">
          {activeProject ? (
             <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[500px]">
                <div className="flex items-center gap-4 mb-8">
                   <Brain className="text-cyan-400" size={32} />
                   <h3 className="text-xl font-orbitron font-bold text-white uppercase">{activeProject.name}</h3>
                </div>
                <div className="space-y-6">
                   <p className="text-slate-500 text-xs font-mono uppercase">Progreso Real: {activeProject.progress}%</p>
                   <div className="p-20 text-center opacity-10 border-2 border-dashed border-slate-800 rounded-3xl">
                      <ImageIcon size={48} className="mx-auto mb-4" />
                      <p className="text-xs uppercase font-orbitron">Render Visual No Disponible</p>
                   </div>
                </div>
             </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20">
               <span className="text-xs uppercase font-orbitron">Seleccione un nodo operativo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCore;
