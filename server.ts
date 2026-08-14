import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      return ai;
    }
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return ai;
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Search & Industry News Intelligence Radar (with Google Search Grounding)
app.post('/api/news/search', async (req, res) => {
  try {
    const { query, category } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `너는 대한민국 최정상 연예부 수석 기자 및 엔터테인먼트 산업 전문 자문위원이다.
너의 임무는 대한민국 연예계/문화예술계의 최신 뉴스 및 트렌드를 취재 분석하는 것이다.

다음 규칙을 엄격히 준수할 것:
1. 들어본 적 없는 인지도 없는 신인/일반인/무명 인플루언서 관련 가십성 뉴스는 완전 제외한다.
2. 대한민국 문화 예술 전반(영화, 음악/K-pop, 드라마/OTT, 대형 공연/뮤지컬, 기획사 투자/M&A)에 관련된 실무적이고 중량감 있는 뉴스를 최우선으로 취재 분석한다.
3. 실무 중심 항목(제작비 규모, 투자 배급사, 예상 손익분기점(BEP), 음원/음반 초동, 월드투어 티켓팅/매출, 해외 판권 세일즈, 기획사 실적/공시 등)을 구체적인 숫자와 함께 비중 있게 다룬다.
4. 모든 응답은 한국어로 작성하며, 기자가 바로 보고서나 취재 노트로 활용할 수 있도록 명확하고 객관적이며 통찰력 있는 전문 어조를 사용한다.`;

    const userPrompt = `다음 요청 키워드 및 카테고리에 맞춰 연예부 기자를 위한 핵심 취재 데이터 및 현황을 종합 정리해줘:
키워드: "${query || '최신 대한민국 연예계 제작 발표 및 투자 화제 뉴스'}"
카테고리: "${category || '전체'}"

다음 형식의 JSON으로만 응답해줘:
{
  "summary": "취재 핵심 현황 요약 (3문장 내외)",
  "hotRankings": [
    {
      "rank": 1,
      "title": "이슈 타이틀",
      "category": "영화/배급 | 음악/K-Pop | 드라마/OTT | 공연/뮤지컬 | 제작/투자",
      "mainEntities": ["주요 연예인/감독/기획사 이름"],
      "investmentOrScale": "제작비/투자규모/초동/관객수 등 실무 데이터",
      "impactScore": 95,
      "summary": "핵심 뉴스 내용 및 실무적 의미",
      "keyCheckpoints": ["취재 확인 포인트 1", "취재 확인 포인트 2"],
      "coverageVolume": "상"
    }
  ],
  "industryMetrics": {
    "keyTakeaway": "산업 전반적 시사점",
    "exclusiveStoryLead": "기자가 단독/추적 보도할 만한 취재 아이템 제안"
  }
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    let parsedData = null;
    
    // Attempt JSON parse from markdown code block or raw text
    try {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
      const cleanJson = jsonMatch[1].trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        summary: text,
        hotRankings: [],
        industryMetrics: {
          keyTakeaway: "실시간 분석 완료",
          exclusiveStoryLead: "상세 내역 확인 필요"
        }
      };
    }

    // Extract search grounding metadata if present
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((c: any) => c?.web?.uri ? { uri: c.web.uri, title: c.web.title || c.web.uri } : null)
      .filter(Boolean);

    res.json({
      success: true,
      data: parsedData,
      sources,
      rawText: text
    });
  } catch (error: any) {
    console.error('Error in /api/news/search:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Gemini API call failed',
    });
  }
});

// AI Article Draft & Press Analysis Helper for Journalists
app.post('/api/news/draft', async (req, res) => {
  try {
    const { topicTitle, category, details, mainEntities, investmentScale } = req.body;
    const client = getGeminiClient();

    const systemPrompt = `너는 대한민국 베테랑 연예부 데스크 기자이다.
현장 기자가 입력한 취재 팩트와 데이터를 바탕으로 완성도 높은 연예 전문 기사를 기획 작성한다.
추측성 루머는 배제하고 실무적/산업적 데이터(제작비, 배급사, 초동, 손익분기점, 투자 구조)를 부각시키는 엄정한 단문 중심 보도체를 사용한다.`;

    const userPrompt = `다음 취재 이슈를 바탕으로 연예부 기사 드래프트를 작성해줘:
- 주제: ${topicTitle}
- 분야: ${category}
- 주요 관계자/IP: ${Array.isArray(mainEntities) ? mainEntities.join(', ') : mainEntities}
- 제작/투자/실적 데이터: ${investmentScale || '미정'}
- 추가 취재 메모: ${details || '없음'}

다음 JSON 구조로 응답해줘:
{
  "headlines": [
    "속보/단독형 헤드라인",
    "산업/투자 집중 분석형 헤드라인",
    "기획/심층보도형 헤드라인"
  ],
  "leadParagraph": "기사 첫 단락 (리드문)",
  "bodyParagraphs": ["본문 1단락 (주요 팩트 및 제작/투자 데이터)", "본문 2단락 (업계 영향 및 전망)"],
  "journalistAnalysis": "데스크 시각의 비하인드 평가 및 기자의 다음 취재 포인트",
  "keyFactSheet": {
    "제작배급사": "...",
    "총투자규모": "...",
    "핵심관전포인트": "..."
  }
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json({ success: true, draft: parsed });
  } catch (error: any) {
    console.error('Error in /api/news/draft:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Article draft generation failed',
    });
  }
});

// Start Express Server & Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[K-Ent Reporter Desk Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
