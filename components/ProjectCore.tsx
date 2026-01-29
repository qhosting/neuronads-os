
import React, { useState, useEffect } from 'react';
/* Fix: Import from framer-motion instead of framer-presence */
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Activity, Box, Brain, Sparkles, MessageSquare, Wand2, Send, RefreshCw, Cpu, X, ImageIcon, PlusCircle, Save } from 'lucide-react';
import { NeuralProject, UserRole, Client } from '../types';
import { useApp } from '../context/AppContext';

const ProjectCore: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState<NeuralProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [newProject, setNewProject] = useState({
    clientId: '',
    name: '',
    progress: 0,
    status: 'EXECUTING',
    synapseLevel: 50
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
      } catch (err) {
        console.error('Error fetching projects:', err);
        addNotification({ title: 'ERROR', message: 'Fallo al cargar proyectos', type: 'ERROR' });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data);
      if (data.length > 0) setNewProject(prev => ({ ...prev, clientId: data[0].id }));
    } catch (error) {
       console.error('Error fetching clients:', error);
    }
  };

  const openNewProjectModal = () => {
    fetchClients();
    setIsModalOpen(true);
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      if (!response.ok) throw new Error('Error creating project');
      const createdProject = await response.json();
      setProjects([createdProject, ...projects]);
      setSelectedProjectId(createdProject.id);
      setIsModalOpen(false);
      addNotification({ title: 'ÉXITO', message: 'Proyecto iniciado correctamente', type: 'SUCCESS' });
    } catch (error) {
      console.error('Error creating project:', error);
      addNotification({ title: 'ERROR', message: 'No se pudo crear el proyecto', type: 'ERROR' });
    }
  };

  const activeProject = projects.find(p => p.id === selectedProjectId);

  if (loading) return <div className="p-10 text-center animate-pulse">Sincronizando Proyectos...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-black metallic-text uppercase tracking-tight">Córtex de Proyectos</h2>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">Línea de Tiempo Operativa Real</p>
        </div>
        <button
          onClick={openNewProjectModal}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 rounded-xl font-orbitron text-[10px] font-black hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        >
          <PlusCircle size={18} /> NUEVO PROYECTO
        </button>
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-orbitron font-bold text-white uppercase">Iniciar Proyecto</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-orbitron text-slate-500 uppercase">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-orbitron text-slate-500 uppercase">Cliente Asignado</label>
                  <select
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({...newProject, clientId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500/50 outline-none appearance-none"
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-orbitron text-slate-500 uppercase">Nivel de Sinapsis</label>
                    <input
                      type="number"
                      value={newProject.synapseLevel}
                      onChange={(e) => setNewProject({...newProject, synapseLevel: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-orbitron text-slate-500 uppercase">Estado Inicial</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500/50 outline-none appearance-none"
                    >
                      <option value="EXECUTING">EXECUTING</option>
                      <option value="DONE">DONE</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateProject}
                  className="w-full py-4 mt-4 bg-cyan-500 text-slate-950 rounded-xl font-orbitron font-black hover:bg-cyan-400 transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  <Save size={18} /> INICIAR PROTOCOLO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCore;
