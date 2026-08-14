import React from 'react';
import { CategoryType, StatusType } from '../types';
import { Flame, Film, Music, Tv, Drama, DollarSign, Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  topicCounts: { [key: string]: number };
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  topicCounts,
}) => {
  const categories = [
    { id: '🔥 TOP 화제 순위', name: 'TOP 화제 순위', icon: Flame, color: 'text-amber-400' },
    { id: '전체', name: '전체 이슈', icon: Layers, color: 'text-slate-300' },
    { id: '영화/배급', name: '영화/배급', icon: Film, color: 'text-rose-400' },
    { id: '음악/K-Pop', name: '음악/K-Pop', icon: Music, color: 'text-indigo-400' },
    { id: '드라마/OTT', name: '드라마/OTT', icon: Tv, color: 'text-sky-400' },
    { id: '공연/뮤지컬', name: '공연/뮤지컬', icon: Drama, color: 'text-emerald-400' },
    { id: '제작/투자', name: '제작/투자/M&A', icon: DollarSign, color: 'text-amber-300' },
  ];

  const statuses: { id: string; label: string }[] = [
    { id: '전체', label: '전체 상태' },
    { id: '취재대기', label: '취재대기' },
    { id: '기사작성중', label: '기사작성중' },
    { id: '단독확인', label: '단독확인' },
    { id: '보도완료', label: '보도완료' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-6 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = topicCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700 ring-1 ring-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Filter Selector */}
        <div className="flex items-center space-x-2 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800 text-xs">
          <span className="text-slate-400 font-medium shrink-0">취재 상태:</span>
          <div className="flex items-center space-x-1 overflow-x-auto">
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => onSelectStatus(st.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-slate-800 text-amber-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
