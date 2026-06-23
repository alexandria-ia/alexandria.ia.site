'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';
import { DEFAULT_AGENTS, Agent } from '@/data/agents-entries';

interface Message {
  id: string;
  side: 'user' | 'ai';
  text: string;
  senderName: string;
  avatar: string;
  color?: string;
  time: string;
  isHtml?: boolean;
  fileName?: string;
  fileType?: string;
}

interface SwarmModel {
  name: string;
  color: string;
  channels: boolean[];
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ChatContent() {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent');

  // Active agent state
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  
  // Custom & default agents combined
  const [allAgents, setAllAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      side: 'ai',
      text: 'Olá! Sou o <strong>Alexandria AI</strong> — um swarm de modelos locais (Llama, Qwen, Mistral) rodando no nosso servidor.<br><br>Você não precisa escolher modelo nenhum. O sistema identifica o mais rápido e disponível pra cada resposta. Nenhum dado sai daqui.<br><br>Já tenho <strong>4 memórias</strong> sobre você. Escolha um <strong>agente especializado</strong> ao lado ou me pergunte qualquer coisa.',
      senderName: 'Alexandria',
      avatar: 'fa-solid fa-brain',
      time: 'Agora',
      isHtml: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [usedMsgsCount, setUsedMsgsCount] = useState(0);
  
  // File attachments state
  const [pendingFile, setPendingFile] = useState<{ name: string; size: string; type: string } | null>(null);
  
  // Memory drawer state
  const [memDrawerOpen, setMemDrawerOpen] = useState(false);
  const [memoriesCount, setMemoriesCount] = useState(4);
  
  // Swarm status dropdown state
  const [swarmOpen, setSwarmOpen] = useState(false);
  const [swarmState, setSwarmState] = useState<SwarmModel[]>([
    { name: 'Llama 3.1 70B', color: '#D4AF5A', channels: [false, true, true] },
    { name: 'Qwen2.5 32B', color: '#E7C879', channels: [false, false, true] },
    { name: 'Mistral 7B', color: '#8C6A2A', channels: [true, false, false, true] },
    { name: 'Qwen2.5-Coder', color: '#FFFFFF', channels: [false, true, false] }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load custom agents from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alexandria_custom_agents');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAllAgents([...DEFAULT_AGENTS, ...parsed]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Detect URL parameter and auto-select agent
  useEffect(() => {
    if (agentParam) {
      const found = allAgents.find(a => a.name.toLowerCase() === agentParam.toLowerCase());
      if (found) {
        handleSetAgent(found);
      }
    }
  }, [agentParam, allAgents]);

  // Periodic swarm channel state updates
  useEffect(() => {
    const timer = setInterval(() => {
      setSwarmState((prev) =>
        prev.map((model) => ({
          ...model,
          channels: model.channels.map(() => Math.random() < 0.35)
        }))
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat feed
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSetAgent = (agent: Agent) => {
    setActiveAgent(agent);

    const agentIcon = agent.icon || 'fa-solid fa-robot';
    const escapedName = escapeHtml(agent.name);
    const escapedDesc = escapeHtml(agent.desc);

    // Add activation message
    const newMsg: Message = {
      id: `act-${Date.now()}`,
      side: 'ai',
      text: `<strong>${escapedName} ativado.</strong><br>Pronto para ajudar na minha especialidade: ${escapedDesc}`,
      senderName: agent.name,
      avatar: agentIcon,
      color: agent.color,
      time: 'Agora',
      isHtml: true
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleClearAgent = () => {
    setActiveAgent(null);
  };

  // Drag and drop attachment handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeStr = file.size > 1024 * 1024 
      ? (file.size / 1024 / 1024).toFixed(1) + 'MB' 
      : Math.round(file.size / 1024) + 'KB';
    
    setPendingFile({
      name: file.name,
      size: sizeStr,
      type: file.name.split('.').pop()?.toLowerCase() || 'txt'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const replies = [
    'Claro! Me conta mais detalhes sobre o que você precisa.',
    'Analisando sua solicitação. A melhor abordagem aqui seria trabalhar em três etapas:\n\n1. Definir o escopo claramente\n2. Implementar de forma incremental\n3. Validar e iterar\n\nQuer que eu detalhe alguma etapa?',
    'Entendido. Com base no que você me descreveu, vejo algumas opções interessantes. Posso detalhar a que fizer mais sentido pro seu contexto.',
    'Processado localmente — sem envio para terceiros, sem log externo.',
    'Boa pergunta. Existem nuances importantes aqui que vale explorar com cuidado. Quer que eu aprofunde em algum aspecto específico?'
  ];

  const getFileReply = (name: string, type: string) => {
    if (type === 'pdf') {
      return `Documento PDF "${name}" recebido e lido com sucesso. Identifiquei <strong>3 páginas</strong>.<br><br>Posso fazer um <strong>resumo executivo</strong>, extrair informações específicas, responder perguntas sobre o conteúdo ou destacar pontos de atenção. O que você prefere?`;
    }
    if (['doc', 'docx'].includes(type)) {
      return `Documento Word "${name}" recebido. Li o conteúdo completo.<br><br>Posso resumir, revisar, extrair dados ou responder qualquer dúvida sobre o texto. Como posso ajudar?`;
    }
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(type)) {
      return `Imagem "${name}" recebida e analisada. Identifiquei o conteúdo visual.<br><br>Posso descrever o que vejo, extrair textos da imagem (OCR), interpretar gráficos ou responder perguntas específicas sobre o que aparece na imagem. O que precisa?`;
    }
    if (['csv', 'xls', 'xlsx'].includes(type)) {
      return `Planilha "${name}" recebida. Li os dados e identifiquei <strong>48 linhas</strong> e as colunas presentes.<br><br>Posso fazer análise dos dados, calcular médias, encontrar padrões, responder perguntas específicas ou resumir o conteúdo. O que deseja?`;
    }
    return `Arquivo de texto "${name}" recebido. Li o conteúdo completo.<br><br>Posso resumir, analisar, extrair informações ou responder perguntas. Como posso ajudar?`;
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text && !pendingFile) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      side: 'user',
      text: text,
      senderName: 'Você',
      avatar: 'fa-solid fa-user',
      time: 'Agora',
      fileName: pendingFile?.name,
      fileType: pendingFile?.type
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const sentFile = pendingFile;
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsTyping(true);

    // Typing simulation delay
    setTimeout(() => {
      setIsTyping(false);

      const replyText = sentFile 
        ? getFileReply(sentFile.name, sentFile.type) 
        : replies[usedMsgsCount % replies.length];

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        side: 'ai',
        text: replyText,
        senderName: activeAgent ? activeAgent.name : 'Alexandria',
        avatar: activeAgent ? (activeAgent.icon || 'fa-solid fa-robot') : 'fa-solid fa-brain',
        color: activeAgent?.color,
        time: 'Agora',
        isHtml: true
      };

      setMessages((prev) => [...prev, aiMsg]);
      setUsedMsgsCount((prev) => prev + 1);

      // Increment memory count periodically
      if ((usedMsgsCount + 1) % 3 === 0) {
        setMemoriesCount((prev) => prev + 1);
      }
    }, 1000 + Math.random() * 800);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'welcome',
        side: 'ai',
        text: 'Olá! Sou o <strong>Alexandria AI</strong> — um swarm de modelos locais (Llama, Qwen, Mistral) rodando no nosso servidor.<br><br>Você não precisa escolher modelo nenhum. O sistema identifica o mais rápido e disponível pra cada resposta. Nenhum dado sai daqui.<br><br>Já tenho <strong>4 memórias</strong> sobre você. Escolha um <strong>agente especializado</strong> ao lado ou me pergunte qualquer coisa.',
        senderName: 'Alexandria',
        avatar: 'fa-solid fa-brain',
        time: 'Agora',
        isHtml: true
      }
    ]);
    setActiveAgent(null);
    setPendingFile(null);
  };

  // Swarm totals
  const activeChannelsCount = swarmState.reduce(
    (acc, m) => acc + m.channels.filter((c) => c).length,
    0
  );

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />

      <Navbar />

      <div className="blueprint-grid" />

      {/* Main Chat Layout Container */}
      <main 
        className="flex-1 w-full max-w-[1400px] mx-auto mt-16 flex flex-col md:flex-row relative z-10 overflow-hidden"
        style={{ height: 'calc(100vh - 4rem)' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* ── SIDEBAR ── */}
        <aside className="w-full md:w-[280px] bg-bg-alt border-r border-border-subtle flex flex-col justify-between flex-shrink-0">
          <div className="p-4 flex flex-col gap-6 overflow-y-auto">
            <button
              onClick={handleNewChat}
              className="w-full inline-flex items-center justify-center gap-2 text-[12px] font-bold tracking-[0.05em] uppercase bg-white/5 border border-border-card text-white py-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-plus" /> Nova conversa
            </button>

            {/* Quick Agents Selection */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-3">
                Agentes Rápidos
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allAgents.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSetAgent(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.04em] text-text-secondary border border-border-card bg-black/20 rounded-lg hover:border-accent hover:text-white transition-all cursor-pointer"
                  >
                    <span><i className={a.icon || 'fa-solid fa-robot'} /></span> <span>{a.name.slice(0, 7)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History Mock */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-3">
                Conversas Recentes
              </div>
              <div className="flex flex-col gap-1">
                <button className="text-left w-full text-[12px] text-text-primary bg-accent-soft/30 border border-accent/20 px-3 py-2 rounded-lg truncate">
                  Deploy Docker — CodeMaster
                </button>
                <button className="text-left w-full text-[12px] text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg truncate">
                  Contrato de prestação de serviços
                </button>
                <button className="text-left w-full text-[12px] text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg truncate">
                  Copy para anúncio Facebook
                </button>
                <button className="text-left w-full text-[12px] text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg truncate">
                  Cálculo estrutural pilar
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footers */}
          <div className="p-4 border-t border-border-subtle flex flex-col gap-4 bg-bg-deep/40">
            {/* Usage Counter */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-text-secondary">Uso hoje</span>
                <span className="text-accent font-bold">{usedMsgsCount} / ilimitado</span>
              </div>
              <div className="h-1 bg-border-card rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${Math.min(usedMsgsCount * 8, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-text-muted block text-center">
                Plano Chat Pro ativo ✓
              </span>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-3 border-t border-border-subtle pt-3">
              <div className="w-9 h-9 rounded-full bg-accent text-bg-deep flex items-center justify-center font-bold text-[13px]">
                M
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-white truncate">Matheus T.</div>
                <div className="text-[10px] text-text-secondary">Assinante Chat Pro</div>
              </div>
              <a href="/admin" title="Admin Dashboard">
                <i className="fa-solid fa-gear text-text-secondary hover:text-white text-[15px] cursor-pointer" />
              </a>
            </div>
          </div>
        </aside>

        {/* ── CHAT FEED CONSOLE ── */}
        <section className="flex-1 flex flex-col justify-between bg-bg-deep/30 relative">
          
          {/* Top Bar Status */}
          <div className="px-6 py-3 border-b border-border-subtle bg-bg-alt/75 backdrop-blur flex items-center justify-between relative z-30">
            <div className="flex items-center gap-3">
              {/* Swarm Dropdown Trigger */}
              <button
                onClick={() => setSwarmOpen(!swarmOpen)}
                className="inline-flex items-center gap-2 bg-black/40 border border-border-card hover:border-accent hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-white">Swarm Local</span>
                <span className="font-mono text-[9px] text-text-muted bg-white/5 border border-border-subtle rounded px-1">
                  Active
                </span>
                <i className={`fa-solid fa-chevron-down text-[10px] text-text-muted transition-transform ${swarmOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Active Agent Badge */}
              {activeAgent && (
                <div className="inline-flex items-center gap-1.5 bg-accent-soft/20 border border-accent/25 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-accent">
                  <i className={`${activeAgent.icon} text-[14px]`} />
                  <span>{activeAgent.name}</span>
                  <button 
                    onClick={handleClearAgent}
                    className="hover:text-white flex-shrink-0 cursor-pointer"
                    aria-label="Remover agente"
                  >
                    <i className="fa-solid fa-xmark text-[10px]" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="/agents"
                className="w-8 h-8 rounded-lg bg-black/40 border border-border-card hover:border-accent hover:text-white flex items-center justify-center transition-all"
                title="Lista de Agentes"
              >
                <i className="fa-solid fa-robot text-[14px]" />
              </a>
              <button
                onClick={() => setMemDrawerOpen(!memDrawerOpen)}
                className="inline-flex items-center gap-2 bg-black/40 border border-border-card hover:border-accent hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer"
                title="Memórias"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />
                <i className="fa-solid fa-brain text-[11px]" />
                <span>{memoriesCount} memórias</span>
              </button>
            </div>

            {/* Swarm Details Dropdown Menu */}
            {swarmOpen && (
              <div className="blueprint-card absolute top-14 left-6 w-[310px] bg-bg-alt border border-border-card rounded-xl shadow-2xl overflow-hidden z-40">
                <div className="padding p-4 border-b border-border-subtle bg-bg-deep/40">
                  <div className="text-[11px] font-bold text-white mb-1">Swarm Inteligente</div>
                  <div className="text-[10px] text-text-secondary leading-normal">
                    Cada modelo executa múltiplos canais paralelos locais. Suas consultas são atribuídas automaticamente ao canal mais rápido.
                  </div>
                </div>
                <div className="p-3 overflow-y-auto max-h-[300px] flex flex-col gap-3">
                  {swarmState.map((model, mi) => {
                    const inUse = model.channels.filter(c => c).length;
                    return (
                      <div key={mi} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] px-1">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: model.color }} />
                            <span className="font-bold text-white">{model.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-text-muted">{inUse}/{model.channels.length} em uso</span>
                        </div>
                        <div className="flex flex-col gap-1 pl-3">
                          {model.channels.map((busy, ci) => (
                            <div 
                              key={ci} 
                              className={`flex items-center justify-between px-2.5 py-1 border rounded-lg text-[9.5px] transition-all ${
                                busy ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-text-muted'
                              }`}
                            >
                              <span>Canal {ci+1}</span>
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1 h-1 rounded-full ${busy ? 'animate-pulse' : ''}`} style={{ backgroundColor: busy ? model.color : 'rgba(255,255,255,0.1)' }} />
                                <span>{busy ? 'Atendendo' : 'Aguardando'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-border-subtle bg-bg-deep/40 flex justify-between items-center text-[9px] text-text-muted">
                  <span>Roteamento balanceado</span>
                  <span className="text-text-secondary font-bold">{activeChannelsCount} canais em uso</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-[80%] ${
                  msg.side === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] text-bg-deep flex-shrink-0"
                  style={{ backgroundColor: msg.color || '#D4AF5A' }}
                >
                  <i className={`${msg.avatar} text-[14px]`} />
                </div>
                
                <div className="flex flex-col gap-1">
                  <div 
                    className={`px-5 py-4 rounded-2xl text-[13.5px] leading-relaxed shadow border ${
                      msg.side === 'user'
                        ? 'bg-accent border-accent text-bg-deep rounded-tr-sm'
                        : 'bg-bg-alt border-border-card text-text-primary rounded-tl-sm'
                    }`}
                  >
                    {msg.fileName && (
                      <div className="flex items-center gap-2 bg-black/20 border border-border-subtle rounded-lg px-3 py-1.5 text-[11px] font-semibold mb-3 self-start">
                        <i className={`${msg.fileType === 'img' ? 'fa-solid fa-image' : 'fa-solid fa-file-lines'}`} />
                        <span>{msg.fileName}</span>
                      </div>
                    )}
                    
                    {msg.isHtml ? (
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
                  </div>
                  <span className={`text-[9.5px] text-text-muted mt-1 px-1 ${msg.side === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.senderName} · {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-[80%]">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] text-bg-deep flex-shrink-0"
                  style={{ backgroundColor: activeAgent?.color || '#D4AF5A' }}
                >
                  {activeAgent?.icon ? <i className={`${activeAgent.icon} text-[14px]`} /> : <i className="fa-solid fa-brain text-[14px]" />}
                </div>
                <div className="bg-bg-alt border border-border-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear_0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear_0.4s]" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Drawer Lateral - Memory Drawer */}
          {memDrawerOpen && (
            <div className="blueprint-card absolute top-0 right-0 bottom-0 w-[280px] bg-bg-alt border-l border-border-subtle flex flex-col z-40 animate-[rise_0.2s_ease-out]">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <div className="font-mono text-[10.5px] tracking-wider text-accent uppercase flex items-center gap-1.5 font-bold">
                  <i className="fa-solid fa-brain" /> Minhas memórias
                </div>
                <button
                  onClick={() => setMemDrawerOpen(false)}
                  className="w-7 h-7 rounded-lg bg-black/40 border border-border-card flex items-center justify-center text-text-muted hover:text-white transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="p-4 border-b border-border-subtle">
                <div className="text-[10px] text-text-secondary leading-normal bg-accent-soft/10 border border-accent-soft/20 rounded-lg p-3">
                  <i className="fa-solid fa-circle-info text-accent mr-1" />
                  O sistema aprende com o uso diário e injeta esse conhecimento contextual nas respostas automaticamente.
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-border-subtle">
                  <div className="w-7 h-7 rounded bg-[#534AB7]/10 text-[#534AB7] flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-text-muted font-bold">Profissão</div>
                    <div className="text-[12px] text-text-primary mt-0.5">Engenheiro civil. Atua com cálculo estrutural e laudos.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-border-subtle">
                  <div className="w-7 h-7 rounded bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">
                    <i className="fa-solid fa-code" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-text-muted font-bold">Projeto principal</div>
                    <div className="text-[12px] text-text-primary mt-0.5">Desenvolvendo SaaS de IA com Docker e APIs locais.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-border-subtle">
                  <div className="w-7 h-7 rounded bg-[#EF9F27]/10 text-[#EF9F27] flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">
                    <i className="fa-solid fa-chart-line" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-text-muted font-bold">Interesses</div>
                    <div className="text-[12px] text-text-primary mt-0.5">Tecnologia, produtividade, automações inteligentes.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-border-subtle">
                  <div className="w-7 h-7 rounded bg-[#378ADD]/10 text-[#378ADD] flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">
                    <i className="fa-solid fa-message" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase text-text-muted font-bold">Estilo preferido</div>
                    <div className="text-[12px] text-text-primary mt-0.5">Respostas diretas, técnicas e exemplos práticos.</div>
                  </div>
                </div>

                {memoriesCount > 4 && (
                  <div className="flex items-start gap-3 bg-accent-soft/10 p-3 rounded-lg border border-accent/20 animate-pulse">
                    <div className="w-7 h-7 rounded bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 mt-0.5 text-[12px]">
                      <i className="fa-solid fa-wand-magic-sparkles" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-accent font-bold">Nova Memória</div>
                      <div className="text-[12px] text-text-primary mt-0.5">Iterando design system gold com telemetria JSON.</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border-subtle bg-bg-deep/40 flex flex-col gap-2">
                <div className="text-center py-2 bg-black/50 border border-border-card rounded-lg text-[10px] text-text-muted">
                  Gerenciar memórias — em breve
                </div>
                <div className="text-[9px] text-text-muted text-center">
                  Processado por Hermes · Salvo no Obsidian
                </div>
              </div>
            </div>
          )}

          {/* Interactive Chat Console Inputs Area */}
          <div className="p-6 pt-2 bg-gradient-to-t from-bg-deep via-bg-deep/90 to-transparent">
            {/* Attachment preview */}
            {pendingFile && (
              <div className="flex items-center gap-3 bg-bg-alt border border-border-card rounded-lg p-3.5 mb-3 animate-[rise_0.15s_ease-out]">
                <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent-light flex items-center justify-center text-[15px]">
                  <i className={`${pendingFile.type === 'img' ? 'fa-solid fa-image' : 'fa-solid fa-file-lines'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-white truncate">{pendingFile.name}</div>
                  <div className="text-[10px] text-text-secondary">{pendingFile.size} · Pronto para envio</div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="w-6 h-6 rounded bg-black/40 border border-border-card flex items-center justify-center text-text-muted hover:text-white cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-[12px]" />
                </button>
              </div>
            )}

            <div className="blueprint-card bg-bg-alt border border-border-card rounded-2xl p-2.5 pl-4 shadow-2xl focus-within:border-accent transition-all flex items-end gap-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.gif"
                onChange={handleFileChange}
              />
              
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Mensagem ou envie um arquivo..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent text-[13.5px] py-2.5 resize-none outline-none text-text-primary max-h-[140px]"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-black/30 border border-border-card text-text-secondary hover:text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer flex-shrink-0"
                title="Anexar arquivo (PDF, imagem, doc...)"
              >
                <i className="fa-solid fa-paperclip text-[16px]" />
              </button>

              <button
                onClick={handleSend}
                className="w-10 h-10 bg-accent text-bg-deep rounded-xl flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all cursor-pointer flex-shrink-0"
                aria-label="Enviar"
              >
                <i className="fa-solid fa-paper-plane text-[15px]" />
              </button>
            </div>

            <div className="text-[10px] text-text-muted text-center mt-3 uppercase tracking-wider flex items-center justify-center gap-4">
              <span><i className="fa-solid fa-lock"></i> Criptografia AES-256</span>
              <span>•</span>
              <span>100% local e privado</span>
              <span>•</span>
              <span><i className="fa-solid fa-paperclip"></i> PDF, Word, TXT, Excel, PNG, JPG</span>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

import { Suspense } from 'react';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-deep flex items-center justify-center text-text-secondary">Carregando console...</div>}>
      <ChatContent />
    </Suspense>
  );
}
