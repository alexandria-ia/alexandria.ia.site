'use client';

import React, { useState } from 'react';
import { 
  Compass, Copy, CheckCircle, Shield, 
  Terminal, Key, Info, Layout, Palette, 
  Type, Move, FileText, Image as ImageIcon,
  ChevronDown, AlertTriangle, AlertCircle, Calendar as CalendarIcon,
  Play, Users, Search, Moon, Sun, ArrowRight, CornerDownRight,
  ExternalLink, LogOut, Check, Sliders, Settings, Plus, Minus, X, Trash2
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';

// Categorized components list following the user's checklist
const COMPONENT_CATEGORIES = [
  {
    name: 'Fundamentos',
    items: ['Cores', 'Tipografia', 'Raio e Espaco', 'Elevacao']
  },
  {
    name: 'Ações',
    items: ['Button', 'Button Group']
  },
  {
    name: 'Formulários',
    items: [
      'Input', 'Number Input', 'Textarea', 'Input OTP', 'Checkbox', 
      'Radio Group', 'Switch', 'Select', 'Autocomplete', 'Slider', 
      'Form completo', 'Date Input'
    ]
  },
  {
    name: 'Dados',
    items: [
      'Card', 'Avatar e User', 'Chip e Badge', 'Code e Kbd', 'Table', 
      'Listbox', 'Accordion', 'Skeleton', 'Divider e Image'
    ]
  },
  {
    name: 'Navegação',
    items: [
      'Breadcrumbs', 'Link', 'Tabs', 'Pagination', 'Navbar', 'Dropdown Menu'
    ]
  },
  {
    name: 'Feedback',
    items: [
      'Alert', 'Progress', 'Spinner', 'Tooltip', 'Popover', 'Toast'
    ]
  },
  {
    name: 'Overlays & Data',
    items: [
      'Modal', 'Drawer', 'Calendar'
    ]
  }
];

export default function DesignPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string>('Button');
  
  // Interactive UI states
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [switchVal, setSwitchVal] = useState(true);
  const [sliderVal, setSliderVal] = useState(50);
  const [radioVal, setRadioVal] = useState('pro');
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showAlertDiag, setShowAlertDiag] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSonner, setShowSonner] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxVal, setComboboxVal] = useState('Starter');
  const [otpVals, setOtpVals] = useState(['4', '8', '2', '9', '0', '1']);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // New states for added elements
  const [numVal, setNumVal] = useState(1);
  const [autoCompleteQuery, setAutoCompleteQuery] = useState('');
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [selectedListboxItem, setSelectedListboxItem] = useState('starter');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const autocompleteOptions = [
    'GPT-4o (Híbrido)',
    'Claude 3.5 Sonnet',
    'Gemini 1.5 Pro',
    'Llama 3.1 70B',
    'Mistral Large 2'
  ];

  const filteredOptions = autocompleteOptions.filter(o => 
    o.toLowerCase().includes(autoCompleteQuery.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = [
    { name: 'bg-deep', hex: '#05070B', desc: 'Fundo principal ultra-escuro' },
    { name: 'bg-alt', hex: '#0A0F18', desc: 'Painéis, cards e blocos flutuantes' },
    { name: 'accent', hex: '#D4AF5A', desc: 'Dourado principal para destaques' },
    { name: 'accent-light', hex: '#E7C879', desc: 'Hover e destaques suaves' },
    { name: 'accent-dark', hex: '#8C6A2A', desc: 'Bordas e relevos dourados' },
    { name: 'text-primary', hex: '#EAEAEA', desc: 'Texto de leitura principal' },
    { name: 'text-secondary', hex: '#9EA5B3', desc: 'Labels e textos secundários' },
    { name: 'border-card', hex: '#161F30', desc: 'Bordas de modais e cards' },
  ];

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />
      <Navbar />

      <main className="min-h-screen bg-bg-deep text-text-primary pt-24 pb-20 relative overflow-x-hidden font-sans z-10">
        {/* Blueprint background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border-subtle pb-8 relative mb-12">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">// MANUAL DE IDENTIDADE VISUAL & BIBLIOTECA DE COMPONENTES</span>
            <h1 className="font-rework text-[36px] md:text-[44px] font-extrabold text-white tracking-wider uppercase scale-y-[0.85] origin-left">
              Componentes & Design Tokens
            </h1>
            <p className="text-[14px] text-text-secondary max-w-2xl">
              Diretrizes oficiais e biblioteca de todos os componentes interativos do ecossistema alexandria-tech.
            </p>
          </div>

          {/* MAIN WORKSPACE: SIDEBAR & PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar Navigation */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <div className="bg-bg-alt border border-border-card p-4 rounded-[16px] flex flex-col gap-5 max-h-[650px] overflow-y-auto backdrop-blur-md scrollbar-thin">
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest px-2 pb-2 border-b border-border-subtle block">
                  Biblioteca de UI
                </span>
                
                {COMPONENT_CATEGORIES.map((category) => (
                  <div key={category.name} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider px-2">
                      {category.name}
                    </span>
                    <div className="flex flex-col gap-1">
                      {category.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => setActiveComponent(item)}
                          className={`text-left px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors border-none cursor-pointer ${
                            activeComponent === item 
                              ? 'bg-accent/15 border border-accent/25 text-accent font-semibold' 
                              : 'bg-transparent text-text-secondary hover:text-white hover:bg-white/3'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Preview Panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Component Title */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="text-[18px] font-bold text-white font-rework tracking-wider uppercase scale-y-[0.9] origin-left">
                  Visualização: {activeComponent}
                </h3>
                <span className="font-mono text-[10px] text-accent">// {activeComponent.toLowerCase()} preview</span>
              </div>

              {/* Component Visual Playground Card */}
              <div className="bg-bg-alt border border-border-card rounded-[16px] p-8 min-h-[340px] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                
                {/* Miras Técnicas */}
                <div className="absolute top-4 left-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />
                <div className="absolute top-4 right-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />
                <div className="absolute bottom-4 left-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />
                <div className="absolute bottom-4 right-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />

                <div className="w-full max-w-lg flex flex-col items-center justify-center gap-4">
                  
                  {/* CORES */}
                  {activeComponent === 'Cores' && (
                    <div className="grid grid-cols-4 gap-3 w-full">
                      {colors.slice(0, 4).map((c) => (
                        <div key={c.name} className="flex flex-col gap-1 text-center">
                          <div className="h-10 rounded-[6px] border border-white/5" style={{ backgroundColor: c.hex }} />
                          <span className="font-mono text-[9px] text-white uppercase">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TIPOGRAFIA */}
                  {activeComponent === 'Tipografia' && (
                    <div className="w-full text-left flex flex-col gap-2">
                      <span className="font-rework text-[24px] font-bold text-white tracking-widest uppercase scale-y-[0.85] origin-left">MARCELLUS SERIF</span>
                      <span className="text-[13px] text-text-secondary">Inter Sans-Serif: Leitura e controles operacionais.</span>
                      <span className="font-mono text-[11px] text-accent">JetBrains Mono: Telemetria e retornos.</span>
                    </div>
                  )}

                  {/* RAIO E ESPACO */}
                  {activeComponent === 'Raio e Espaco' && (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1 bg-black/40 border border-border-card p-3 rounded-[6px] text-center">
                          <span className="text-[10px] font-mono text-accent block">Raio: 6px</span>
                        </div>
                        <div className="flex-1 bg-black/40 border border-border-card p-4 rounded-[12px] text-center">
                          <span className="text-[10px] font-mono text-accent block">Raio: 12px</span>
                        </div>
                        <div className="flex-1 bg-black/40 border border-border-card p-5 rounded-[16px] text-center">
                          <span className="text-[10px] font-mono text-accent block">Raio: 16px</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ELEVACAO */}
                  {activeComponent === 'Elevacao' && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-bg-alt border border-border-card p-5 rounded-[12px] shadow-lg text-center">
                        <span className="text-[11px] font-bold text-white uppercase">Shadow LG</span>
                      </div>
                      <div className="bg-bg-alt border border-border-card p-5 rounded-[12px] shadow-[0_0_20px_rgba(212,175,90,0.12)] text-center">
                        <span className="text-[11px] font-bold text-accent uppercase">Gold Glow</span>
                      </div>
                    </div>
                  )}

                  {/* BUTTON */}
                  {activeComponent === 'Button' && (
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button className="bg-accent hover:opacity-90 text-bg-deep border-none text-[11px] font-bold uppercase tracking-wider py-3 px-6 rounded-full cursor-pointer transition-opacity">
                        Botão Primário
                      </button>
                      <button className="bg-transparent border border-accent text-accent hover:bg-accent/5 text-[11px] font-bold uppercase tracking-wider py-3 px-6 rounded-full cursor-pointer transition-colors">
                        Botão Secundário
                      </button>
                    </div>
                  )}

                  {/* BUTTON GROUP */}
                  {activeComponent === 'Button Group' && (
                    <div className="inline-flex rounded-full overflow-hidden border border-border-card">
                      <button className="bg-accent/15 text-accent border-r border-border-card hover:bg-accent/25 text-[11px] font-bold uppercase py-2.5 px-5 cursor-pointer transition-colors">
                        Starter
                      </button>
                      <button className="bg-accent/15 text-accent hover:bg-accent/25 text-[11px] font-bold uppercase py-2.5 px-5 cursor-pointer transition-colors">
                        Pro
                      </button>
                    </div>
                  )}

                  {/* INPUT */}
                  {activeComponent === 'Input' && (
                    <input 
                      type="text" 
                      placeholder="Nome do assinante..."
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-3.5 px-4 text-[13px] text-text-primary outline-none focus:border-accent transition-colors"
                    />
                  )}

                  {/* NUMBER INPUT */}
                  {activeComponent === 'Number Input' && (
                    <div className="flex items-center bg-black/40 border border-border-card rounded-[10px] overflow-hidden w-full max-w-[200px]">
                      <button 
                        onClick={() => setNumVal(Math.max(1, numVal - 1))}
                        className="p-3.5 hover:bg-white/5 border-r border-border-card text-text-secondary hover:text-white cursor-pointer border-none bg-transparent"
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="text" 
                        value={numVal} 
                        readOnly 
                        className="flex-1 bg-transparent border-none text-center font-mono text-[14px] text-white outline-none w-12"
                      />
                      <button 
                        onClick={() => setNumVal(numVal + 1)}
                        className="p-3.5 hover:bg-white/5 border-l border-border-card text-text-secondary hover:text-white cursor-pointer border-none bg-transparent"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}

                  {/* TEXTAREA */}
                  {activeComponent === 'Textarea' && (
                    <textarea 
                      placeholder="Mensagem do webhook..."
                      rows={3}
                      className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-[13px] text-text-primary outline-none focus:border-accent transition-colors resize-none"
                    />
                  )}

                  {/* INPUT OTP */}
                  {activeComponent === 'Input OTP' && (
                    <div className="flex gap-2 justify-center">
                      {otpVals.map((val, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => {
                            const newVals = [...otpVals];
                            newVals[idx] = e.target.value;
                            setOtpVals(newVals);
                          }}
                          className="w-10 h-10 bg-black/40 border border-border-card focus:border-accent rounded-[8px] text-center font-mono text-[14px] font-bold text-accent outline-none"
                        />
                      ))}
                    </div>
                  )}

                  {/* CHECKBOX */}
                  {activeComponent === 'Checkbox' && (
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={checkboxVal}
                        onChange={() => setCheckboxVal(!checkboxVal)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-[4px] border ${checkboxVal ? 'bg-accent border-accent text-bg-deep' : 'border-border-card bg-transparent'} flex items-center justify-center transition-colors`}>
                        {checkboxVal && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="text-[13px] text-text-secondary">Aceitar regulamento</span>
                    </label>
                  )}

                  {/* RADIO GROUP */}
                  {activeComponent === 'Radio Group' && (
                    <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                      {[
                        { id: 'starter', label: 'Starter (R$ 49)' },
                        { id: 'pro', label: 'Pro (R$ 149)' }
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="plan-radio"
                            checked={radioVal === item.id}
                            onChange={() => setRadioVal(item.id)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${radioVal === item.id ? 'border-accent' : 'border-border-card'}`}>
                            {radioVal === item.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                          </div>
                          <span className="text-[12px] text-text-secondary">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* SWITCH */}
                  {activeComponent === 'Switch' && (
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-text-secondary">Modo Produção</span>
                      <button
                        onClick={() => setSwitchVal(!switchVal)}
                        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border-none outline-none ${
                          switchVal ? 'bg-accent' : 'bg-white/10'
                        }`}
                      >
                        <span className={`absolute top-1.5 w-3 h-3 rounded-full bg-bg-deep transition-transform duration-200 ${
                          switchVal ? 'right-2' : 'left-2'
                        }`} />
                      </button>
                    </div>
                  )}

                  {/* SELECT */}
                  {activeComponent === 'Select' && (
                    <select className="w-full bg-black/40 border border-border-card rounded-[10px] py-3.5 px-4 text-[13px] text-text-primary outline-none focus:border-accent transition-colors cursor-pointer">
                      <option className="bg-bg-alt text-white">Conselho dos Arcontes (Pro)</option>
                      <option className="bg-bg-alt text-white">Ordem dos Escribas (Starter)</option>
                    </select>
                  )}

                  {/* AUTOCOMPLETE */}
                  {activeComponent === 'Autocomplete' && (
                    <div className="relative w-full max-w-[280px]">
                      <div className="flex items-center bg-black/40 border border-border-card rounded-[10px] px-3 py-1.5">
                        <Search size={14} className="text-text-muted mr-2" />
                        <input 
                          type="text" 
                          placeholder="Pesquisar modelo..."
                          value={autoCompleteQuery}
                          onChange={(e) => {
                            setAutoCompleteQuery(e.target.value);
                            setAutoCompleteOpen(true);
                          }}
                          onFocus={() => setAutoCompleteOpen(true)}
                          className="w-full bg-transparent border-none outline-none text-[12px] text-white"
                        />
                      </div>
                      {autoCompleteOpen && (
                        <div className="absolute top-12 left-0 w-full bg-bg-alt border border-border-card rounded-[10px] shadow-2xl z-20 flex flex-col p-1.5">
                          {filteredOptions.length === 0 ? (
                            <span className="text-[11px] text-text-muted text-center py-2">Sem resultados</span>
                          ) : (
                            filteredOptions.map((o) => (
                              <button
                                key={o}
                                onClick={() => {
                                  setAutoCompleteQuery(o);
                                  setAutoCompleteOpen(false);
                                }}
                                className="text-left py-2 px-3 hover:bg-white/4 rounded-[6px] text-[11px] text-text-secondary hover:text-white cursor-pointer border-none bg-transparent"
                              >
                                {o}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SLIDER */}
                  {activeComponent === 'Slider' && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex justify-between font-mono text-[10px] text-text-secondary">
                        <span>VOLUME DA API</span>
                        <span className="text-accent">{sliderVal}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderVal}
                        onChange={(e) => setSliderVal(Number(e.target.value))}
                        className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}

                  {/* FORM COMPLETO */}
                  {activeComponent === 'Form completo' && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setFormSuccess(true);
                        setTimeout(() => setFormSuccess(false), 3000);
                      }}
                      className="bg-black/20 border border-border-subtle p-5 rounded-[16px] w-full flex flex-col gap-4 text-left"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">Nome Completo</label>
                        <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Ex: Lucas Silva" className="bg-black/40 border border-border-card rounded-[8px] py-2 px-3 text-[12px] text-white outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">E-mail</label>
                        <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required placeholder="lucas@exemplo.com" className="bg-black/40 border border-border-card rounded-[8px] py-2 px-3 text-[12px] text-white outline-none" />
                      </div>
                      <button type="submit" className="bg-accent text-bg-deep font-bold uppercase text-[10px] py-2.5 rounded-full cursor-pointer transition-opacity border-none">
                        Enviar Inscrição
                      </button>
                      {formSuccess && (
                        <span className="text-[10px] text-green-400 font-bold uppercase text-center mt-1">✓ Enviado com sucesso!</span>
                      )}
                    </form>
                  )}

                  {/* DATE INPUT */}
                  {activeComponent === 'Date Input' && (
                    <input 
                      type="text" 
                      placeholder="DD/MM/AAAA"
                      className="w-full max-w-[200px] bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-center font-mono text-[13px] text-text-primary outline-none focus:border-accent"
                    />
                  )}

                  {/* CARD */}
                  {activeComponent === 'Card' && (
                    <div className="bg-bg-alt border border-border-card p-6 rounded-[16px] w-full relative backdrop-blur-md">
                      <div className="absolute top-4 left-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />
                      <div className="absolute top-4 right-4 w-3 h-3 text-accent/30 before:content-[''] before:absolute before:top-[5px] before:left-0 before:right-0 before:h-[1px] before:bg-currentColor after:content-[''] after:absolute after:left-[5px] after:top-0 after:bottom-0 after:width-[1px] after:bg-currentColor" />
                      <h4 className="font-rework text-[14px] text-white uppercase tracking-wider scale-y-[0.9] origin-left mb-2">Alexandria-tech Card</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">Layout padrão de container com miras de blueprint.</p>
                    </div>
                  )}

                  {/* AVATAR E USER */}
                  {activeComponent === 'Avatar e User' && (
                    <div className="flex items-center gap-3 w-full bg-black/20 border border-border-subtle p-3 rounded-[12px]">
                      <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-[13px] text-accent flex-shrink-0">
                        LS
                      </div>
                      <div className="flex flex-col flex-1 text-left">
                        <span className="text-[12px] font-semibold text-white">Lucas Silva</span>
                        <span className="text-[10px] text-text-secondary">lucas@example.com</span>
                      </div>
                      <span className="text-[9px] font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full uppercase">PRO</span>
                    </div>
                  )}

                  {/* CHIP E BADGE */}
                  {activeComponent === 'Chip e Badge' && (
                    <div className="flex gap-2 flex-wrap items-center">
                      {/* Badge */}
                      <span className="text-[9px] font-extrabold bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ATIVO
                      </span>
                      {/* Chip (tag style with close) */}
                      <span className="text-[10px] font-medium bg-white/5 border border-border-card text-text-secondary pl-2.5 pr-1.5 py-0.5 rounded-full flex items-center gap-1">
                        Token API
                        <button className="hover:text-red-400 cursor-pointer border-none bg-transparent p-0"><X size={10} /></button>
                      </span>
                    </div>
                  )}

                  {/* CODE E KBD */}
                  {activeComponent === 'Code e Kbd' && (
                    <div className="flex flex-col gap-2 items-center text-center">
                      <code className="bg-black/50 border border-border-subtle px-2.5 py-1 rounded font-mono text-[10px] text-accent">
                        npm run dev
                      </code>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-1">
                        <span>Pressione</span>
                        <kbd className="bg-white/5 border border-border-card px-2 py-0.5 rounded font-mono text-[10px] text-white">⌘</kbd>
                        <span>+</span>
                        <kbd className="bg-white/5 border border-border-card px-2 py-0.5 rounded font-mono text-[10px] text-white">K</kbd>
                      </div>
                    </div>
                  )}

                  {/* TABLE */}
                  {activeComponent === 'Table' && (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-border-subtle text-text-secondary">
                            <th className="py-2">PLANO</th>
                            <th className="py-2 text-right">MENSALIDADE</th>
                          </tr>
                        </thead>
                        <tbody className="text-text-primary">
                          <tr className="border-b border-border-subtle/50">
                            <td className="py-2">Starter</td>
                            <td className="py-2 text-right font-mono text-accent">R$ 49,00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* LISTBOX */}
                  {activeComponent === 'Listbox' && (
                    <div className="bg-black/30 border border-border-card rounded-[12px] p-2 w-full max-w-[200px] flex flex-col gap-1">
                      {[
                        { id: 'starter', label: 'Escribas (Starter)' },
                        { id: 'pro', label: 'Arcontes (Pro)' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedListboxItem(item.id)}
                          className={`text-left py-2 px-3 rounded-[6px] text-[11px] font-semibold border-none cursor-pointer transition-colors ${
                            selectedListboxItem === item.id ? 'bg-accent text-bg-deep' : 'bg-transparent text-text-secondary hover:bg-white/3'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ACCORDION */}
                  {activeComponent === 'Accordion' && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="border border-border-card rounded-[10px] bg-black/20 overflow-hidden">
                        <button 
                          onClick={() => setAccordionOpen(!accordionOpen)}
                          className="w-full text-left p-4 flex justify-between items-center text-[12px] font-bold uppercase text-white hover:text-accent border-none bg-transparent cursor-pointer"
                        >
                          <span>Como integrar com Next.js?</span>
                          <ChevronDown size={14} className={`transform transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {accordionOpen && (
                          <div className="p-4 pt-0 text-[11px] text-text-secondary bg-black/10 border-t border-border-subtle/30">
                            Basta configurar o cabeçalho Authorization Bearer no fetch do lado do servidor.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SKELETON */}
                  {activeComponent === 'Skeleton' && (
                    <div className="w-full flex flex-col gap-3 animate-pulse">
                      <div className="h-4 bg-white/5 rounded-[4px] w-2/3" />
                      <div className="h-10 bg-white/5 rounded-[8px] w-full" />
                    </div>
                  )}

                  {/* DIVIDER E IMAGE */}
                  {activeComponent === 'Divider e Image' && (
                    <div className="w-full flex flex-col gap-4">
                      {/* Image container */}
                      <div className="aspect-[2/1] bg-black/40 border border-border-card rounded-[12px] flex items-center justify-center overflow-hidden">
                        <span className="text-[11px] text-text-muted font-mono uppercase">Image Placeholder</span>
                      </div>
                      {/* Divider */}
                      <div className="relative w-full flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
                        <span className="relative bg-bg-alt px-3 text-[9px] font-bold text-text-muted uppercase tracking-wider">Divisor</span>
                      </div>
                    </div>
                  )}

                  {/* BREADCRUMBS */}
                  {activeComponent === 'Breadcrumbs' && (
                    <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted uppercase">
                      <span className="hover:text-white cursor-pointer">Painel</span>
                      <span>/</span>
                      <span className="text-accent">Assinatura</span>
                    </div>
                  )}

                  {/* LINK */}
                  {activeComponent === 'Link' && (
                    <a 
                      href="#pricing"
                      className="text-[13px] font-semibold text-accent hover:text-accent-light underline transition-colors inline-flex items-center gap-1"
                    >
                      Ir para os Planos
                      <ArrowRight size={14} />
                    </a>
                  )}

                  {/* TABS */}
                  {activeComponent === 'Tabs' && (
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex gap-2 bg-black/40 border border-border-subtle p-1 rounded-[8px]">
                        {['dados', 'api'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-1.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider cursor-pointer border-none ${
                              activeTab === tab ? 'bg-accent text-bg-deep' : 'text-text-secondary'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PAGINATION */}
                  {activeComponent === 'Pagination' && (
                    <div className="flex items-center gap-2 font-mono text-[10px] text-text-secondary">
                      <button className="bg-black/40 border border-border-card py-1 px-3 rounded hover:text-white cursor-pointer">&lt;</button>
                      <span className="px-2">Pág 1 de 5</span>
                      <button className="bg-black/40 border border-border-card py-1 px-3 rounded hover:text-white cursor-pointer">&gt;</button>
                    </div>
                  )}

                  {/* NAVBAR */}
                  {activeComponent === 'Navbar' && (
                    <div className="w-full bg-black/60 border border-border-subtle rounded-[10px] p-3 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold">
                      <span className="text-accent font-rework font-bold">alexandria-tech</span>
                      <div className="flex gap-3 text-text-secondary">
                        <span className="cursor-pointer hover:text-white">API</span>
                        <span className="cursor-pointer hover:text-white">Membros</span>
                      </div>
                    </div>
                  )}

                  {/* DROPDOWN MENU */}
                  {activeComponent === 'Dropdown Menu' && (
                    <div className="relative">
                      <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-accent text-bg-deep text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border-none cursor-pointer flex items-center gap-1"
                      >
                        Menu
                        <ChevronDown size={12} />
                      </button>
                      {dropdownOpen && (
                        <div className="absolute top-12 left-0 bg-bg-alt border border-border-card rounded-[10px] shadow-2xl z-20 flex flex-col p-1.5 w-40 text-left">
                          <button className="text-left py-2 px-3 hover:bg-white/4 rounded-[6px] text-[11px] text-white cursor-pointer border-none bg-transparent">Configurações</button>
                          <button className="text-left py-2 px-3 hover:bg-white/4 rounded-[6px] text-[11px] text-white cursor-pointer border-none bg-transparent">Suporte</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ALERT */}
                  {activeComponent === 'Alert' && (
                    <div className="bg-accent/10 border border-accent/30 p-4 rounded-[12px] flex gap-3 text-left w-full">
                      <AlertTriangle className="text-accent flex-shrink-0" size={18} />
                      <div>
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider block">Aviso</span>
                        <span className="text-[10px] text-text-secondary mt-0.5 block leading-relaxed">
                          Serviço do Claude passará por manutenção rápida hoje às 04:00.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* PROGRESS */}
                  {activeComponent === 'Progress' && (
                    <div className="w-full flex flex-col gap-1.5">
                      <div className="flex justify-between font-mono text-[10px] text-text-secondary uppercase">
                        <span>Processamento</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full rounded-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                  )}

                  {/* SPINNER */}
                  {activeComponent === 'Spinner' && (
                    <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                  )}

                  {/* TOOLTIP */}
                  {activeComponent === 'Tooltip' && (
                    <div className="bg-black/90 border border-accent/20 px-3.5 py-2 rounded-[6px] text-[10px] text-accent font-mono uppercase tracking-wider shadow-lg">
                      Copiar Token
                    </div>
                  )}

                  {/* POPOVER */}
                  {activeComponent === 'Popover' && (
                    <div className="bg-bg-alt border border-border-card p-4 rounded-[12px] shadow-2xl relative w-full max-w-[280px]">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">Dica</span>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Reduza payloads usando compactação.
                      </p>
                    </div>
                  )}

                  {/* TOAST */}
                  {activeComponent === 'Toast' && (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                        className="bg-accent text-bg-deep text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border-none cursor-pointer"
                      >
                        Disparar Toast
                      </button>
                      {showToast && (
                        <div className="bg-[#22c55e] text-bg-deep p-4 rounded-[12px] font-bold text-[12px] uppercase shadow-lg flex items-center gap-2">
                          <CheckCircle size={15} />
                          Salvo com sucesso!
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODAL */}
                  {activeComponent === 'Modal' && (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setShowDialog(true)}
                        className="bg-accent text-bg-deep text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border-none cursor-pointer"
                      >
                        Abrir Modal
                      </button>
                      {showDialog && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                          <div className="bg-bg-alt border border-border-card p-6 rounded-[16px] max-w-[380px] w-full text-center relative shadow-2xl animate-[connection-flow_0.2s_linear]">
                            <span className="text-[12px] font-bold text-white uppercase block mb-2">Painel de Acesso</span>
                            <p className="text-[12px] text-text-secondary mb-5">Deseja liberar a chave SSH para este servidor?</p>
                            <div className="flex gap-2 justify-center">
                              <button onClick={() => setShowDialog(false)} className="bg-transparent border border-border-card hover:bg-white/5 text-[11px] font-bold uppercase py-2 px-4 rounded-full text-white cursor-pointer">
                                Cancelar
                              </button>
                              <button onClick={() => setShowDialog(false)} className="bg-accent text-bg-deep text-[11px] font-bold uppercase py-2 px-4 rounded-full cursor-pointer">
                                Confirmar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DRAWER */}
                  {activeComponent === 'Drawer' && (
                    <div className="bg-bg-alt border border-border-card border-b-none p-5 rounded-t-[16px] w-full max-w-sm shadow-2xl relative mt-12 text-center">
                      <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4" />
                      <span className="text-[12px] font-bold text-white uppercase block">Console</span>
                      <p className="text-[11px] text-text-secondary mt-1 mb-3">Sessão expira em 29 dias.</p>
                      <button className="bg-accent text-bg-deep text-[10px] font-bold uppercase py-2 px-4 rounded-full border-none">Ok</button>
                    </div>
                  )}

                  {/* CALENDAR */}
                  {activeComponent === 'Calendar' && (
                    <div className="bg-black/30 border border-border-subtle p-4 rounded-[12px] w-full max-w-[260px] text-center">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider block mb-3">Junho 2026</span>
                      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-text-muted">
                        <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                        {[...Array(30)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`p-1 w-6 h-6 rounded flex items-center justify-center ${i === 19 ? 'bg-accent text-bg-deep font-bold' : 'text-text-secondary'}`}
                          >
                            {i + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Dynamic Component Code Block */}
              <div className="bg-black border border-border-card rounded-[16px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <span className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-3 flex items-center gap-2 border-b border-border-subtle pb-2">
                  <Terminal size={12} className="text-accent" />
                  <span>Código de Exemplo do Componente</span>
                </span>
                
                <pre className="bg-black/60 border border-border-subtle p-5 rounded-[12px] text-[11px] text-accent overflow-x-auto font-mono leading-relaxed select-all">
                  {activeComponent === 'Cores' && (
`<div className="h-10 rounded-[6px]" style={{ backgroundColor: '#D4AF5A' }} />`
                  )}
                  {activeComponent === 'Tipografia' && (
`<span className="font-rework text-[24px] font-bold text-white tracking-widest uppercase scale-y-[0.85]">
  MARCELLUS SERIF
</span>`
                  )}
                  {activeComponent === 'Raio e Espaco' && (
`<div className="rounded-[16px] p-6 bg-black/40 border border-border-card">
  Conteúdo com espaçamento e raios definidos
</div>`
                  )}
                  {activeComponent === 'Elevacao' && (
`<div className="bg-bg-alt rounded-[12px] shadow-[0_0_20px_rgba(212,175,90,0.12)]">
  Elevação com Glow Dourado
</div>`
                  )}
                  {activeComponent === 'Button' && (
`<button className="bg-accent hover:opacity-90 text-bg-deep text-[11px] font-bold uppercase tracking-wider py-3 px-6 rounded-full border-none">
  Botão Primário
</button>`
                  )}
                  {activeComponent === 'Button Group' && (
`<div className="inline-flex rounded-full overflow-hidden border border-border-card">
  <button className="bg-accent/15 text-accent hover:bg-accent/25 py-2.5 px-5">Starter</button>
  <button className="bg-accent/15 text-accent hover:bg-accent/25 py-2.5 px-5">Pro</button>
</div>`
                  )}
                  {activeComponent === 'Input' && (
`<input 
  type="text" 
  placeholder="Nome do assinante..."
  className="w-full bg-black/40 border border-border-card rounded-[10px] py-3.5 px-4 text-[13px] outline-none"
/>`
                  )}
                  {activeComponent === 'Number Input' && (
`<div className="flex items-center bg-black/40 border rounded-[10px]">
  <button className="p-3.5">-</button>
  <input type="text" value={1} readOnly className="text-center font-mono w-12" />
  <button className="p-3.5">+</button>
</div>`
                  )}
                  {activeComponent === 'Textarea' && (
`<textarea className="w-full bg-black/40 border border-border-card rounded-[10px] py-3 px-4 text-[13px] outline-none" />`
                  )}
                  {activeComponent === 'Input OTP' && (
`<div className="flex gap-2 justify-center">
  <input type="text" maxLength={1} className="w-10 h-10 bg-black/40 border rounded-[8px] text-center font-mono" />
</div>`
                  )}
                  {activeComponent === 'Checkbox' && (
`<label className="flex items-center gap-3 cursor-pointer select-none">
  <div className="w-5 h-5 rounded-[4px] border border-accent bg-accent text-bg-deep flex items-center justify-center">
    <Check size={14} strokeWidth={3} />
  </div>
  <span className="text-[13px] text-text-secondary">Aceitar regulamento</span>
</label>`
                  )}
                  {activeComponent === 'Radio Group' && (
`<label className="flex items-center gap-3 cursor-pointer">
  <div className="w-4 h-4 rounded-full border border-accent flex items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-accent" />
  </div>
  <span className="text-[12px] text-text-secondary">Pro (R$ 149)</span>
</label>`
                  )}
                  {activeComponent === 'Switch' && (
`<button className="relative w-12 h-6 rounded-full bg-accent">
  <span className="absolute top-1.5 w-3 h-3 rounded-full bg-bg-deep right-2" />
</button>`
                  )}
                  {activeComponent === 'Select' && (
`<select className="w-full bg-black/40 border border-border-card rounded-[10px] py-3.5 px-4 text-[13px]">
  <option>Conselho dos Arcontes (Pro)</option>
</select>`
                  )}
                  {activeComponent === 'Autocomplete' && (
`<div className="relative">
  <input type="text" placeholder="Pesquisar..." className="w-full bg-black/40 border rounded-[10px] px-3 py-1.5" />
</div>`
                  )}
                  {activeComponent === 'Slider' && (
`<input type="range" className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none" />`
                  )}
                  {activeComponent === 'Form completo' && (
`<form className="bg-black/20 border p-5 rounded-[16px] flex flex-col gap-4">
  <input type="text" placeholder="Nome Completo" className="bg-black/40 border rounded-[8px] py-2 px-3 text-[12px]" />
  <button type="submit" className="bg-accent text-bg-deep font-bold py-2.5 rounded-full">Enviar</button>
</form>`
                  )}
                  {activeComponent === 'Date Input' && (
`<input type="text" placeholder="DD/MM/AAAA" className="w-full max-w-[200px] bg-black/40 border rounded-[10px] py-3 px-4 font-mono" />`
                  )}
                  {activeComponent === 'Card' && (
`<div className="bg-bg-alt border border-border-card p-6 rounded-[16px] relative">
  <div className="absolute top-4 left-4 w-3 h-3 text-accent/30" />
  <h4>Card content</h4>
</div>`
                  )}
                  {activeComponent === 'Avatar e User' && (
`<div className="flex items-center gap-3 bg-black/20 border p-3 rounded-[12px]">
  <div className="w-10 h-10 rounded-full bg-accent/20 border flex items-center justify-center font-bold text-accent">LS</div>
  <div className="flex flex-col"><span className="text-[12px] text-white">Lucas Silva</span></div>
</div>`
                  )}
                  {activeComponent === 'Chip e Badge' && (
`<div className="flex gap-2 items-center">
  <span className="text-[9px] font-extrabold bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] px-2.5 py-0.5 rounded-full uppercase">ATIVO</span>
</div>`
                  )}
                  {activeComponent === 'Code e Kbd' && (
`<code className="bg-black/50 border px-2.5 py-1 rounded font-mono text-[10px] text-accent">npm run dev</code>`
                  )}
                  {activeComponent === 'Table' && (
`<table className="w-full text-left border-collapse text-[11px]">
  <tr className="border-b"><td className="py-2">Starter</td></tr>
</table>`
                  )}
                  {activeComponent === 'Listbox' && (
`<div className="bg-black/30 border rounded-[12px] p-2 flex flex-col gap-1">
  <button className="text-left py-2 px-3 rounded-[6px] text-[11px] bg-accent text-bg-deep">Arcontes</button>
</div>`
                  )}
                  {activeComponent === 'Accordion' && (
`<div className="border border-border-card rounded-[10px] bg-black/20 overflow-hidden">
  <button className="w-full text-left p-4">Como integrar?</button>
</div>`
                  )}
                  {activeComponent === 'Skeleton' && (
`<div className="w-full flex flex-col gap-3 animate-pulse">
  <div className="h-4 bg-white/5 rounded-[4px] w-2/3" />
</div>`
                  )}
                  {activeComponent === 'Divider e Image' && (
`<div className="relative w-full flex items-center justify-center">
  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
  <span className="relative bg-bg-alt px-3 text-[9px] font-bold text-text-muted uppercase">Divisor</span>
</div>`
                  )}
                  {activeComponent === 'Breadcrumbs' && (
`<div className="flex items-center gap-2 font-mono text-[10px] text-text-muted uppercase">
  <span>Painel</span><span>/</span><span className="text-accent">Assinatura</span>
</div>`
                  )}
                  {activeComponent === 'Link' && (
`<a href="#pricing" className="text-[13px] font-semibold text-accent hover:text-accent-light underline transition-colors inline-flex items-center gap-1">
  Ir para os Planos <ArrowRight size={14} />
</a>`
                  )}
                  {activeComponent === 'Tabs' && (
`<div className="flex gap-2 bg-black/40 border border-border-subtle p-1 rounded-[8px]">
  <button className="flex-1 py-1.5 rounded-[6px]">Dados</button>
</div>`
                  )}
                  {activeComponent === 'Pagination' && (
`<div className="flex items-center gap-2 font-mono text-[10px] text-text-secondary">
  <button className="bg-black/40 border border-border-card py-1 px-3 rounded">&lt;</button>
</div>`
                  )}
                  {activeComponent === 'Navbar' && (
`<div className="w-full bg-black/60 border border-border-subtle rounded-[10px] p-3 flex items-center justify-between text-[11px] uppercase">
  <span className="text-accent font-rework font-bold">alexandria-tech</span>
</div>`
                  )}
                  {activeComponent === 'Dropdown Menu' && (
`<div className="relative">
  <button className="bg-accent text-bg-deep text-[11px] font-bold uppercase py-2.5 px-5 rounded-full flex items-center gap-1">
    Menu <ChevronDown size={12} />
  </button>
</div>`
                  )}
                  {activeComponent === 'Alert' && (
`<div className="bg-accent/10 border border-accent/30 p-4 rounded-[12px] flex gap-3 text-left">
  <AlertTriangle className="text-accent" size={18} />
  <div><span className="text-[11px] font-bold text-white uppercase">Aviso</span></div>
</div>`
                  )}
                  {activeComponent === 'Progress' && (
`<div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
  <div className="bg-accent h-full rounded-full" style={{ width: '70%' }} />
</div>`
                  )}
                  {activeComponent === 'Spinner' && (
`<div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />`
                  )}
                  {activeComponent === 'Tooltip' && (
`<div className="bg-black/90 border border-accent/20 px-3.5 py-2 rounded-[6px] text-[10px] text-accent font-mono uppercase">
  Copiar
</div>`
                  )}
                  {activeComponent === 'Popover' && (
`<div className="bg-bg-alt border border-border-card p-4 rounded-[12px] shadow-2xl">
  <p className="text-[11px] text-text-secondary">Dica da API</p>
</div>`
                  )}
                  {activeComponent === 'Toast' && (
`<div className="bg-[#22c55e] text-bg-deep p-4 rounded-[12px] font-bold text-[12px] uppercase">
  Salvo com sucesso!
</div>`
                  )}
                  {activeComponent === 'Modal' && (
`<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-bg-alt border border-border-card p-6 rounded-[16px] max-w-[380px] w-full text-center relative shadow-2xl">
    <span className="text-[12px] font-bold text-white uppercase block mb-2">Acesso</span>
  </div>
</div>`
                  )}
                  {activeComponent === 'Drawer' && (
`<div className="bg-bg-alt border border-border-card border-b-none p-5 rounded-t-[16px] w-full max-w-sm shadow-2xl">
  <span className="text-[12px] font-bold text-white uppercase block">Console</span>
</div>`
                  )}
                  {activeComponent === 'Calendar' && (
`<div className="bg-black/30 border border-border-subtle p-4 rounded-[12px] w-full max-w-[260px] text-center">
  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-text-muted">...</div>
</div>`
                  )}
                </pre>
              </div>

            </div>

          </div>

          {/* 5. Mockup do Branding Book */}
          <section className="flex flex-col gap-6 mt-12">
            <h2 className="text-[15px] font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-border-subtle pb-3">
              <ImageIcon className="text-accent" size={16} />
              <span>Branding Book - Mockup do Sistema</span>
            </h2>

            <div className="bg-bg-alt border border-border-card rounded-[16px] overflow-hidden p-4 relative flex items-center justify-center min-h-[300px] backdrop-blur-md">
              <img 
                src="/branding_book_mockup.png" 
                alt="Branding Book alexandria-tech"
                className="rounded-[12px] max-w-full max-h-[500px] object-contain shadow-2xl border border-white/5"
              />
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
