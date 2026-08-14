import React, { useState } from 'react';
import { EntertainmentNewsTopic, ArticleDraft } from '../types';
import { X, FileText, Copy, Check, Loader2, Sparkles, Send, Newspaper, AlertCircle } from 'lucide-react';

interface ArticleDraftModalProps {
  topic?: EntertainmentNewsTopic;
  onClose: () => void;
}

export const ArticleDraftModal: React.FC<ArticleDraftModalProps> = ({
  topic,
  onClose,
}) => {
  const [topicTitle, setTopicTitle] = useState(topic?.title || '');
  const [category, setCategory] = useState(topic?.category || '영화/배급');
  const [mainEntities, setMainEntities] = useState(topic?.mainEntities.join(', ') || '');
  const [investmentScale, setInvestmentScale] = useState(topic?.investmentOrScale || '');
  const [details, setDetails] = useState(topic?.summary || '');

  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<ArticleDraft | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateDraft = async () => {
    if (!topicTitle.trim()) {
      setErrorMsg('취재 기사 제목 또는 주제를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/news/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle,
          category,
          mainEntities: mainEntities.split(',').map(s => s.trim()),
          investmentScale,
          details,
        }),
      });

      const data = await response.json();
      if (data.success && data.draft) {
        setDraft(data.draft);
      } else {
        setErrorMsg(data.error || '기사 드래프트 생성 실패');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!draft) return;

    const fullArticle = `
[보도 헤드라인]
${draft.headlines[0] || topicTitle}

[리드문]
${draft.leadParagraph}

[본문]
${draft.bodyParagraphs.join('\n\n')}

[기자 데스크 분석]
${draft.journalistAnalysis}
    `.trim();

    navigator.clipboard.writeText(fullArticle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI 연예부 기사 작성 도우미
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                취재 팩트 기반 보도문, 헤드라인 3종 및 데스크 분석 자동 생성
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

        {/* Input Form */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              기사 주제 / 취재 제목:
            </label>
            <input
              type="text"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              placeholder="예: 봉준호 감독 신작 650억 SF 텐트폴 워너브러더스 글로벌 배급"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                카테고리:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-slate-200"
              >
                <option value="영화/배급">영화/배급</option>
                <option value="음악/K-Pop">음악/K-Pop</option>
                <option value="드라마/OTT">드라마/OTT</option>
                <option value="공연/뮤지컬">공연/뮤지컬</option>
                <option value="제작/투자">제작/투자/M&A</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                주요 인물/IP (쉼표 구분):
              </label>
              <input
                type="text"
                value={mainEntities}
                onChange={(e) => setMainEntities(e.target.value)}
                placeholder="예: 봉준호, 송강호, CJ ENM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                제작비/투자/실적 수치:
              </label>
              <input
                type="text"
                value={investmentScale}
                onChange={(e) => setInvestmentScale(e.target.value)}
                placeholder="예: 순제작비 650억 / BEP 780만"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              취재 상세 내용 및 팩트 메모:
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="취재한 팩트, 공식 입장, 관계자 멘트 등을 적어주세요..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-slate-200"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800">
              ⚠️ {errorMsg}
            </p>
          )}

          <button
            onClick={handleGenerateDraft}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>기사 드래프트 작성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>기사 드래프트 생성하기</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Article Draft */}
        {draft && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-5 animate-in fade-in duration-300">
            
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                ✓ AI 연예부 보도 기사 초안 생성 완료
              </span>
              <button
                onClick={handleCopyText}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '복사 완료!' : '기사 클립보드 복사'}</span>
              </button>
            </div>

            {/* Headline Variations */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-400 block mb-2">
                📌 추천 기사 헤드라인 3선:
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-100">
                {draft.headlines.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500">{idx + 1}.</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Lead Paragraph */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs font-bold text-indigo-300 block mb-1">
                [리드문]
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {draft.leadParagraph}
              </p>
            </div>

            {/* Body Paragraphs */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 block mb-1">
                [본문 기사 내용]
              </span>
              {draft.bodyParagraphs.map((para, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Journalist Desk Analysis */}
            <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl">
              <span className="text-xs font-bold text-amber-300 block mb-1">
                💡 연예부 데스크 시각 (후속 취재 포인트):
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {draft.journalistAnalysis}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
