import React, { useState, useEffect } from 'react';
import { EntertainmentNewsTopic, StoryNotebookItem, StatusType } from './types';
import { INITIAL_NEWS_TOPICS, CATEGORY_QUICK_METRICS } from './data/mockNewsData';
import { Header } from './components/Header';
import { DailyBriefing } from './components/DailyBriefing';
import { CategoryFilter } from './components/CategoryFilter';
import { TopicCard } from './components/TopicCard';
import { TopicDetailModal } from './components/TopicDetailModal';
import { GeminiSearchRadar } from './components/GeminiSearchRadar';
import { ArticleDraftModal } from './components/ArticleDraftModal';
import { StoryNotebookModal } from './components/StoryNotebookModal';
import { Flame, Film, Music, Tv, Drama, DollarSign, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [topics, setTopics] = useState<EntertainmentNewsTopic[]>(() => {
    const saved = localStorage.getItem('k_ent_topics');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_NEWS_TOPICS;
  });

  const [notebook, setNotebook] = useState<StoryNotebookItem[]>(() => {
    const saved = localStorage.getItem('k_ent_notebook');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        topicId: INITIAL_NEWS_TOPICS[0].id,
        topic: INITIAL_NEWS_TOPICS[0],
        savedAt: '2026-08-12 08:30',
        reporterNotes: '워너브러더스 글로벌 유통 배급 파트너십 조건 및 북미 상영관 수 추가 취재 예정',
        status: '기사작성중',
        tags: ['영화', '봉준호', 'CJ ENM']
      }
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('🔥 TOP 화제 순위');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [activeDetailTopic, setActiveDetailTopic] = useState<EntertainmentNewsTopic | null>(null);
  const [activeDraftTopic, setActiveDraftTopic] = useState<EntertainmentNewsTopic | undefined>(undefined);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isGeminiRadarOpen, setIsGeminiRadarOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('k_ent_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('k_ent_notebook', JSON.stringify(notebook));
  }, [notebook]);

  // Handle Import from Gemini Radar
  const handleImportGeneratedTopic = (newTopic: EntertainmentNewsTopic) => {
    setTopics(prev => [newTopic, ...prev]);
    // Also save to notebook by default
    handleToggleBookmark(newTopic);
  };

  // Toggle Bookmark in Story Notebook
  const handleToggleBookmark = (topic: EntertainmentNewsTopic) => {
    setNotebook(prev => {
      const exists = prev.some(item => item.topicId === topic.id);
      if (exists) {
        return prev.filter(item => item.topicId !== topic.id);
      } else {
        const newItem: StoryNotebookItem = {
          topicId: topic.id,
          topic,
          savedAt: new Date().toLocaleString('ko-KR', { hour12: false }).slice(0, 16),
          reporterNotes: '',
          status: topic.status || '취재대기',
          tags: [topic.category],
        };
        return [newItem, ...prev];
      }
    });
  };

  // Update Status
  const handleUpdateTopicStatus = (topicId: string, newStatus: StatusType) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, status: newStatus } : t));
    setNotebook(prev => prev.map(n => n.topicId === topicId ? { ...n, status: newStatus } : n));
    if (activeDetailTopic && activeDetailTopic.id === topicId) {
      setActiveDetailTopic(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Save Reporter Personal Note
  const handleSaveReporterNote = (topicId: string, note: string) => {
    setNotebook(prev => {
      const exists = prev.some(n => n.topicId === topicId);
      if (exists) {
        return prev.map(n => n.topicId === topicId ? { ...n, reporterNotes: note } : n);
      } else {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return prev;
        return [{
          topicId,
          topic,
          savedAt: new Date().toLocaleString('ko-KR', { hour12: false }).slice(0, 16),
          reporterNotes: note,
          status: topic.status,
          tags: [topic.category]
        }, ...prev];
      }
    });
  };

  // Reset to default mock data
  const handleResetData = () => {
    if (confirm('초기 취재 데스크 데이터로 재설정하시겠습니까?')) {
      setTopics(INITIAL_NEWS_TOPICS);
      localStorage.removeItem('k_ent_topics');
    }
  };

  // Compute category topic counts
  const topicCounts: { [key: string]: number } = {
    '전체': topics.length,
    '🔥 TOP 화제 순위': topics.filter(t => t.isTopHot && t.rank !== undefined).length,
    '영화/배급': topics.filter(t => t.category === '영화/배급').length,
    '음악/K-Pop': topics.filter(t => t.category === '음악/K-Pop').length,
    '드라마/OTT': topics.filter(t => t.category === '드라마/OTT').length,
    '공연/뮤지컬': topics.filter(t => t.category === '공연/뮤지컬').length,
    '제작/투자': topics.filter(t => t.category === '제작/투자').length,
  };

  // Filter Topics
  const filteredTopics = topics.filter(topic => {
    // Category match
    if (selectedCategory === '🔥 TOP 화제 순위') {
      if (!topic.isTopHot || topic.rank === undefined) return false;
    } else if (selectedCategory !== '전체') {
      if (topic.category !== selectedCategory) return false;
    }

    // Status match
    if (selectedStatus !== '전체' && topic.status !== selectedStatus) {
      return false;
    }

    // Search Query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchEntities = topic.mainEntities.some(e => e.toLowerCase().includes(q));
      const matchSummary = topic.summary.toLowerCase().includes(q);
      const matchCompany = topic.productionCompany.toLowerCase().includes(q);
      const matchScale = topic.investmentOrScale.toLowerCase().includes(q);
      return matchTitle || matchEntities || matchSummary || matchCompany || matchScale;
    }

    return true;
  }).sort((a, b) => {
    if (selectedCategory === '🔥 TOP 화제 순위') {
      return (a.rank || 99) - (b.rank || 99);
    }
    return b.impactScore - a.impactScore;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenGeminiRadar={() => setIsGeminiRadarOpen(true)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenDraftAssistant={() => {
          setActiveDraftTopic(undefined);
          setIsDraftModalOpen(true);
        }}
        notebookCount={notebook.length}
      />

      {/* Main Reporter Desk Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Daily Journalist Briefing */}
        <DailyBriefing
          topTopics={topics.filter(t => t.isTopHot && t.rank !== undefined)}
          onSelectTopic={(t) => setActiveDetailTopic(t)}
          onOpenGeminiRadar={() => setIsGeminiRadarOpen(true)}
        />

        {/* Quick Industry Metrics Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {Object.entries(CATEGORY_QUICK_METRICS).map(([key, val]) => (
            <div
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedCategory === key
                  ? 'bg-slate-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="text-[11px] font-medium text-slate-400 block">{val.label} 주요 모니터링</span>
              <p className="text-sm font-bold text-amber-400 mt-0.5">{val.totalBudget}</p>
              <p className="text-[11px] text-slate-300 truncate mt-1">{val.hotFocus}</p>
            </div>
          ))}
        </div>

        {/* Category & Status Filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          topicCounts={topicCounts}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {selectedCategory === '🔥 TOP 화제 순위' ? (
                <>
                  <Flame className="w-5 h-5 text-amber-400 fill-current" />
                  <span>대한민국 연예계 화제의 중심 TOP 10</span>
                </>
              ) : (
                <span>{selectedCategory} 취재 파이프라인</span>
              )}
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredTopics.length}건 검색됨)
            </span>
          </div>

          <button
            onClick={handleResetData}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            title="초기 취재 데이터 복원"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">데이터 초기화</span>
          </button>
        </div>

        {/* Main Grid of News Cards */}
        {filteredTopics.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 my-8 space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-300">
              조건에 일치하는 취재 뉴스가 없습니다.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              검색어나 상태 필터를 변경해보시거나, 상단의 [AI 취재 Radar]를 통해 최신 K-Ent 뉴스를 실시간으로 수집해보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSelectedStatus('전체');
                setSearchQuery('');
              }}
              className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
            >
              전체 필터 해제
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onSelectTopic={(t) => setActiveDetailTopic(t)}
                onOpenDraftModal={(t) => {
                  setActiveDraftTopic(t);
                  setIsDraftModalOpen(true);
                }}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={notebook.some(n => n.topicId === topic.id)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            K-Ent Reporter Desk · 대한민국 연예부 기자 전용 취재·산업 레이더
          </p>
          <p className="text-slate-600">
            영화·음악·드라마·공연·투자 실무 데이터 중심 · 무명 인플루언서/가십 자동 필터링 시스템
          </p>
          <p className="text-slate-600 font-mono">
            Powered by Gemini AI (Google Search Grounding Enabled)
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      {activeDetailTopic && (
        <TopicDetailModal
          topic={activeDetailTopic}
          onClose={() => setActiveDetailTopic(null)}
          onOpenDraftModal={(t) => {
            setActiveDraftTopic(t);
            setIsDraftModalOpen(true);
          }}
          onUpdateTopicStatus={handleUpdateTopicStatus}
          onSaveReporterNote={handleSaveReporterNote}
          isBookmarked={notebook.some(n => n.topicId === activeDetailTopic.id)}
          onToggleBookmark={handleToggleBookmark}
          initialNote={notebook.find(n => n.topicId === activeDetailTopic.id)?.reporterNotes || ''}
        />
      )}

      {/* Gemini Search Radar Modal */}
      {isGeminiRadarOpen && (
        <GeminiSearchRadar
          onClose={() => setIsGeminiRadarOpen(false)}
          onImportGeneratedTopic={handleImportGeneratedTopic}
        />
      )}

      {/* Article Draft Assistant Modal */}
      {isDraftModalOpen && (
        <ArticleDraftModal
          topic={activeDraftTopic}
          onClose={() => {
            setIsDraftModalOpen(false);
            setActiveDraftTopic(undefined);
          }}
        />
      )}

      {/* Story Notebook Modal */}
      {isNotebookOpen && (
        <StoryNotebookModal
          notebook={notebook}
          onClose={() => setIsNotebookOpen(false)}
          onRemoveItem={(topicId) => {
            setNotebook(prev => prev.filter(n => n.topicId !== topicId));
          }}
          onUpdateNote={handleSaveReporterNote}
          onUpdateStatus={handleUpdateTopicStatus}
          onSelectTopic={(t) => {
            setIsNotebookOpen(false);
            setActiveDetailTopic(t);
          }}
          onOpenDraftModal={(t) => {
            setIsNotebookOpen(false);
            setActiveDraftTopic(t);
            setIsDraftModalOpen(true);
          }}
        />
      )}

    </div>
  );
}
