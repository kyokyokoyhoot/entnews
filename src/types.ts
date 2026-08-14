export type CategoryType = 
  | '전체'
  | '영화/배급'
  | '음악/K-Pop'
  | '드라마/OTT'
  | '공연/뮤지컬'
  | '제작/투자';

export type StatusType = '취재대기' | '기사작성중' | '단독확인' | '보도완료';

export interface EntertainmentNewsTopic {
  id: string;
  rank?: number; // 1 to 10 for hot ranked items
  title: string;
  category: CategoryType;
  mainEntities: string[]; // Major celebrities, directors, producers, agencies
  investmentOrScale: string; // Practical budget, BEP, album sales, tour revenue
  productionCompany: string; // Production house, distributor, or agency
  impactScore: number; // 1 to 100
  coverageVolume: '속보' | '대형 이슈' | '주요 편성' | '단독 추적';
  summary: string;
  keyCheckpoints: string[]; // Fact check points for reporters
  reporterAnalysis: string; // In-depth journalist commentary
  publishedDate: string;
  isTopHot: boolean;
  status: StatusType;
  viewsOrInterest?: string;
  relatedLinks?: { title: string; url: string }[];
}

export interface StoryNotebookItem {
  topicId: string;
  topic: EntertainmentNewsTopic;
  savedAt: string;
  reporterNotes: string;
  status: StatusType;
  tags: string[];
}

export interface GeminiSearchResult {
  summary: string;
  hotRankings: {
    rank: number;
    title: string;
    category: CategoryType;
    mainEntities: string[];
    investmentOrScale: string;
    impactScore: number;
    summary: string;
    keyCheckpoints: string[];
    coverageVolume: string;
  }[];
  industryMetrics: {
    keyTakeaway: string;
    exclusiveStoryLead: string;
  };
}

export interface ArticleDraft {
  headlines: string[];
  leadParagraph: string;
  bodyParagraphs: string[];
  journalistAnalysis: string;
  keyFactSheet: {
    [key: string]: string;
  };
}
