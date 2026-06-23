'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';
import { DEFAULT_AGENTS, Agent } from '@/data/agents-entries';

export default function AgentsPage() {
  const router = useRouter();
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'dev' | 'juridico' | 'marketing' | 'engenharia' | 'negocios' | 'saude' | 'educacao' | 'outro'>('dev');
  const [newDesc, setNewDesc] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newModel, setNewModel] = useState('Llama 3.1 70B');
  const [newTemp, setNewTemp] = useState('0.7');
  const [curIcon, setCurIcon] = useState('fa-solid fa-robot');
  const [curColor, setCurColor] = useState('#534AB7');

  // Load custom agents from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alexandria_custom_agents');
      if (stored) {
        try {
          setCustomAgents(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save custom agents helper
  const saveCustomAgents = (list: Agent[]) => {
    setCustomAgents(list);
    localStorage.setItem('alexandria_custom_agents', JSON.stringify(list));
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAgent: Agent = {
      id: Date.now(),
      name: newName.trim(),
      icon: curIcon,
      desc: newDesc.trim() || 'Agente personalizado',
      model: newModel,
      cat: newCat,
      color: curColor,
      tag: '',
      plan: 'pro',
      custom: true
    };

    const updated = [...customAgents, newAgent];
    saveCustomAgents(updated);
    
    // Reset form
    setNewName('');
    setNewDesc('');
    setNewPrompt('');
    setNewModel('Llama 3.1 70B');
    setNewTemp('0.7');
    setCurIcon('fa-solid fa-robot');
    setCurColor('#534AB7');
    setModalOpen(false);
  };

  // Filters
  const filters = [
    { label: 'Todos', key: 'all' },
    { label: 'Dev', key: 'dev' },
    { label: 'Jurídico', key: 'juridico' },
    { label: 'Marketing', key: 'marketing' },
    { label: 'Negócios', key: 'negocios' },
    { label: 'Engenharia', key: 'engenharia' },
    { label: 'Meus agentes', key: 'custom' }
  ];

  const allAgents = [...DEFAULT_AGENTS, ...customAgents];
  
  const displayedAgents = allAgents.filter((agent) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'custom') return agent.custom === true;
    return agent.cat === activeFilter;
  });

  const handleUseAgent = (agent: Agent) => {
    // Redirect to chat with agent parameter
    router.push(`/chat?agent=${encodeURIComponent(agent.name)}`);
  };

  const iconOptions = ['fa-solid fa-robot', 'fa-solid fa-scale-balanced', 'fa-solid fa-laptop-code', 'fa-solid fa-chart-bar', 'fa-solid fa-pen-nib', 'fa-solid fa-helmet-safety', 'fa-solid fa-brain', 'fa-solid fa-bullseye', 'fa-solid fa-pen-to-square', 'fa-solid fa-microscope', 'fa-solid fa-sack-dollar', 'fa-solid fa-stethoscope'];
  const colors = ['#534AB7', '#1D9E75', '#E24B4A', '#EF9F27', '#378ADD', '#D4537E', '#639922'];

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />

      <Navbar />

      {/* Blueprint Grid Background */}
      <div className="blueprint-grid" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-28 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-accent-dark" /> Agentes
            </div>
            <h1 className="font-rework text-[clamp(28px,4.5vw,44px)] font-normal text-white uppercase leading-[1.1] tracking-[0.05em] scale-y-[0.85] origin-left">
              Agentes Especializados
            </h1>
            <p className="text-[13.5px] text-text-secondary mt-1">
              Escolha um agente ou crie o seu próprio especialista com diretrizes customizadas.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.05em] uppercase bg-accent text-bg-deep px-6 py-3 rounded-full hover:opacity-90 transition-all cursor-pointer self-start sm:self-center"
          >
            <i className="fa-solid fa-plus" /> Criar Agente
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-border-subtle">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.05em] border rounded-full transition-all cursor-pointer ${
                activeFilter === f.key
                  ? 'bg-accent border-accent text-bg-deep'
                  : 'bg-black/20 border-border-card text-text-secondary hover:text-white hover:border-border-subtle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        {displayedAgents.length === 0 ? (
          <div className="text-center py-24 text-text-muted border border-dashed border-border-card rounded-xl bg-bg-alt/30 max-w-lg mx-auto">
            <div className="text-[40px] mb-4"><i className="fa-solid fa-robot" /></div>
            <div className="text-[14px] text-white font-rework uppercase mb-2">Nenhum agente cadastrado</div>
            <div className="text-[12px] mb-6">Você ainda não criou nenhum agente personalizado nesta categoria.</div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.05em] uppercase border border-accent text-accent px-5 py-2.5 rounded-full hover:bg-accent-soft transition-all cursor-pointer"
            >
              Criar Agente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedAgents.map((agent) => (
              <div
                key={agent.id}
                className="blueprint-card p-6 flex flex-col justify-between rounded-xl border border-border-card bg-bg-alt relative hover:border-border-subtle transition-all duration-300 hover:shadow-2xl"
              >

                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-[22px] border border-border-subtle"
                    style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
                  >
                    <i className={`${agent.icon} text-[18px]`} />
                  </div>
                  
                  <div className="flex gap-1">
                    {agent.tag === 'popular' && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    {agent.tag === 'new' && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Novo
                      </span>
                    )}
                    {agent.plan === 'pro' && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-accent-soft text-accent-light border border-accent-dark/30 px-2 py-0.5 rounded-full">
                        Pro
                      </span>
                    )}
                    {agent.custom && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 text-text-secondary border border-border-subtle px-2 py-0.5 rounded-full">
                        Criado
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-rework text-[16px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left mb-1.5 leading-tight">
                  {agent.name}
                </div>

                <p className="text-[12.5px] text-text-secondary leading-relaxed mb-6 flex-1">
                  {agent.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    {agent.model}
                  </span>
                  
                  <button
                    onClick={() => handleUseAgent(agent)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent bg-transparent border-0 hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    Usar <i className="fa-solid fa-arrow-right text-[11px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── CREATE AGENT MODAL ── */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-start justify-center p-6 overflow-y-auto"
        >
          <div className="bg-bg-alt border border-border-card rounded-2xl w-full max-w-[620px] shadow-2xl overflow-hidden mt-10 mb-10 animate-[rise_0.2s_ease-out]">
            <div className="h-1 bg-accent" />

            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-rework text-[18px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left">
                Criar agente
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-black/40 border border-border-card flex items-center justify-center text-text-muted hover:text-white hover:border-accent transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: JurisIA, CodeBot..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Especialidade</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent appearance-none cursor-pointer"
                  >
                    <option value="dev">Desenvolvimento</option>
                    <option value="juridico">Jurídico</option>
                    <option value="marketing">Marketing</option>
                    <option value="negocios">Negócios</option>
                    <option value="engenharia">Engenharia</option>
                    <option value="saude">Saúde</option>
                    <option value="educacao">Educação</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Descrição curta</label>
                <input
                  type="text"
                  required
                  placeholder="O que este agente faz..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Instruções (system prompt)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Você é um especialista em... Sempre responda em português..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Modelo Base</label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent cursor-pointer"
                  >
                    <option>Llama 3.1 70B</option>
                    <option>Qwen2.5 32B</option>
                    <option>Qwen2.5-Coder</option>
                    <option>Mistral 7B</option>
                    <option>Llama 3.2 Vision</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Temperatura</label>
                  <select
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                    className="bg-black/40 border border-border-card rounded-lg px-4 py-2.5 text-[13px] text-text-primary outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="0.2">Preciso (0.2)</option>
                    <option value="0.5">Equilibrado (0.5)</option>
                    <option value="0.7">Criativo (0.7)</option>
                    <option value="1.0">Muito criativo (1.0)</option>
                  </select>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Ícone</label>
                <div className="flex flex-wrap gap-2 bg-black/20 p-2 border border-border-card rounded-lg justify-between">
                  {iconOptions.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCurIcon(ic)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-[18px] cursor-pointer transition-all ${
                        curIcon === ic ? 'bg-accent text-bg-deep scale-105' : 'hover:bg-white/5 text-text-secondary'
                      }`}
                    >
                      <i className={`${ic} text-[18px]`} />
                    </button>
                  ))}
                </div>
              </div>


              {/* Color Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-accent">Cor</label>
                <div className="flex flex-wrap gap-2.5 bg-black/20 p-3.5 border border-border-card rounded-lg">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurColor(c)}
                      className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                        curColor === c ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-deep scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="bg-black/35 border border-border-card rounded-lg p-4 mt-2">
                <div className="text-[9px] font-mono uppercase text-text-muted mb-2 tracking-wider">Pré-visualização</div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-[22px] border border-border-subtle"
                    style={{ backgroundColor: `${curColor}20`, color: curColor }}
                  >
                    <i className={`${curIcon} text-[22px]`} />
                  </div>
                  <div>
                    <div className="font-rework text-[14px] font-normal text-white uppercase scale-y-[0.85] origin-left tracking-wide leading-tight">
                      {newName || 'Meu Agente'}
                    </div>
                    <div className="text-[11.5px] text-text-secondary mt-0.5">
                      {newDesc || 'Descrição aparece aqui...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-border-card text-text-secondary hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-bg-deep hover:opacity-90 cursor-pointer"
                >
                  Salvar agente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
