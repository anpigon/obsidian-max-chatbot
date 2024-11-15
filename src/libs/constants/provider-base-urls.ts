import { LLM_PROVIDERS } from ".";


export const providerBaseUrls: Record<LLM_PROVIDERS, string> = {
	[LLM_PROVIDERS.OLLAMA]: 'http://localhost:11434',
	[LLM_PROVIDERS.LM_STUDIO]: 'http://localhost:1234/v1',
	[LLM_PROVIDERS.REST_API]: '',
	// https://docs.anthropic.com/ko/api/getting-started
	[LLM_PROVIDERS.ANTHROPIC]: 'https://api.anthropic.com/v1',
	[LLM_PROVIDERS.GOOGLE_GEMINI]: 'https://generativelanguage.googleapis.com/v1',
	[LLM_PROVIDERS.MISTRAL]: 'https://api.mistral.ai/v1',
	[LLM_PROVIDERS.OPEN_AI]: 'https://api.openai.com/v1',
	[LLM_PROVIDERS.OPEN_ROUTER]: 'https://openrouter.ai/api/v1',
	[LLM_PROVIDERS.UPSTAGE]: 'https://api.upstage.ai/v1/solar',
	[LLM_PROVIDERS.GROQ]: 'https://api.groq.com/openai/v1',
	[LLM_PROVIDERS.XAI]: 'https://api.x.ai/v1',
	// https://api.sambanova.ai/v1/chat/completions
	[LLM_PROVIDERS.SAMBANOVA]: 'https://api.sambanova.ai/v1',
	[LLM_PROVIDERS.CEREBRAS]: '',
};
