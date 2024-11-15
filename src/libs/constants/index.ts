/* eslint-disable no-unused-vars */
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
export const XAI_BASE_URL = 'https://api.x.ai/v1';
export const SAMBANOVA_BASE_URL = 'https://api.sambanova.ai/v1'; // https://api.sambanova.ai/v1/chat/completions

export enum LLM_PROVIDERS {
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
	XAI = 'XAI',
	SAMBANOVA = 'SAMBANOVA',
	CEREBRAS = 'CEREBRAS',
}

export const DEFAULT_VECTOR_STORE_NAME = 'vector_store';
export const VECTOR_STORE_FILE_EXTENSION = '.bin';
