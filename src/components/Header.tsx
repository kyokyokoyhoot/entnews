import React from 'react';
import { Newspaper, Search, Sparkles, BookmarkCheck, Flame, Radio, TrendingUp, Filter } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenGeminiRadar: () => void;
  onOpenNotebook: () => void;
  onOpenDraftAssistant: () => void;
  notebookCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenGeminiRadar,
  onOpenNotebook,
  onOpenDraftAssistant,
  notebookCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Reporter Desk Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-rose-600 to-red-700 flex items-center justify-center shadow-lg shadow-rose-950/40 border border-amber-400/30">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-950/80 text-red-400 text-xs font-bold px-2 py-0.5 rounded border border-red-800/60 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse text-red-500" /> 연예부 데스크
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  2026.08.12 (수) 실시
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                K-Ent Reporter Desk
                <span className="text-xs font-normal text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/40">
                  실무·화제 중심
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Search & AI Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="스타, 제작사, BEP, 이슈 검색..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Gemini Live Radar Button */}
            <button
              onClick={onOpenGeminiRadar}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-950/50 border border-indigo-400/30 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AI 취재 Radar</span>
            </button>

            {/* Article Draft Helper */}
            <button
              onClick={onOpenDraftAssistant}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <span>✍️ 기사 작성</span>
            </button>

            {/* Story Notebook Button */}
            <button
              onClick={onOpenNotebook}
              className="relative bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>취재 수첩</span>
              {notebookCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                  {notebookCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
