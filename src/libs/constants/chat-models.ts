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
};
