'use client';

import React, { useState } from 'react';

interface ApiSnippetsProps {
  filename: string;
}

export default function ApiSnippets({ filename }: ApiSnippetsProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'js'>('curl');
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST "https://api.alexandria.ia/v1/chat/completions" \\
  -H "Authorization: Bearer $ALEXANDRIA_API_KEY" \\
  -d '{
    "model": "alexandria-pro-v2",
    "anchors": ["${filename}"]
  }'`,
    python: `import requests

url = "https://api.alexandria.ia/v1/chat/completions"
headers = {"Authorization": "Bearer $ALEXANDRIA_API_KEY"}
payload = {
    "model": "alexandria-pro-v2",
    "anchors": ["${filename}"]
}
response = requests.post(url, json=payload, headers=headers)`,
    js: `fetch("https://api.alexandria.ia/v1/chat/completions", {
  method: "POST",
  headers: { "Authorization": "Bearer $ALEXANDRIA_API_KEY" },
  body: JSON.stringify({
    model: "alexandria-pro-v2",
    anchors: ["${filename}"]
  })
});`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel-card border border-border-card bg-[rgba(14,14,16,0.3)] backdrop-blur-[20px] rounded-[16px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[10px] before:h-[10px] before:border-t-2 before:border-l-2 before:border-accent/40 hover:before:border-accent before:transition-all after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[10px] after:h-[10px] after:border-b-2 after:border-r-2 after:border-accent/40 hover:after:border-accent after:transition-all hover:border-[rgba(201,165,90,0.3)]">
      <div className="flex border-b border-border-subtle mb-4 gap-1">
        {(['curl', 'python', 'js'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] border-b-2 transition-all duration-200 cursor-pointer outline-none ${
              activeTab === lang
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {lang === 'js' ? 'JavaScript' : lang === 'curl' ? 'cURL' : 'Python'}
          </button>
        ))}
      </div>

      <div className="relative group">
        <pre className="code-block bg-black/40 border border-border-subtle p-5 rounded-[8px] overflow-x-auto text-[12px] font-mono text-text-secondary leading-relaxed max-h-[200px]">
          <code>{snippets[activeTab]}</code>
        </pre>
        
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.06em] uppercase bg-accent text-[#0e0e10] border-none px-4 py-2 rounded-full cursor-pointer hover:opacity-85 transition-opacity shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
