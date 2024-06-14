export const DEFAULT_MODEL = 'xionic-ko-llama-3-70b';

export const SIONIC_AI_BASE_URL = 'http://sionic.chat:8001/v1';
export const OLLAMA_BASE_URL = 'http://localhost:11434';
export const LM_STUDIO_BASE_URL = 'http://localhost:1234/v1';
export const OPEN_AI_BASE_URL = 'https://api.openai.com/v1';
export const GOOGLE_GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
export const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';
export const OPEN_ROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
export const UPSTAGE_BASE_URL = 'https://api.upstage.ai/v1/solar';
export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export const UPSTAGE_MODELS = [
	'solar-1-mini-chat', // GPT-3.5보다 뛰어난 성능을 제공하는 소형 LLM으로, 영어와 한국어를 모두 지원하는 강력한 다국어 기능을 갖추고 있어 더 작은 패키지로 높은 효율성을 제공합니다. Context Length: 32768
	'solar-1-mini-chat-ja', // 영어와 한국어의 높은 효율성과 성능을 유지하면서 일본어에 특화된 solar-mini-chat의 기능을 확장한 소형 LLM입니다. Context Length: 32768
];
export const ANTHROPIC_MODELS = ['claude-instant-1.2', 'claude-2.0', 'claude-2.1', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'];
export const OPEN_AI_MODELS = ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4'];

export const enum LLM_PROVIDERS {
	SIONIC_AI = 'SIONIC_AI',
	OLLAMA = 'OLLAMA',
	LM_STUDIO = 'LM_STUDIO',
	REST_API = 'REST_API',
	ANTHROPIC = 'ANTHROPIC',
	GOOGLE_GEMINI = 'GOOGLE_GEMINI',
	MISTRAL = 'MISTRAL',
	OPEN_AI = 'OPEN_AI',
	OPEN_ROUTER = 'OPEN_ROUTER',
	UPSTAGE = 'UPSTAGE',
	GROQ = 'GROQ',
}
