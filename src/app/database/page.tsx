'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';
import { ESTANTES, ACERVO, AcervoItem } from '@/data/acervo-entries';

// Helper to normalize strings for comparison
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Synonyms mapping for Hermes matches
const SYN: [RegExp, string][] = [
  [/contrato|juridic|advog|clausula|\blei\b|processo legal|laudo/, "juridico contratos analise"],
  [/planilha|excel|\bcsv\b|tabela|celula|formula/, "planilha excel dados xlsx"],
  [/\bpdf\b|escanead|digitalizad|formulario/, "pdf extracao ocr leitura formularios"],
  [/\bword\b|docx|redigir|redacao|escrever documento|\bcarta\b|relatorio/, "word documentos escrita docx"],
  [/slide|apresenta|powerpoint|\bdeck\b|pitch/, "slides apresentacao deck pptx"],
  [/site|sites|\bweb\b|\bpagina\b|internet|\blink\b|\burl\b|noticia/, "web markdown busca"],
  [/lembr|memoria|recordar|persist|nao esquec/, "memoria persistencia grafo"],
  [/banco de dados|\bsql\b|postgres|\bquery\b|consultar dados/, "sql banco dados leitura"],
  [/github|repositorio|\brepo\b|pull request|\bpr\b|\bissue/, "github dev issues ci"],
  [/\bgit\b|commit|branch|versionar|versionamento/, "git versionamento dev"]
];

const STOP_WORDS = new Set(
  "preciso quero fazer isso aquilo esse essa esses essas meu minha tipo coisa coisas bagulho com para por que uma das dos como qual onde quando ele ela voce nao sim mais menos muito pouco tudo nada algum alguma gostaria queria poderia ter sobre num numa sao seu sua aqui agora entao depois bem assim".split(" ")
);

