export const SESSIONS_FILENAME = 'sessions';
export const SESSIONS_DIR = 'sessions';

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
export const ANTHROPIC_MODELS = ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
export const OPEN_AI_MODELS = ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4'];

export const enum LLM_PROVIDERS {
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
	SAMBANOVA = 'SAMBANOVA',
	CEREBRAS = 'CEREBRAS',
}

export const MAX_TOKEN = {
	'gpt-4o': 128_000,
	'gpt-4o-2024-05-13': 128_000,
	'gpt-4-turbo': 128_000,
	'gpt-4-turbo-2024-04-09': 128_000,
	'gpt-4-turbo-preview': 128_000,
	'gpt-4-0125-preview': 128_000,
	'gpt-4-1106-preview': 128_000,
	'gpt-4-vision-preview': 128_000,
	'gpt-4-1106-vision-preview': 128_000,
	'gpt-4': 8_192,
	'gpt-4-0613': 8_192,
	'gpt-4-32k': 32_768,
	'gpt-4-32k-0613': 32_768,
	'gpt-3.5-turbo-0125': 16_385,
	'gpt-3.5-turbo': 16_385,
	'gpt-3.5-turbo-1106': 16_385,
	'gpt-3.5-turbo-instruct': 4_096,
	'gpt-3.5-turbo-16k': 16_385,
	'gpt-3.5-turbo-0613': 4_096,
	'gpt-3.5-turbo-16k-0613': 16_385,
};

export const EMBEDDING_MODELS = {
	// local
	'nomic-embed-text': {dimension: 1_024, sequenceLength: 8_192},
	'mxbai-embed-large': {},
	'snowflake-arctic-embed': {},
	'bge-m3': {dimension: 1_024, sequenceLength: 8_192},
	'bge-m3-unsupervised': {dimension: 1_024, sequenceLength: 8_192},
	'bge-large-en-v1.5': {dimension: 1_024, sequenceLength: 512},
	'bge-base-en-v1.5': {dimension: 768, sequenceLength: 512},
	'bge-small-en-v1.5': {dimension: 384, sequenceLength: 512},
	// openai
	'text-embedding-3-small': {sequenceLength: 8_192},
	'text-embedding-3-large': {sequenceLength: 8_192},
	'text-embedding-ada-002': {sequenceLength: 8_192},
	// UPSTAGE
	// ANTHROPIC
	// GOOGLE_GEMINI
	// COHERE
};

export const embeddingModelKeys = Object.keys(EMBEDDING_MODELS);

export const DEFAULT_VECTOR_STORE_NAME = 'vector_store';
export const VECTOR_STORE_FILE_EXTENSION = '.bin';
