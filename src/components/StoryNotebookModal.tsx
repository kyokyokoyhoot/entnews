import React, { useState } from 'react';
import { StoryNotebookItem, StatusType, EntertainmentNewsTopic } from '../types';
import { BookmarkCheck, X, Trash2, Download, Edit3, Check, FileText, ArrowUpRight, Filter } from 'lucide-react';

interface StoryNotebookModalProps {
  notebook: StoryNotebookItem[];
  onClose: () => void;
  onRemoveItem: (topicId: string) => void;
  onUpdateNote: (topicId: string, note: string) => void;
  onUpdateStatus: (topicId: string, status: StatusType) => void;
  onSelectTopic: (topic: EntertainmentNewsTopic) => void;
  onOpenDraftModal: (topic: EntertainmentNewsTopic) => void;
}

export const StoryNotebookModal: React.FC<StoryNotebookModalProps> = ({
  notebook,
  onClose,
  onRemoveItem,
  onUpdateNote,
  onUpdateStatus,
  onSelectTopic,
  onOpenDraftModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const statuses: StatusType[] = ['취재대기', '기사작성중', '단독확인', '보도완료'];

  const filteredItems = notebook.filter(item => {
    if (filterStatus === '전체') return true;
    return item.status === filterStatus;
  });

  const handleStartEdit = (item: StoryNotebookItem) => {
    setEditingId(item.topicId);
    setEditingNoteText(item.reporterNotes || '');
  };

  const handleSaveEdit = (topicId: string) => {
    onUpdateNote(topicId, editingNoteText);
    setEditingId(null);
  };

  const handleExportText = () => {
    if (notebook.length === 0) return;

    let content = `# [취재 수첩] 대한민국 연예부 데스크 기사 소재 노트\n`;
    content += `생성 일시: ${new Date().toLocaleString('ko-KR')}\n\n`;

    notebook.forEach((item, idx) => {
      content += `## ${idx + 1}. ${item.topic.title}\n`;
      content += `- 카테고리: ${item.topic.category} | 진행상태: ${item.status}\n`;
      content += `- 주요 라인업: ${item.topic.mainEntities.join(', ')}\n`;
      content += `- 실무 데이터: ${item.topic.investmentOrScale} (${item.topic.productionCompany})\n`;
      content += `- 요약: ${item.topic.summary}\n`;
      content += `- 기자 취재 메모: ${item.reporterNotes || '없음'}\n\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `연예부_취재수첩_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                연예부 기자 취재 수첩 (Story Pocket)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                관심 보도 항목 {notebook.length}건 보관 중 · 개인 메모 및 기사 상태 관리
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Filter */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium mr-1">상태 필터:</span>
            <button
              onClick={() => setFilterStatus('전체')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterStatus === '전체'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 ({notebook.length})
            </button>
            {statuses.map((st) => {
              const count = notebook.filter(n => n.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={handleExportText}
            disabled={notebook.length === 0}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>수첩 메모 TXT 내보내기</span>
          </button>
        </div>

        {/* Notebook Items List */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">저장된 취재 수첩 항목이 없습니다.</p>
            <p className="text-xs text-slate-500">
              메인 대시보드에서 카드 우측 상단의 북마크 버튼을 눌러 취재 기사 소재를 보관해보세요.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.topicId}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded">
                      {item.topic.category}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">
                      💰 {item.topic.investmentOrScale}
                    </span>
                  </div>

                  {/* Status Selector */}
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-slate-400">상태:</span>
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.topicId, e.target.value as StatusType)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-xs font-semibold"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => onRemoveItem(item.topicId)}
                      className="text-slate-500 hover:text-rose-400 p-1 ml-2 transition-colors cursor-pointer"
                      title="취재 수첩에서 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectTopic(item.topic)}
                  className="text-base font-bold text-white hover:text-amber-300 cursor-pointer transition-colors"
                >
                  {item.topic.title}
                </h3>

                {/* Reporter Custom Notes Block */}
                <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> 기자 개인 취재 메모
                    </span>
                    {editingId !== item.topicId ? (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-slate-400 hover:text-white underline text-[11px] cursor-pointer"
                      >
                        수정하기
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveEdit(item.topicId)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 text-[11px] cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> 저장
                      </button>
                    )}
                  </div>

                  {editingId === item.topicId ? (
                    <textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none"
                    />
                  ) : (
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {item.reporterNotes || '입력된 개인 취재 메모가 없습니다. [수정하기]를 눌러 멘트나 질문 리스트를 메모하세요.'}
                    </p>
                  )}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">
                    저장일시: {item.savedAt}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenDraftModal(item.topic)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>기사 작성</span>
                    </button>

                    <button
                      onClick={() => onSelectTopic(item.topic)}
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-1 rounded border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                    >
                      <span>상세 취재 팩트</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