export default function DatabasePage() {
  const [view, setView] = useState<'acervo' | 'hermes'>('acervo');
  const [filtro, setFiltro] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [hermesPick, setHermesPick] = useState<number[] | null>(null);
  
  // Modal states
  const [selectedFichaIdx, setSelectedFichaIdx] = useState<number | null>(null);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  
  // Toast state
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  
  // Hermes Chat states
  const [chatMessages, setChatMessages] = useState<Array<{ side: 'user' | 'bot'; text: string; isHtml?: boolean; pickIndices?: number[] }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatStreamRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
  };

  useEffect(() => {
    if (toastShow) {
      const t = setTimeout(() => setToastShow(false), 2200);
      return () => clearTimeout(t);
    }
  }, [toastShow]);

  // Initial Hermes greeting
  useEffect(() => {
    if (view === 'hermes' && chatMessages.length === 0) {
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setChatMessages([
          {
            side: 'bot',
            text: 'Inicialização do módulo <b>Hermes Terminal</b> concluída. Forneça os parâmetros estruturais do que deseja construir e o sistema recuperará a documentação ou ferramentas MCP associadas.',
            isHtml: true
          }
        ]);
      }, 600);
    }
  }, [view]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Global escape key and search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFichaIdx(null);
        setManifestoOpen(false);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('q');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter and code helpers
  const codeFor = (item: AcervoItem) => {
    const grupo = ACERVO.filter((x) => x.tipo === item.tipo);
    const idx = grupo.indexOf(item) + 1;
    return `${ESTANTES[item.tipo].code}-${String(idx).padStart(3, '0')}`;
  };

  const matLabel = (m: string) => {
    return { oficial: 'Oficial', comunidade: 'Comunidade', experimental: 'Experimental', padrao: 'Padrão' }[m] || m;
  };

  // Toggle category shelf filter
  const toggleShelf = (key: string) => {
    setHermesPick(null);
    setFiltro((prev) => (prev === key ? null : key));
    
    // Smooth scroll to acervo section
    setTimeout(() => {
      const el = document.getElementById('acervo-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const clearFilters = () => {
    setFiltro(null);
    setHermesPick(null);
    setQ('');
  };

  const showView = (v: 'acervo' | 'hermes', scrollId?: string) => {
    setView(v);
    if (scrollId) {
      setTimeout(() => {
        const el = document.getElementById(scrollId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter items based on active parameters
  let filteredItems = ACERVO.slice();
  if (hermesPick) {
    filteredItems = hermesPick.map((idx) => ACERVO[idx]).filter(Boolean);
  } else if (filtro) {
    filteredItems = filteredItems.filter((x) => x.tipo === filtro);
  }

  if (q.trim()) {
    const searchVal = q.trim().toLowerCase();
    filteredItems = filteredItems.filter((x) =>
      `${x.t} ${x.sum} ${x.desc} ${x.autor} ${x.tags.join(' ')}`
        .toLowerCase()
        .includes(searchVal)
    );
  }

  // Copy item JSON logic
  const copyItem = (idx: number) => {
    const item = ACERVO[idx];
    if (!item) return;
    const obj = {
      codigo: codeFor(item),
      tipo: item.tipo,
      titulo: item.t,
      maturidade: item.mat,
      autor: item.autor,
      sumario: item.sum,
      descricao: item.desc,
      quando_usar: item.uso,
      como_obter: item.inst,
      tags: item.tags,
      fonte: item.fonte,
      licenca: item.lic
    };
    navigator.clipboard
      .writeText(JSON.stringify(obj, null, 2))
      .then(() => triggerToast('Asset copiado p/ área de transferência'));
  };

  // Manifesto Generator
  const buildManifest = () => {
    return {
      sistema: "alexandria-tech",
      descricao: "Acervo de alta performance com blocos de construção de IA.",
      versao: "1.0",
      revisado_em: "2026",
      estantes: Object.entries(ESTANTES).map(([k, e]) => ({
        id: k,
        codigo: e.code,
        nome: e.nome,
        descricao: e.desc,
        itens: ACERVO.filter((x) => x.tipo === k).length
      })),
      itens: ACERVO.map((item) => ({
        codigo: codeFor(item),
        tipo: item.tipo,
        titulo: item.t,
        maturidade: item.mat,
        autor: item.autor,
        sumario: item.sum,
        descricao: item.desc,
        quando_usar: item.uso,
        como_obter: item.inst,
        tags: item.tags,
        fonte: item.fonte,
        licenca: item.lic
      }))
    };
  };

  const copyManifest = () => {
    const man = buildManifest();
    navigator.clipboard
      .writeText(JSON.stringify(man, null, 2))
      .then(() => triggerToast('Manifesto carregado na área de transferência'));
  };

  const downloadManifest = () => {
    const man = buildManifest();
    const blob = new Blob([JSON.stringify(man, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alexandria.json';
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Iniciando download seguro');
  };

  // Hermes matching algorithm
  const hermesMatch = (raw: string) => {
    const text = ' ' + norm(raw) + ' ';
    let bag = text;
    for (const [pat, exp] of SYN) {
      if (pat.test(text)) bag += ' ' + exp;
    }
    const toks = [
      ...new Set(
        bag.split(/[^a-z0-9-]+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w))
      )
    ];

    return ACERVO.map((it, idx) => {
      const T = norm(it.tags.join(' '));
      const TI = norm(it.t);
      const S = norm(it.sum + ' ' + it.desc + ' ' + it.uso);
      let sc = 0;
      for (const w of toks) {
        if (T.includes(w)) sc += 3;
        else if (TI.includes(w)) sc += 2;
        else if (S.includes(w)) sc += 1;
      }
      return { idx, sc };
    })
      .filter((x) => x.sc > 0)
      .sort((a, b) => b.sc - a.sc);
  };

  const listJoin = (arr: string[]) => {
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1];
  };

  const handleHermesSend = (inputText = chatInput) => {
    const text = inputText.trim();
    if (!text) return;

    setChatMessages((prev) => [...prev, { side: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      setIsTyping(false);
      
      const isGreeting =
        /^\s*(oi|ola|opa|eai|e ai|hey|hello|bom dia|boa tarde|boa noite|salve)\b/.test(
          norm(text)
        ) && text.length < 22;

      const scored = hermesMatch(text);

      if (isGreeting && !scored.length) {
        setChatMessages((prev) => [
          ...prev,
          {
            side: 'bot',
            text: 'Console ativado. Insira seus parâmetros operacionais para triagem no acervo alexandria-tech.',
          }
        ]);
        return;
      }

      if (!scored.length) {
        setChatMessages((prev) => [
          ...prev,
          {
            side: 'bot',
            text: `Falha na indexação. Sintaxe ou contexto não reconhecido. Defina a operação desejada:`,
            isHtml: true,
            pickIndices: []
          }
        ]);
        return;
      }

      const top = scored.slice(0, 6).map((s) => s.idx);
      const nomeTipos = [...new Set(top.map((i) => ACERVO[i].tipo))].map(
        (t) => ESTANTES[t].nome
      );

      const lead = `Parâmetros processados. Classificação identificada: <b class="text-accent">${listJoin(
        nomeTipos
      )}</b>. Extraí ${top.length} ${
        top.length > 1 ? 'assets compatíveis' : 'asset compatível'
      } do core:`;

      setChatMessages((prev) => [
        ...prev,
        {
          side: 'bot',
          text: lead,
          isHtml: true,
          pickIndices: top
        }
      ]);
    }, 600);
  };

  const hermesOpenInAcervo = (indices: number[]) => {
    setHermesPick(indices);
    setFiltro(null);
    setQ('');
    showView('acervo', 'acervo-section');
    triggerToast('Telemetria filtrada via Hermes Terminal');
  };

  const syntaxHL = (json: string) => {
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="text-accent-light">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-white">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-accent">$1</span>');
  };

  const manifestJsonString = JSON.stringify(buildManifest(), null, 2);

  const starers = [
    "Inspecionar análise jurídica de PDFs.",
    "Buscar pipeline para code review no Github.",
    "Como fixar persistência de estado entre requisições?",
    "Análise preditiva em planilhas/bancos de dados.",
    "Motor de busca web com extração de citações."
  ];

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />

      <Navbar />

      {/* Blueprint Grid Background */}
      <div className="blueprint-grid" />

      {/* ── ACERVO VIEW ── */}
      {view === 'acervo' && (
        <div className="relative z-10">
          <header className="max-w-[1200px] mx-auto px-6 md:px-12 pt-28 pb-10 flex flex-col items-start">
            <div className="eyebrow flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-[12px]" /> Blueprint de Agentes
            </div>
            
            <h1 className="font-rework text-[clamp(32px,5vw,54px)] font-normal text-white uppercase leading-[1.1] tracking-[0.05em] scale-y-[0.85] origin-left mb-6 max-w-[20ch]">
              A biblioteca que <span className="text-accent font-rework shimmer-gold-text">sua IA</span> consegue ler.
            </h1>
            
            <p className="text-[14.5px] text-text-secondary max-w-[700px] leading-relaxed mb-8">
              Um acervo restrito de blocos de construção de IA — servidores MCP, Skills, agentes, prompts e ferramentas — catalogado com precisão militar. <strong className="text-white font-semibold">Humanos navegam pelas fichas; agentes baixam a telemetria JSON.</strong> Ou acione <strong className="text-accent font-semibold">Hermes</strong>, o terminal conversacional, para localizar os assets.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => showView('hermes')} className="btn btn-primary bg-accent text-bg-deep font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all flex items-center gap-2 text-[11px] tracking-wider uppercase">
                <i className="fa-solid fa-comments text-[14px]" /> Falar com Hermes
              </button>
              <button onClick={() => showView('acervo', 'indice')} className="btn btn-outline border border-accent text-accent font-bold px-6 py-3 rounded-full hover:bg-accent-soft transition-all flex items-center gap-2 text-[11px] tracking-wider uppercase">
                <i className="fa-solid fa-book text-[14px]" /> Explorar o acervo
              </button>
              <button onClick={() => setManifestoOpen(true)} className="btn btn-outline border border-accent text-accent font-bold px-6 py-3 rounded-full hover:bg-accent-soft transition-all flex items-center gap-2 text-[11px] tracking-wider uppercase">
                <i className="fa-solid fa-download text-[14px]" /> Manifesto
              </button>
            </div>

            <div className="flex flex-wrap gap-10 w-full pt-8 border-t border-border-subtle">
              <div className="flex flex-col items-start">
                <div className="font-mono text-[24px] font-bold text-white">{ACERVO.length}</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Itens no acervo</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="font-mono text-[24px] font-bold text-accent">5</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Estantes</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="font-mono text-[24px] font-bold text-white">JSON</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Formato Aberto</div>
              </div>
              <div className="flex flex-col items-start">
                <div className="font-mono text-[24px] font-bold text-accent">100%</div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">Legível por Agente</div>
              </div>
            </div>
          </header>

          {/* ── SHELVES INDEX ── */}
          <section id="indice" className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 border-t border-border-subtle">
            <div className="mb-8">
              <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-accent-dark" /> O Índice
              </div>
              <h2 className="font-rework text-[24px] font-normal text-white uppercase tracking-[0.08em] scale-y-[0.85] origin-left">
                Classificação de Assets
              </h2>
              <p className="text-[13px] text-text-secondary mt-1 max-w-[500px]">
                Toque numa estante para filtrar o acervo. Cada item recebe um código de identificação único.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(ESTANTES).map(([key, shelf]) => {
                const count = ACERVO.filter((x) => x.tipo === key).length;
                const isSelected = filtro === key;
                return (
                  <button
                    key={key}
                    onClick={() => toggleShelf(key)}
                    style={{ '--c': shelf.cor } as React.CSSProperties}
                    className={`blueprint-card text-left p-6 flex flex-col justify-between items-start cursor-pointer transition-all duration-300 relative rounded-xl border ${
                      isSelected 
                        ? 'border-accent bg-accent/5 shadow-[0_10px_30px_rgba(212,175,90,0.08)]' 
                        : 'border-border-card bg-bg-alt hover:border-accent-dark hover:-translate-y-1'
                    }`}
                  >
                    
                    <div 
                      className="w-9 h-9 rounded-lg bg-black/40 border border-border-subtle flex items-center justify-center text-[18px] mb-4"
                      style={{ color: shelf.cor }}
                    >
                      <i className={shelf.ic} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-wider text-text-muted mb-1">
                        {shelf.code} //
                      </div>
                      <div className="font-rework text-[14px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left">
                        {shelf.nome}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-text-secondary mt-4 uppercase">
                      <span className="text-accent font-mono font-bold">{count}</span> itens listados
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── ACERVO LISTING ── */}
          <section id="acervo-section" className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
            <div className="mb-6">
              <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-accent-dark" /> O Acervo
              </div>
              <h2 className="font-rework text-[24px] font-normal text-white uppercase tracking-[0.08em] scale-y-[0.85] origin-left">
                Fichas de Telemetria
              </h2>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-black/40 border border-border-card rounded-lg px-4 py-3.5 focus-within:border-accent transition-all">
                <i className="fa-solid fa-magnifying-glass text-text-secondary text-[16px]" />
                <input
                  id="q"
                  type="text"
                  placeholder="Buscar por identificador, tag ou descrição..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] outline-none text-text-primary"
                  autoComplete="off"
                />
                <kbd className="font-mono text-[10px] text-text-muted border border-border-subtle rounded px-1.5 py-0.5">/</kbd>
              </div>
              
              {(filtro || q || hermesPick) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-text-secondary tracking-[0.05em] uppercase px-4 py-3.5 border border-border-card bg-black/40 rounded-lg hover:text-white hover:border-border-subtle transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-[14px]" /> Limpar Filtros
                </button>
              )}
              
              <button
                onClick={() => setManifestoOpen(true)}
                className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.05em] uppercase px-4 py-3.5 border border-accent text-accent bg-transparent rounded-lg hover:bg-accent-soft transition-all cursor-pointer"
              >
                <i className="fa-solid fa-code text-[14px]" /> Manifesto
              </button>
            </div>

            {/* Hermes Banner */}
            {hermesPick && (
              <div className="flex items-center gap-3 bg-accent-soft border border-accent/30 rounded-lg px-4 py-3 mb-6 text-[11px] font-semibold text-accent tracking-[0.05em] uppercase">
                <i className="fa-solid fa-terminal text-[15px]" />
                <span>TELEMETRIA HERMES: Foram isolados {filteredItems.length} assets relevantes para a operação.</span>
                <button
                  onClick={() => setHermesPick(null)}
                  className="ml-auto text-[9px] font-bold text-text-secondary bg-black/40 border border-border-card rounded px-3 py-1.5 uppercase hover:text-white hover:border-border-subtle transition-all"
                >
                  Limpar Cache
                </button>
              </div>
            )}

            {/* Result Line */}
            <div className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.1em] mb-4">
              <span className="text-accent font-mono font-bold">[ {filteredItems.length} ]</span> FICHAS REGISTRADAS // {hermesPick ? 'Seleção Hermes' : (filtro ? ESTANTES[filtro].nome : 'Base Geral')}{q ? ` // QUERY: "${q}"` : ''}
            </div>

            {/* Fichas Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 text-text-muted border border-dashed border-border-card rounded-xl bg-bg-alt/30">
                <i className="fa-solid fa-database text-[32px] text-text-muted block mb-4" />
                <span className="block text-[14px] text-white font-rework uppercase mb-2">Sem Resultados</span>
                <span className="text-[12px]">Modifique os parâmetros de busca ou limpe o cache.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const originalIndex = ACERVO.indexOf(item);
                  const e = ESTANTES[item.tipo];
                  return (
                    <button
                      key={originalIndex}
                      onClick={() => setSelectedFichaIdx(originalIndex)}
                      style={{ '--c': e.cor } as React.CSSProperties}
                      className="blueprint-card text-left p-6 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-300 relative rounded-xl border border-border-card bg-bg-alt hover:border-border-subtle hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1"
                    >
                      
                      <div className="flex items-center justify-between w-full">
                        <span 
                          className="font-mono text-[10px] tracking-wider font-bold"
                          style={{ color: e.cor }}
                        >
                          [ {codeFor(item)} ]
                        </span>
                        <span className={`badge px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                          item.mat === 'oficial' ? 'bg-accent text-bg-deep' :
                          item.mat === 'comunidade' ? 'border border-accent text-accent bg-transparent' :
                          item.mat === 'experimental' ? 'border border-border-card text-text-secondary bg-transparent' :
                          'bg-bg-deep border border-border-subtle text-text-primary'
                        }`}>
                          {matLabel(item.mat)}
                        </span>
                      </div>

                      <div className="font-rework text-[16px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left line-height-tight mt-1">
                        {item.t}
                      </div>

                      <p className="text-[13px] text-text-secondary leading-relaxed flex-1">
                        {item.sum}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.tags.slice(0, 3).map((tag, ti) => (
                          <span key={ti} className="tag text-[9px] font-mono uppercase tracking-wider text-text-muted bg-black/40 border border-border-subtle rounded px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle w-full">
                        <span className="text-[11px] font-mono uppercase text-text-muted flex items-center gap-1.5">
                          <i className={e.ic} style={{ color: 'var(--accent)' }} /> {item.autor}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          Inspecionar <i className="fa-solid fa-arrow-right text-[11px]" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── FOOTER SOBRE ── */}
          <footer id="sobre" className="border-t border-border-subtle bg-black/40 mt-20 py-16">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 justify-between">
              <div className="max-w-[400px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded bg-accent-soft border border-accent-dark flex items-center justify-center text-accent">
                    <i className="fa-solid fa-book" />
                  </div>
                  <span className="font-rework text-[15px] font-extrabold tracking-wider text-accent uppercase scale-y-[0.85]">
                    [ alexandria-tech ]
                  </span>
                </div>
                <p className="text-[13.5px] text-text-secondary leading-relaxed">
                  A intersecção entre o conhecimento ancestral e a computação de alta performance. Uma estrutura central para armazenar blocos operacionais de Inteligência Artificial com padronização visual e programática.
                </p>
                <div className="font-mono text-[10px] text-text-muted mt-8 leading-relaxed uppercase">
                  Catálogo aberto · Estrutura JSON · Última revisão 2026<br />
                  Os itens referenciam projetos de seus respectivos mantenedores.
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                  <span className="w-6 h-[1px] bg-accent-dark" /> Protocolo de Integração
                </div>
                
                <div className="flex flex-col gap-3 max-w-[380px]">
                  <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>Aponte o agente para o <strong className="text-accent font-semibold">manifesto JSON</strong> estruturado.</div>
                  </div>
                  <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>A IA fará a leitura autônoma do <strong className="text-accent font-semibold">tipo, sumário e ativação</strong>.</div>
                  </div>
                  <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div>A decisão e o acoplamento do repositório/fonte são efetuados.</div>
                  </div>
                </div>

                <button
                  onClick={() => setManifestoOpen(true)}
                  className="btn btn-outline border border-accent text-accent font-bold px-5 py-2.5 rounded-full hover:bg-accent-soft transition-all flex items-center gap-2 text-[11px] tracking-wider uppercase self-start mt-4 cursor-pointer"
                >
                  <i className="fa-solid fa-code text-[14px]" /> Inspecionar Manifesto
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ── HERMES TERMINAL VIEW ── */}
      {view === 'hermes' && (
        <div className="relative z-10 pt-16 min-h-screen flex flex-col justify-between">
          <div className="flex-1 max-w-[760px] w-full mx-auto px-6 py-6 flex flex-col gap-6 mb-28">
            <div className="flex items-center gap-4 py-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] text-bg-deep bg-accent shadow-[0_0_20px_rgba(212,175,90,0.2)]">
                <i className="fa-solid fa-terminal" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-rework text-[20px] text-white uppercase tracking-wide scale-y-[0.85] origin-left mb-0.5">
                  Hermes Terminal
                </div>
                <div className="text-[11px] text-text-secondary font-mono uppercase tracking-wider">
                  Módulo Analítico e Recuperação de Assets
                </div>
              </div>
              <button
                onClick={() => showView('acervo')}
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] text-text-muted border border-border-card bg-black/40 rounded-lg px-4 py-2.5 hover:text-white hover:border-accent transition-all cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left" /> Voltar ao Acervo
              </button>
            </div>

            {/* Chat Stream */}
            <div ref={chatStreamRef} className="flex flex-col gap-5 overflow-y-auto max-h-[60vh] pr-2">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 max-w-[85%] ${
                    msg.side === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {msg.side === 'bot' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] text-bg-deep bg-accent flex-shrink-0">
                      <i className="fa-solid fa-terminal" />
                    </div>
                  )}
                  
                  <div 
                    className={`px-5 py-4 rounded-2xl text-[13.5px] leading-relaxed shadow-lg border ${
                      msg.side === 'user' 
                        ? 'bg-accent border-accent text-bg-deep rounded-tr-sm' 
                        : 'bg-bg-alt border-border-card text-text-primary rounded-tl-sm'
                    }`}
                  >
                    {msg.isHtml ? (
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                        {msg.pickIndices && msg.pickIndices.length > 0 && (
                          <div className="flex flex-col gap-3 mt-4">
                            <div className="grid grid-cols-1 gap-3">
                              {msg.pickIndices.map((idx) => {
                                const item = ACERVO[idx];
                                const e = ESTANTES[item.tipo];
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedFichaIdx(idx)}
                                    style={{ '--c': e.cor } as React.CSSProperties}
                                    className="blueprint-card text-left p-4 flex flex-col gap-1 cursor-pointer transition-all border border-border-card bg-black/40 hover:border-accent"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-mono text-[9px] tracking-wider font-bold" style={{ color: e.cor }}>
                                        [ {codeFor(item)} ]
                                      </span>
                                      <span className={`badge px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                                        item.mat === 'oficial' ? 'bg-accent text-bg-deep' : 'border border-accent text-accent'
                                      }`}>
                                        {matLabel(item.mat)}
                                      </span>
                                    </div>
                                    <div className="font-rework text-[13px] font-normal text-white uppercase scale-y-[0.85] origin-left">
                                      {item.t}
                                    </div>
                                    <div className="text-[11.5px] text-text-secondary">
                                      {item.sum}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            
                            <button
                              onClick={() => hermesOpenInAcervo(msg.pickIndices!)}
                              className="w-full text-center text-[10px] font-bold uppercase tracking-wider bg-accent text-bg-deep py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                            >
                              <i className="fa-solid fa-border-all" /> Isolar no Acervo
                            </button>
                          </div>
                        )}
                        {msg.pickIndices && msg.pickIndices.length === 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button onClick={() => handleHermesSend('ler e analisar documentos pdf e word')} className="chip text-[11px] text-text-secondary bg-black/40 border border-border-card rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-all cursor-pointer">
                              Parsing Documental
                            </button>
                            <button onClick={() => handleHermesSend('conectar github slack ou banco de dados')} className="chip text-[11px] text-text-secondary bg-black/40 border border-border-card rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-all cursor-pointer">
                              Acoplar Integrações
                            </button>
                            <button onClick={() => handleHermesSend('escrever prompts melhores')} className="chip text-[11px] text-text-secondary bg-black/40 border border-border-card rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-all cursor-pointer">
                              Otimização de Contexto
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] text-bg-deep bg-accent flex-shrink-0">
                    <i className="fa-solid fa-terminal" />
                  </div>
                  <div className="bg-bg-alt border border-border-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear_0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted animate-[blink_1.2s_infinite_linear_0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick starter chips */}
            {chatMessages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 mt-2">
                {starers.map((s, si) => (
                  <button
                    key={si}
                    onClick={() => handleHermesSend(s)}
                    className="chip text-[11px] text-left text-text-secondary bg-black/40 border border-border-card rounded-full px-4 py-2.5 hover:border-accent hover:text-accent transition-all cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Bar Input */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-deep via-bg-deep/80 to-transparent z-40">
            <div className="max-w-[760px] mx-auto flex items-end gap-3 bg-bg-alt border border-border-card rounded-2xl p-2.5 pl-5 shadow-2xl focus-within:border-accent transition-all">
              <textarea
                ref={chatInputRef}
                rows={1}
                placeholder="Ex: preciso de telemetria sobre análise de PDFs..."
                value={chatInput}
                onChange={(e) => {
                  setQ(e.target.value);
                  setChatInput(e.target.value);
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleHermesSend();
                  }
                }}
                className="flex-1 bg-transparent text-[13.5px] py-3 resize-none outline-none text-text-primary max-h-[140px]"
              />
              <button
                onClick={() => handleHermesSend()}
                className="w-11 h-11 bg-accent text-bg-deep rounded-xl flex items-center justify-center text-[18px] hover:opacity-90 hover:scale-105 transition-all cursor-pointer flex-shrink-0"
                aria-label="Enviar"
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAILS MODAL ── */}
      {selectedFichaIdx !== null && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedFichaIdx(null); }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-start justify-center p-10 overflow-y-auto"
        >
          {(() => {
            const item = ACERVO[selectedFichaIdx];
            const e = ESTANTES[item.tipo];
            const hasExternalLink = item.fonte && item.fonte !== '#';
            return (
              <div 
                style={{ '--c': e.cor } as React.CSSProperties}
                className="bg-bg-alt border border-border-card rounded-2xl w-full max-w-[680px] shadow-2xl overflow-hidden mt-6 animate-[rise_0.2s_ease-out]"
              >
                <div className="h-1" style={{ backgroundColor: e.cor }} />
                
                {/* Modal Head */}
                <div className="p-8 pb-5 border-b border-border-subtle relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color: e.cor }}>
                      [ {codeFor(item)} ]
                    </span>
                    <span className={`badge px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                      item.mat === 'oficial' ? 'bg-accent text-bg-deep' :
                      item.mat === 'comunidade' ? 'border border-accent text-accent' :
                      'border border-border-card text-text-secondary bg-transparent'
                    }`}>
                      {matLabel(item.mat)}
                    </span>
                    
                    <button 
                      onClick={() => setSelectedFichaIdx(null)}
                      className="ml-auto w-8 h-8 rounded-lg bg-black/40 border border-border-card flex items-center justify-center text-text-muted hover:text-white hover:border-accent transition-all cursor-pointer"
                      aria-label="Fechar"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                  
                  <h3 className="font-rework text-[22px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left leading-normal">
                    {item.t}
                  </h3>
                  
                  <div className="text-[11px] font-mono uppercase text-text-secondary flex items-center gap-2 mt-2">
                    <i className={e.ic} style={{ color: e.cor }} /> {e.nome} // {item.autor}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 flex flex-col gap-6">
                  <div>
                    <div className="font-mono text-[10px] tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-align-left" /> Sumário Operacional
                    </div>
                    <div className="text-[13px] text-text-primary leading-relaxed">{item.desc}</div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-lightbulb" /> Indicação de Uso
                    </div>
                    <div className="text-[13px] text-text-secondary leading-relaxed">{item.uso}</div>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-terminal" /> Método de Instalação
                    </div>
                    <pre className="bg-black border border-border-card rounded-lg p-4 font-mono text-[11px] text-accent-light overflow-x-auto whitespace-pre">
                      {item.inst}
                    </pre>
                  </div>

                  <div>
                    <div className="font-mono text-[10px] tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                      <i className="fa-solid fa-tags" /> Metadados
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, ti) => (
                        <span key={ti} className="tag text-[9px] font-mono uppercase tracking-wider text-text-muted bg-black/40 border border-border-subtle rounded px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
                    {hasExternalLink && (
                      <a
                        href={item.fonte}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-border-card rounded-full px-5 py-2.5 bg-transparent hover:border-accent hover:text-accent transition-all"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" /> Origem Externa
                      </a>
                    )}
                    
                    <button
                      onClick={() => copyItem(selectedFichaIdx)}
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-border-card rounded-full px-5 py-2.5 bg-transparent hover:border-accent hover:text-accent transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-code" /> Copiar Objeto (JSON)
                    </button>
                    
                    {item.lic && item.lic !== '—' && (
                      <span className="ml-auto font-mono text-[9px] uppercase text-text-muted">
                        LIC: {item.lic}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MANIFESTO OVERLAY ── */}
      {manifestoOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setManifestoOpen(false); }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-start justify-center p-10 overflow-y-auto"
        >
          <div className="bg-bg-alt border border-border-card rounded-2xl w-full max-w-[800px] shadow-2xl overflow-hidden mt-6 animate-[rise_0.2s_ease-out]">
            <div className="h-1 bg-accent" />
            
            {/* Modal Head */}
            <div className="p-8 pb-5 border-b border-border-subtle relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] font-bold tracking-wider text-accent">
                  [ CORE // MANIFESTO ]
                </span>
                <button 
                  onClick={() => setManifestoOpen(false)}
                  className="ml-auto w-8 h-8 rounded-lg bg-black/40 border border-border-card flex items-center justify-center text-text-muted hover:text-white hover:border-accent transition-all cursor-pointer"
                  aria-label="Fechar"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              
              <h3 className="font-rework text-[22px] font-normal text-white uppercase tracking-wide scale-y-[0.85] origin-left leading-normal">
                Telemetria p/ Agentes
              </h3>
              
              <div className="text-[11px] font-mono uppercase text-text-secondary flex items-center gap-2 mt-2">
                <i className="fa-solid fa-code style={{ color:'var(--accent)' }}" /> Estrutura JSON consolidada de leitura direta.
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 flex flex-col gap-6">
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Acervo empacotado como dado estruturado. <strong className="text-white font-semibold">Forneça este payload à IA</strong> e o sistema terá capacidade analítica para auto-seleção de componentes.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>Cada nó possui <strong className="text-accent font-semibold">tipo</strong>, <strong className="text-accent font-semibold">sumário</strong>, e <strong className="text-accent font-semibold">indicação</strong>.</div>
                </div>
                <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>A IA executa o parsing via <strong className="text-accent font-semibold">metadados</strong>.</div>
                </div>
                <div className="flex gap-3 items-start text-[13px] text-text-secondary leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-bg-deep bg-accent w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>O asset é baixado a partir da chave <strong className="text-accent font-semibold">como_obter</strong>.</div>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-code" /> alexandria.json // {ACERVO.length} entradas
                </div>
                <div 
                  className="bg-black border border-border-card rounded-lg p-5 max-h-[340px] overflow-auto font-mono text-[11.5px] leading-relaxed text-text-secondary whitespace-pre"
                  dangerouslySetInnerHTML={{ 
                    __html: syntaxHL(
                      manifestJsonString.length > 4000 
                        ? manifestJsonString.slice(0, 4000) + "\n  ... (Download necessário p/ payload completo)" 
                        : manifestJsonString
                    ) 
                  }}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
                <button
                  onClick={copyManifest}
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-border-card rounded-full px-5 py-2.5 bg-transparent hover:border-accent hover:text-accent transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-copy" /> Copiar Payload
                </button>
                <button
                  onClick={downloadManifest}
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-border-card rounded-full px-5 py-2.5 bg-transparent hover:border-accent hover:text-accent transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-download" /> Baixar alexandria.json
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      <div 
        className={`fixed bottom-[30px] left-1/2 -translate-x-1/2 bg-accent text-bg-deep px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 z-[1100] transition-all duration-300 pointer-events-none ${
          toastShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <i className="fa-solid fa-check" />
        <span>{toastMsg}</span>
      </div>

      <Footer />
    </>
  );
}
