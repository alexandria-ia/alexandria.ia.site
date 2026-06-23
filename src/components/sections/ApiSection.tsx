'use client';

import React, { useState } from 'react';

const PYTHON_CODE = `import requests

url = "https://api.alexandria.ia/v1/chat/completions"
headers = {
    "Authorization": "Bearer $ALEXANDRIA_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "llama-3.1-70b-swarm",
    "messages": [{"role": "user", "content": "Analise o contrato..."}]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

const CURL_CODE = `curl -X POST https://api.alexandria.ia/v1/chat/completions \\
  -H "Authorization: Bearer $ALEXANDRIA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-70b-swarm",
    "messages": [{"role": "user", "content": "Analise o contrato..."}]
  }'`;

export default function ApiSection() {
  const [activeTab, setActiveTab] = useState<'python' | 'curl'>('python');

  return (
    <section id="api-sec" className="py-20 px-6 md:px-12 bg-bg-alt border-b border-border-subtle relative z-10">
      <div className="bp-cross bp-cross-tl" />
      <div className="bp-cross bp-cross-tr" />
      <div className="bp-cross bp-cross-bl" />
      <div className="bp-cross bp-cross-br" />

      <div className="max-w-[1040px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
            <span className="w-6 h-[1px] bg-accent-dark" />
            API de Integração
          </div>
          
          <h2 className="font-rework text-[clamp(26px,3.8vw,44px)] font-normal leading-[1.1] tracking-[0.05em] uppercase text-white scale-y-[0.85] origin-left mb-3">
            Para desenvolvedores e<br />
            <span className="text-accent">sistemas legados.</span>
          </h2>
          
          <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
            Conecte seus sistemas diretamente com a nossa infraestrutura. Crie chaves de API instantâneas, envie payloads de arquivos e obtenha respostas estruturadas em formato aberto JSON em milissegundos.
          </p>

          <div className="flex items-center gap-3 p-4 bg-bg-deep border border-border-card rounded-lg relative">
            <div className="absolute top-2.5 left-2.5 w-[8px] h-[8px] border-t border-l border-accent/20" />
            
            <div className="w-2.5 h-2.5 rounded-full bg-[#5dcaa5] animate-pulse flex-shrink-0" />
            <span className="text-[13px] text-text-secondary">
              <strong className="text-white">3 de 10</strong> vagas de desenvolvedor restantes
            </span>
            <div className="ml-auto text-[16px] font-extrabold text-accent-light tracking-tight">
              R$ 220,00<span className="text-[11px] font-normal text-text-secondary">/mês</span>
            </div>
          </div>
        </div>

        {/* Code Box */}
        <div className="bg-bg-deep border border-border-card rounded-xl overflow-hidden shadow-2xl relative">
          {/* Blueprint corner marks */}
          <div className="absolute top-2.5 left-2.5 w-[10px] h-[10px] border-t border-l border-accent/20" />
          <div className="absolute bottom-2.5 right-2.5 w-[10px] h-[10px] border-b border-r border-accent/20" />

          {/* Header Tabs */}
          <div className="flex items-center border-b border-border-subtle bg-bg-alt px-4 py-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1 text-[10px] font-mono rounded uppercase tracking-wider transition-all ${
                  activeTab === 'python' ? 'bg-accent/15 text-accent border border-accent/20' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveTab('curl')}
                className={`px-3 py-1 text-[10px] font-mono rounded uppercase tracking-wider transition-all ${
                  activeTab === 'curl' ? 'bg-accent/15 text-accent border border-accent/20' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                cURL
              </button>
            </div>
            <span className="text-[9px] font-mono text-text-muted">
              POST /v1/chat/completions
            </span>
          </div>

          {/* Code Area */}
          <div className="p-5 overflow-auto max-h-[300px]">
            <pre className="font-mono text-[11.5px] leading-relaxed text-accent-light selection:bg-accent-soft selection:text-white">
              <code>{activeTab === 'python' ? PYTHON_CODE : CURL_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
