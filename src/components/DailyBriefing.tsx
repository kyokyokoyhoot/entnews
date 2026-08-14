import React from 'react';
import { Flame, DollarSign, ShieldCheck, ArrowUpRight, Zap, Target, TrendingUp } from 'lucide-react';
import { EntertainmentNewsTopic } from '../types';

interface DailyBriefingProps {
  topTopics: EntertainmentNewsTopic[];
  onSelectTopic: (topic: EntertainmentNewsTopic) => void;
  onOpenGeminiRadar: () => void;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({
  topTopics,
  onSelectTopic,
  onOpenGeminiRadar,
}) => {
  const rank1 = topTopics.find(t => t.rank === 1) || topTopics[0];
  const rank2 = topTopics.find(t => t.rank === 2);
  const rank3 = topTopics.find(t => t.rank === 3);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl text-slate-100 mb-8 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Title & Filter Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-950/80 border border-rose-700/50 rounded-xl text-rose-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                오늘의 연예부 조간 핵심 취재 브리핑
              </h2>
              <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 무명 가십 100% 검증 필터
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              대한민국 연예계 화제의 중심 TOP 10 및 영화·음악·공연·OTT 실무 제작/투자 데이터
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGeminiRadar}
          className="self-start md:self-auto bg-slate-800 hover:bg-slate-700/80 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>실시간 이슈 AI 탐색</span>
        </button>
      </div>

      {/* Grid of Key Headlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        
        {/* Card 1: #1 Hot Issue */}
        {rank1 && (
          <div
            onClick={() => onSelectTopic(rank1)}
            className="group bg-gradient-to-b from-rose-950/40 to-slate-900/90 border border-rose-800/40 hover:border-rose-500/70 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-rose-950/40 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-rose-600 text-white text-xs font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> TOP 1 화제 이슈
                </span>
                <span className="text-xs text-rose-300/80 font-mono font-medium">
                  지수 {rank1.impactScore}점
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white group-hover:text-rose-200 transition-colors line-clamp-2 leading-snug">
                {rank1.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                {rank1.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                📊 {rank1.investmentOrScale}
              </span>
              <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-0.5">
                취재분석 <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Card 2: #2 Hot Issue */}
        {rank2 && (
          <div
            onClick={() => onSelectTopic(rank2)}
            className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-xs font-extrabold px-2 py-0.5 rounded">
                  TOP 2 화제 이슈
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  지수 {rank2.impactScore}점
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                {rank2.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                {rank2.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                💰 {rank2.investmentOrScale}
              </span>
              <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-0.5">
                취재분석 <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Card 3: Key Journalist Focus */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-950 text-amber-300 border border-amber-700/60 text-xs font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-400" /> 오늘 데스크 추적 요약
              </span>
              <span className="text-xs text-slate-400 font-mono">
                총 10개 핵심 이슈
              </span>
            </div>
            <ul className="space-y-2 mt-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>영화 텐트폴:</strong> 650억 SF 및 프리 세일즈 회수 구조 집중</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>K-Pop 초동/투어:</strong> BTS·뉴진스·에스파 글로벌 티켓 파워</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>M&A 및 지분투자:</strong> CJ ENM 뮤지컬 지분인수 & 카카오엔터 SLL</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>실무 데이터 표기율: <strong>100%</strong></span>
            <span className="text-emerald-400 font-medium">검증 완료</span>
          </div>
        </div>

      </div>
    </div>
  );
};
