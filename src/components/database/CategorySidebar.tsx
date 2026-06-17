'use client';

import React from 'react';
import { databaseCategories } from '@/data/database-entries';
import { 
  Globe, Scale, HeartPulse, Code, DollarSign, BookOpen, 
  Megaphone, Database, Palette, Truck, Shield, Users,
  Sprout, Rocket, Brain, Headphones, Gamepad2, ShoppingBag,
  LucideIcon
} from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  Globe, Scale, HeartPulse, Code, DollarSign, BookOpen, 
  Megaphone, Database, Palette, Truck, Shield, Users,
  Sprout, Rocket, Brain, Headphones, Gamepad2, ShoppingBag
};

interface CategorySidebarProps {
  selectedCategoryKey: string;
  onSelectCategory: (categoryKey: string) => void;
}

export default function CategorySidebar({ selectedCategoryKey, onSelectCategory }: CategorySidebarProps) {
  return (
    <div className="flex flex-col gap-4 border border-border-card bg-[rgba(14,14,16,0.3)] backdrop-blur-[20px] rounded-[16px] p-5 md:p-6 h-auto lg:h-full lg:min-h-[400px]">
      <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent mb-1 lg:mb-2">
        // Categorias de Atuação
      </div>
      <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto max-h-none lg:max-h-[500px] pb-2 lg:pb-0 scrollbar-thin">
        {databaseCategories.map((cat) => {
          const IconComponent = categoryIcons[cat.iconName] || Globe;
          const isSelected = cat.key === selectedCategoryKey;

          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`flex items-center gap-2.5 flex-shrink-0 lg:w-full text-left px-3.5 py-2.5 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.04em] rounded-[6px] border transition-all duration-200 cursor-pointer outline-none whitespace-nowrap ${
                isSelected
                  ? 'border-accent bg-accent/10 text-accent font-bold shadow-[0_0_15px_rgba(212,175,90,0.08)]'
                  : 'border-transparent bg-white/2 text-text-secondary hover:text-text-primary hover:bg-white/4'
              }`}
            >
              <IconComponent size={14} className="flex-shrink-0" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
