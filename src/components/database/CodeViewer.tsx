'use client';

import React from 'react';

interface CodeViewerProps {
  filename: string;
  meta: string;
  content: string;
}

export default function CodeViewer({ filename, meta, content }: CodeViewerProps) {
  return (
    <div className="panel-card border border-border-card bg-[rgba(14,14,16,0.3)] backdrop-blur-[20px] rounded-[16px] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 relative before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:w-[10px] before:h-[10px] before:border-t-2 before:border-l-2 before:border-accent/40 hover:before:border-accent before:transition-all after:content-[''] after:absolute after:-bottom-[1px] after:-right-[1px] after:w-[10px] after:h-[10px] after:border-b-2 after:border-r-2 after:border-accent/40 hover:after:border-accent after:transition-all hover:border-[rgba(201,165,90,0.3)]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-subtle text-[10px] font-semibold tracking-[0.18em] uppercase">
        <span className="text-white font-mono">{filename}</span>
        <span className="text-text-muted font-mono">{meta}</span>
      </div>

      <div className="panel-body">
        <pre className="code-block bg-black/40 border border-border-subtle p-5 rounded-[8px] overflow-x-auto text-[12px] font-mono text-accent leading-relaxed max-h-[300px]">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}
