import React, { useState } from 'react';
import { EntertainmentNewsTopic, StatusType } from '../types';
import { X, CheckCircle2, Bookmark, FileText, Send, Building, DollarSign, AlertTriangle, Lightbulb, Users, Calendar } from 'lucide-react';

interface TopicDetailModalProps {
  topic: EntertainmentNewsTopic;
  onClose: () => void;
  onOpenDraftModal: (topic: EntertainmentNewsTopic) => void;
  onUpdateTopicStatus: (topicId: string, newStatus: StatusType) => void;
  onSaveReporterNote: (topicId: string, note: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (topic: EntertainmentNewsTopic) => void;
  initialNote?: string;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  onOpenDraftModal,
  onUpdateTopicStatus,
  onSaveReporterNote,
  isBookmarked,
  onToggleBookmark,
  initialNote = '',
}) => {
  const [noteText, setNoteText] = useState(initialNote);
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);

  const handleSaveNote = () => {
    onSaveReporterNote(topic.id, noteText);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  const statuses: StatusType[] = ['취재대기', '기사작성중', '단독확인', '보도완료'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
          {topic.rank && (
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md">
              화제 순위 #{topic.rank}
            </span>
          )}
          <span className="bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
            {topic.category}
          </span>
          <span className="bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
            {topic.coverageVolume}
          </span>
          <span className="text-xs text-slate-400 font-mono ml-auto">
            작성일자: {topic.publishedDate}
          </span>
        </div>

        {/* Modal Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {topic.title}
        </h2>

        {/* Practical Metrics Grid Box */}
        <div className="mt-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-400 font-medium">제작비 / 손익분기점 / 규모</span>
              <p className="text-sm font-bold text-amber-300 mt-0.5">
                {topic.investmentOrScale}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Building className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-400 font-medium">제작사 / 배급사 / 소속사</span>
              <p className="text-sm font-bold text-slate-200 mt-0.5">
                {topic.productionCompany}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-400 font-medium">주요 캐스팅 / 아티스트 / 연출</span>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                {topic.mainEntities.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-400 font-medium">화제 집중도 & 관심 지수</span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {topic.impactScore}점 / 100점 만점
              </p>
            </div>
          </div>
        </div>

        {/* Topic Executive Summary */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-2">
            <span>📰 취재 팩트 요약</span>
          </h3>
          <p className="text-sm text-slate-200 bg-slate-800/50 border border-slate-800 p-3.5 rounded-xl leading-relaxed">
            {topic.summary}
          </p>
        </div>

        {/* Journalist Key Checkpoints */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>데스크 핵심 취재 검증 포인트</span>
          </h3>
          <ul className="space-y-2 bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-xl">
            {topic.keyCheckpoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                <span className="text-amber-400 font-bold shrink-0">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reporter Analysis Commentary */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-2">
            <span>💡 연예부 기자의 산업적 분석 (Reporter Commentary)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl leading-relaxed">
            {topic.reporterAnalysis}
          </p>
        </div>

        {/* Status Switcher & Reporter Note */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="text-xs font-bold text-slate-300">
              취재 진행 상태 변경:
            </label>
            <div className="flex items-center space-x-1 overflow-x-auto">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateTopicStatus(topic.id, st)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    topic.status === st
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Reporter Personal Notebook Textarea */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">
                📝 개인 취재 수첩 메모 (질문 리스트 / 관계자 멘트 수집)
              </span>
              {savedNoteSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 저장 완료!
                </span>
              )}
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="예: 배급사 홍보팀 인터뷰 일정, 기획사 공식 입장 확인 건, 작성 헤드라인 메모..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveNote}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" /> 메모 저장
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleBookmark(topic)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? '취재 수첩 보관됨' : '취재 수첩에 담기'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDraftModal(topic);
            }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>AI 기사 드래프트 생성하기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
