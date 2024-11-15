/* eslint-disable no-unused-vars */
export const SESSIONS_FILENAME = 'sessions';
export const SESSIONS_DIR = 'sessions';


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
