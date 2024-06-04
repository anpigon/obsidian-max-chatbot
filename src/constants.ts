import {MAXSettings} from './types';

export const DEFAULT_MODEL = 'xionic-ko-llama-3-70b';

export const SIONIC_AI_BASE_URL = 'http://sionic.chat:8001/v1';
export const OLLAMA_BASE_URL = 'http://localhost:11434';
export const LM_STUDIO_BASE_URL = 'http://localhost:1234/v1';
export const OPEN_AI_BASE_URL = 'https://api.openai.com/v1';
export const GOOGLE_GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
export const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';
export const OPEN_ROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

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

export const DEFAULT_SETTINGS: MAXSettings = {
	profiles: {
		profile: 'MAX.md',
		profileFolderPath: 'MAX/Profiles',
	},
	general: {
		provider: LLM_PROVIDERS.SIONIC_AI,
		model: DEFAULT_MODEL,
		systemPrompt: '',
		maxTokens: '',
		temperature: '1.00',
		allowReferenceCurrentNote: false,
	},
	appearance: {
		userName: 'USER',
		chatbotName: 'MAX',
		allowHeader: true,
	},
	prompts: {
		prompt: '',
		promptFolderPath: 'MAX/Prompts',
	},
	editor: {
		promptSelectGenerateSystemRole: 'Output user request.',
	},
	chatHistory: {
		chatHistoryFolderPath: 'MAX/History',
		templateFilePath: '',
		allowRenameNoteTitle: false,
	},
	providers: {
		[LLM_PROVIDERS.SIONIC_AI]: {
			enable: true,
			baseUrl: SIONIC_AI_BASE_URL,
			apiKey: '934c4bbc-c384-4bea-af82-1450d7f8128d',
			allowStream: true,
			models: ['xionic-ko-llama-3-70b'],
		},
		[LLM_PROVIDERS.OLLAMA]: {
			enable: false,
			baseUrl: OLLAMA_BASE_URL,
			apiKey: '',
			allowStream: true,
			models: [],
			options: {
				keepAlive: '',
				mirostat: 0,
				mirostatEta: 0.1,
				mirostatTau: 5.0,
				numCtx: 2048,
				numGqa: 0,
				numThread: 0,
				repeatLastN: 64,
				repeatPenalty: 1.1,
				stop: [],
				tfsZ: 1.0,
				topK: 40,
				topP: 0.9,
			},
		},
		[LLM_PROVIDERS.LM_STUDIO]: {
			enable: false,
			apiKey: 'lm-studio',
			baseUrl: LM_STUDIO_BASE_URL,
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.OPEN_AI]: {
			enable: false,
			apiKey: '',
			baseUrl: OPEN_AI_BASE_URL,
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.UPSTAGE]: {
			enable: false,
			apiKey: '',
			baseUrl: 'https://api.upstage.ai/v1/solar',
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.REST_API]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
		[LLM_PROVIDERS.ANTHROPIC]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
		[LLM_PROVIDERS.GOOGLE_GEMINI]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
		[LLM_PROVIDERS.GROQ]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
		[LLM_PROVIDERS.MISTRAL]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
		[LLM_PROVIDERS.OPEN_ROUTER]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: false,
			models: [],
		},
	},
	toggleGeneralSettings: true,
	toggleAppearanceSettings: false,
	togglePromptSettings: false,
	toggleEditorSettings: false,
	toggleChatHistorySettings: false,
	toggleProfileSettings: false,
	toggleAPIConnectionSettings: true,
	toggleOpenAISettings: false,
	toggleMistralSettings: false,
	toggleGoogleGeminiSettings: false,
	toggleAnthropicSettings: false,
	toggleRestApiSettings: true,
	toggleOpenRouterSettings: false,
	toggleOllamaSettings: true,
	toggleAdvancedSettings: false,
	allModels: [DEFAULT_MODEL],
	isVerbose: false,
	langSmithKey: '',
} as const;
