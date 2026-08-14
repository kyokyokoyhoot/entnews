import React from 'react';
import { EntertainmentNewsTopic } from '../types';
import { Flame, Film, Music, Tv, Drama, DollarSign, Bookmark, ArrowUpRight, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TopicCardProps {
  topic: EntertainmentNewsTopic;
  onSelectTopic: (topic: EntertainmentNewsTopic) => void;
  onOpenDraftModal: (topic: EntertainmentNewsTopic) => void;
  onToggleBookmark: (topic: EntertainmentNewsTopic) => void;
  isBookmarked: boolean;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onSelectTopic,
  onOpenDraftModal,
  onToggleBookmark,
  isBookmarked,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '영화/배급': return <Film className="w-4 h-4 text-rose-400" />;
      case '음악/K-Pop': return <Music className="w-4 h-4 text-indigo-400" />;
      case '드라마/OTT': return <Tv className="w-4 h-4 text-sky-400" />;
      case '공연/뮤지컬': return <Drama className="w-4 h-4 text-emerald-400" />;
      case '제작/투자': return <DollarSign className="w-4 h-4 text-amber-300" />;
      default: return <Film className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '단독확인':
        return <span className="bg-rose-950/80 text-rose-400 border border-rose-800/80 text-[11px] font-bold px-2 py-0.5 rounded">⚡ 단독확인</span>;
      case '기사작성중':
        return <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[11px] font-bold px-2 py-0.5 rounded">✍️ 기사작성중</span>;
      case '보도완료':
        return <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[11px] font-bold px-2 py-0.5 rounded">✓ 보도완료</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium px-2 py-0.5 rounded">📋 취재대기</span>;
    }
  };

  const getRankBadgeStyle = (rank?: number) => {
    if (!rank) return null;
    if (rank === 1) return 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20';
    if (rank === 2) return 'bg-slate-300 text-slate-950 font-black shadow-md';
    if (rank === 3) return 'bg-amber-700 text-amber-100 font-bold';
    return 'bg-slate-800 text-slate-300 font-bold border border-slate-700';
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between relative">
      <div>
        
        {/* Top Header: Rank / Category / Status / Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            {topic.rank && (
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${getRankBadgeStyle(topic.rank)}`}>
                #{topic.rank}
              </span>
            )}
            <span className="bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
              {getCategoryIcon(topic.category)}
              <span>{topic.category}</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              | {topic.coverageVolume}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusBadge(topic.status)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(topic);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-300'
              }`}
              title={isBookmarked ? '취재 수첩에서 제거' : '취재 수첩에 담기'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectTopic(topic)}
          className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {topic.title}
        </h3>

        {/* Practical Industry Figures Highlight Box */}
        <div className="mt-3 bg-slate-950/70 border border-slate-800/90 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium shrink-0">실무·투자:</span>
            <span className="text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
              {topic.investmentOrScale}
            </span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            배급/기획: <span className="text-slate-200">{topic.productionCompany}</span>
          </div>
        </div>

        {/* Key Entities / Cast Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">주요 라인업:</span>
          {topic.mainEntities.map((entity, idx) => (
            <span
              key={idx}
              className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-700/60"
            >
              {entity}
            </span>
          ))}
        </div>

        {/* Summary Snippet */}
        <p className="text-xs sm:text-sm text-slate-300 mt-3 line-clamp-2 leading-relaxed">
          {topic.summary}
        </p>

      </div>

      {/* Footer Actions & Reporter Note Callout */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" /> {topic.publishedDate}
          </span>
          <span className="text-slate-400">• 화제지수 <strong className="text-amber-400">{topic.impactScore}점</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDraftModal(topic)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>기사 작성</span>
          </button>

          <button
            onClick={() => onSelectTopic(topic)}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>취재 팩트</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
