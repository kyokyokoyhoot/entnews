import React, { useState } from 'react';
import { Sparkles, Search, Loader2, ExternalLink, ArrowRight, ShieldCheck, Flame, Zap, RefreshCw, PlusCircle } from 'lucide-react';
import { EntertainmentNewsTopic, GeminiSearchResult } from '../types';

interface GeminiSearchRadarProps {
  onClose: () => void;
  onImportGeneratedTopic: (newTopic: EntertainmentNewsTopic) => void;
}

export const GeminiSearchRadar: React.FC<GeminiSearchRadarProps> = ({
  onClose,
  onImportGeneratedTopic,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiSearchResult | null>(null);
  const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleQueries = [
    '2026년 하반기 한국 영화 텐트폴 손익분기점(BEP) 비교',
    'K-Pop 대형 기획사 월드투어 제작비 및 예상 매출',
    '글로벌 OTT K-드라마 회당 제작비 및 해외 판권 세일즈',
    '국내 엔터테인먼트사 M&A 및 지분 인수 공시 현황',
  ];

  const handleRunSearch = async (targetQuery?: string) => {
    const q = targetQuery || query || '최신 대한민국 연예계 제작 발표 및 투자 화제 뉴스';
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/news/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, category }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        setSources(data.sources || []);
      } else {
        setErrorMsg(data.error || '검색 결과 수집 실패');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportRankItem = (item: any) => {
    const newTopic: EntertainmentNewsTopic = {
      id: `imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      rank: item.rank || 1,
      title: item.title,
      category: item.category || '영화/배급',
      mainEntities: Array.isArray(item.mainEntities) ? item.mainEntities : [item.mainEntities || '주요 연예인'],
      investmentOrScale: item.investmentOrScale || '규모 데이터 확인 중',
      productionCompany: '제작/배급사 취재 중',
      impactScore: item.impactScore || 90,
      coverageVolume: '대형 이슈',
      summary: item.summary,
      keyCheckpoints: item.keyCheckpoints || ['제작비 회수율 및 해외 배급망 확인'],
      reporterAnalysis: 'Gemini 실시간 취재 Radar 분석 데이터 기반 수집 항목',
      publishedDate: new Date().toISOString().slice(0, 10),
      isTopHot: true,
      status: '취재대기',
    };

    onImportGeneratedTopic(newTopic);
    alert(`"${item.title.slice(0, 20)}..." 항목이 취재 대시보드 및 수첩에 등록되었습니다!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-600 flex items-center justify-center shadow-lg shadow-indigo-950">
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  AI 연예부 실시간 취재 Radar
                </h2>
                <span className="bg-indigo-950 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-800">
                  Google Search Grounding
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                무명 인플루언서/가십 제외 · 최신 K-Ent 제작·투자·대작 중심 검색 분석
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Query Input Box & Presets */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
                placeholder="취재 주제 입력 (예: 2026 하반기 K-드라마 제작비 및 손익분기점)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              onClick={() => handleRunSearch()}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>취재 분석 중...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>실시간 탐색</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Query Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-medium shrink-0">추천 검색:</span>
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq);
                  handleRunSearch(sq);
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="my-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-sm font-semibold text-indigo-300">
              최신 연예계 뉴스 및 실무 투자 데이터를 수집 분석하고 있습니다...
            </p>
            <p className="text-xs text-slate-400">
              무명 가십 제외 필터링 및 제작사/배급사 공시 정보 교차 검증 중
            </p>
          </div>
        )}

        {/* Search Results Display */}
        {result && !isLoading && (
          <div className="mt-6 space-y-6">
            
            {/* Executive Summary Box */}
            <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 취재 종합 분석 브리핑
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>

            {/* Generated Topic Rankings */}
            {result.hotRankings && result.hotRankings.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500 fill-current" />
                  <span>수집된 핵심 연예 이슈 순위</span>
                </h3>

                <div className="space-y-3">
                  {result.hotRankings.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded">
                            #{item.rank || idx + 1}
                          </span>
                          <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                            💰 {item.investmentOrScale}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {item.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => handleImportRankItem(item)}
                        className="self-start md:self-center bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-400" />
                        <span>대시보드에 추가</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Takeaway & Story Lead */}
            {result.industryMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400 font-bold">산업적 시사점:</span>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">
                    {result.industryMetrics.keyTakeaway}
                  </p>
                </div>
                <div className="bg-slate-950 border border-amber-900/50 p-4 rounded-xl">
                  <span className="text-xs text-amber-400 font-bold">💡 단독/추적 보도 아이템 제안:</span>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">
                    {result.industryMetrics.exclusiveStoryLead}
                  </p>
                </div>
              </div>
            )}

            {/* Grounding Sources */}
            {sources.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-medium block mb-2">
                  🔗 검증에 참고한 출처 링크 (Google Search Sources):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      <span className="truncate max-w-[200px]">{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
