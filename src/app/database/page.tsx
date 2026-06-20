'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/canvas/ParticleCanvas';
import CursorGlow from '@/components/canvas/CursorGlow';
import CategorySidebar from '@/components/database/CategorySidebar';
import FileExplorer from '@/components/database/FileExplorer';
import TelemetryPanel from '@/components/database/TelemetryPanel';
import CodeViewer from '@/components/database/CodeViewer';
import ApiSnippets from '@/components/database/ApiSnippets';
import { databaseCategories, Category, DbEntry } from '@/data/database-entries';

export default function DatabasePage() {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('general');
  
  // Find currently selected category details
  const selectedCategory = databaseCategories.find(c => c.key === selectedCategoryKey) || databaseCategories[0];
  
  // Select first file of the category as default active file
  const [selectedFileId, setSelectedFileId] = useState(selectedCategory.files[0]?.id || '');

  // Reset selected file when category changes
  const handleSelectCategory = (categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    const cat = databaseCategories.find(c => c.key === categoryKey) || databaseCategories[0];
    if (cat.files.length > 0) {
      setSelectedFileId(cat.files[0].id);
    } else {
      setSelectedFileId('');
    }
  };

  const activeFile = selectedCategory.files.find(f => f.id === selectedFileId) || selectedCategory.files[0];

  return (
    <>
      {/* Background Decorators */}
      <ParticleCanvas />
      <CursorGlow />

      {/* Main layout */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto mt-16 p-6 md:p-12 flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Sidebar Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
          <CategorySidebar
            selectedCategoryKey={selectedCategoryKey}
            onSelectCategory={handleSelectCategory}
          />
          <FileExplorer
            files={selectedCategory.files}
            selectedFileId={selectedFileId}
            onSelectFile={(file) => setSelectedFileId(file.id)}
          />
        </div>

        {/* Main Panel Column */}
        <div className="flex-1 flex flex-col gap-8">
          <TelemetryPanel />
          
          {activeFile && (
            <>
              <CodeViewer
                filename={activeFile.filename}
                meta={activeFile.meta}
                content={activeFile.content}
              />
              <ApiSnippets filename={activeFile.filename} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
