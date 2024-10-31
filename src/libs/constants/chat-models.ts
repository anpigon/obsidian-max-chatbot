import {LLM_PROVIDERS} from './index';

export const CHAT_MODEL_OPTIONS = {
	// https://platform.openai.com/docs/models/overview
	[LLM_PROVIDERS.OPEN_AI]: [
		{
			id: 'gpt-4o',
			name: 'gpt-4o',
			context_window: 128_000,
			max_output_tokens: 16_384,
		},
		{
			id: 'gpt-4o-mini',
			name: 'gpt-4o-mini',
			context_window: 128_000,
			max_output_tokens: 16_384,
		},
		{
			id: 'o1-preview',
			name: 'o1-preview',
			context_window: 128_000,
			max_output_tokens: 32_768,
		},
		{
			id: 'o1-mini',
			name: 'o1-mini',
			context_window: 128_000,
			max_output_tokens: 65_536,
		},
	],
	// https://docs.anthropic.com/en/docs/about-claude/models#model-names
	[LLM_PROVIDERS.ANTHROPIC]: [
		{
			id: 'claude-3-5-sonnet-latest',
			name: 'claude-3-5-sonnet',
			context_window: 200_000,
			max_output_tokens: 8_192,
		},
	],
	// https://ai.google.dev/gemini-api/docs/models/gemini?hl=ko
	[LLM_PROVIDERS.GOOGLE_GEMINI]: [
		{
			id: 'gemini-1.5-flash',
			name: 'gemini-1.5-flash',
			context_window: 1_048_576,
			max_output_tokens: 8_192,
		},
		{
			id: 'gemini-1.5-pro',
			name: 'gemini-1.5-pro',
			context_window: 2_097_152,
			max_output_tokens: 8_192,
		},
	],
	// https://community.sambanova.ai/docs?topic=193
	[LLM_PROVIDERS.SAMBANOVA]: [
		{
			id: 'Meta-Llama-3.1-8B-Instruct',
			name: 'Llama 3.1 8B',
			context_window: 16_000,
			max_output_tokens: 4_096,
		},
		{
			id: 'Meta-Llama-3.1-70B-Instruct',
			name: 'Llama 3.1 70B',
			context_window: 64_000,
			max_output_tokens: 4_096,
		},
		{
			id: 'Meta-Llama-3.1-405B-Instruct',
			name: 'Llama 3.1 405B',
			context_window: 8_000,
			max_output_tokens: 4_096,
		},
		{
			id: 'Meta-Llama-3.2-1B-Instruct',
			name: 'Llama 3.2 1B',
			context_window: 4_096,
			max_output_tokens: 4_096,
		},
		{
			id: 'Meta-Llama-3.2-3B-Instruct',
			name: 'Llama 3.2 3B',
			context_window: 4_096,
			max_output_tokens: 4_096,
		},
		{
			id: 'Llama-3.2-11B-Vision-Instruct',
			name: 'Llama 3.2 11B',
			context_window: 4_096,
			max_output_tokens: 4_096,
		},
		{
			id: 'Llama-3.2-90B-Vision-Instruct',
			name: 'Llama 3.2 90B',
			context_window: 4_096,
			max_output_tokens: 4_096,
		},
	],
	// https://console.upstage.ai/docs/capabilities/chat
	[LLM_PROVIDERS.UPSTAGE]: [
		{
			id: 'solar-pro-preview-240910',
			name: 'Solar Pro',
			context_window: 4_096,
			max_output_tokens: 4_096,
		},
		{
			id: 'solar-mini-240612',
			name: 'Solar Mini',
			context_window: 32_768,
			max_output_tokens: 4_096,
		},
	],
	[LLM_PROVIDERS.MISTRAL]: [],
	[LLM_PROVIDERS.GROQ]: [],
	[LLM_PROVIDERS.OPEN_ROUTER]: [],
};
