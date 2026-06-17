'use client';

import React from 'react';
import { DbEntry } from '@/data/database-entries';

interface FileExplorerProps {
  files: DbEntry[];
  selectedFileId: string;
  onSelectFile: (file: DbEntry) => void;
}

export default function FileExplorer({ files, selectedFileId, onSelectFile }: FileExplorerProps) {
  return (
    <div className="flex flex-col gap-4 border border-border-card bg-[rgba(14,14,16,0.3)] backdrop-blur-[20px] rounded-[16px] p-5 md:p-6">
      <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent mb-1 lg:mb-2">
        // Arquivos Disponíveis
      </div>
      <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
        {files.map((file) => {
          const isSelected = file.id === selectedFileId;
          return (
            <button
              key={file.id}
              onClick={() => onSelectFile(file)}
              className={`w-full text-left px-4 py-3 text-[12px] font-mono rounded-[6px] border transition-all duration-200 cursor-pointer outline-none ${
                isSelected
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent bg-white/2 text-text-secondary hover:text-text-primary hover:bg-white/4'
              }`}
            >
              {file.filename}
            </button>
          );
        })}
      </div>
    </div>
  );
}
