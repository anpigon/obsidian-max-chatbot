import {LLM_PROVIDERS} from './index';

export type ChatModelOption = {
	id: string;
	name: string;
	context_window: number;
	max_output_tokens: number;
};


export const CHAT_MODEL_OPTIONS: Record<LLM_PROVIDERS, ChatModelOption[]> = {
	// https://platform.openai.com/docs/models/overview
	[LLM_PROVIDERS.OPEN_AI]: [
		{
			id: 'gpt-4o',
			name: 'gpt-4o',
			context_window: 128000,
			max_output_tokens: 16384,
		},
		{
			id: 'gpt-4o-mini',
			name: 'gpt-4o-mini',
			context_window: 128000,
			max_output_tokens: 16384,
		},
		{
			id: 'o1-preview',
			name: 'o1-preview',
			context_window: 128000,
			max_output_tokens: 32768,
		},
		{
			id: 'o1-mini',
			name: 'o1-mini',
			context_window: 128000,
			max_output_tokens: 65536,
		},
	],
	// https://docs.anthropic.com/en/docs/about-claude/models#model-names
	[LLM_PROVIDERS.ANTHROPIC]: [
		{
			id: 'claude-3-5-sonnet-latest',
			name: 'claude-3-5-sonnet',
			context_window: 200000,
			max_output_tokens: 8192,
		},
		{
			id: 'claude-3-5-haiku-latest',
			name: 'claude-3-5-haiku',
			context_window: 200000,
			max_output_tokens: 8192,
		},
	],
	// https://ai.google.dev/gemini-api/docs/models/gemini?hl=ko
	[LLM_PROVIDERS.GOOGLE_GEMINI]: [
		{
			id: 'gemini-1.5-flash',
			name: 'gemini-1.5-flash',
			context_window: 1048576,
			max_output_tokens: 8192,
		},
		{
			id: 'gemini-1.5-pro',
			name: 'gemini-1.5-pro',
			context_window: 2097152,
			max_output_tokens: 8192,
		},
	],
	// https://community.sambanova.ai/docs?topic=193
	[LLM_PROVIDERS.SAMBANOVA]: [
		{
			id: 'Meta-Llama-3.1-8B-Instruct',
			name: 'Llama 3.1 8B',
			context_window: 16000,
			max_output_tokens: 4096,
		},
		{
			id: 'Meta-Llama-3.1-70B-Instruct',
			name: 'Llama 3.1 70B',
			context_window: 64000,
			max_output_tokens: 4096,
		},
		{
			id: 'Meta-Llama-3.1-405B-Instruct',
			name: 'Llama 3.1 405B',
			context_window: 8000,
			max_output_tokens: 4096,
		},
		{
			id: 'Meta-Llama-3.2-1B-Instruct',
			name: 'Llama 3.2 1B',
			context_window: 4096,
			max_output_tokens: 4096,
		},
		{
			id: 'Meta-Llama-3.2-3B-Instruct',
			name: 'Llama 3.2 3B',
			context_window: 4096,
			max_output_tokens: 4096,
		},
		{
			id: 'Llama-3.2-11B-Vision-Instruct',
			name: 'Llama 3.2 11B',
			context_window: 4096,
			max_output_tokens: 4096,
		},
		{
			id: 'Llama-3.2-90B-Vision-Instruct',
			name: 'Llama 3.2 90B',
			context_window: 4096,
			max_output_tokens: 4096,
		},
	],
	// https://console.upstage.ai/docs/capabilities/chat
	[LLM_PROVIDERS.UPSTAGE]: [
		{
			id: 'solar-pro-preview-240910',
			name: 'Solar Pro',
			context_window: 4096,
			max_output_tokens: 4096,
		},
		{
			id: 'solar-mini-240612',
			name: 'Solar Mini',
			context_window: 32768,
			max_output_tokens: 4096,
		},
	],
	[LLM_PROVIDERS.GROQ]: [
		// GOOGLE
		{
			id: 'gemma2-9b-it',
			name: 'Gemma 2 9B IT',
			context_window: 8192,
			max_output_tokens: 8192,
		},
		{
			id: 'gemma-7b-it',
			name: 'Gemma 7B IT',
			context_window: 8192,
			max_output_tokens: 8192,
		},

		// GROQ
		{
			id: 'llama3-groq-70b-8192-tool-use-preview',
			name: 'Llama 3 Groq 70B',
			context_window: 8192,
			max_output_tokens: 8192,
		},
		{
			id: 'llama3-groq-8b-8192-tool-use-preview',
			name: 'Llama 3 Groq 8B',
			context_window: 8192,
			max_output_tokens: 8192,
		},

		// META/LLAMA
		{
			id: 'llama-3.1-70b-versatile',
			name: 'Llama 3.1 70B Versatile',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-3.1-8b-instant',
			name: 'Llama 3.1 8B Instant',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-3.2-1b-preview',
			name: 'Llama 3.2 1B',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-3.2-3b-preview',
			name: 'Llama 3.2 3B',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-3.2-11b-vision-preview',
			name: 'Llama 3.2 11B Vision',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-3.2-90b-vision-preview',
			name: 'Llama 3.2 90B Vision',
			context_window: 128000,
			max_output_tokens: 8000,
		},
		{
			id: 'llama-guard-3-8b',
			name: 'Llama Guard 3 8B',
			context_window: 8192,
			max_output_tokens: 8192,
		},
		{
			id: 'llama3-70b-8192',
			name: 'Llama 3 70B',
			context_window: 8192,
			max_output_tokens: 8192,
		},
		{
			id: 'llama3-8b-8192',
			name: 'Llama 3 8B',
			context_window: 8192,
			max_output_tokens: 8192,
		},

		// MISTRAL
		{
			id: 'mixtral-8x7b-32768',
			name: 'Mixtral 8x7B',
			context_window: 32768,
			max_output_tokens: 32768,
		},
	],

	// https://docs.x.ai/docs#models
	[LLM_PROVIDERS.XAI]: [
		{
			id: 'grok-beta',
			name: 'Grok',
			context_window: 128000,
			max_output_tokens: 32768,
		},
	],
	[LLM_PROVIDERS.MISTRAL]: [],
	[LLM_PROVIDERS.OPEN_ROUTER]: [],
	[LLM_PROVIDERS.OLLAMA]: [],
	[LLM_PROVIDERS.LM_STUDIO]: [],
	[LLM_PROVIDERS.REST_API]: [],
	[LLM_PROVIDERS.CEREBRAS]: [],
};
