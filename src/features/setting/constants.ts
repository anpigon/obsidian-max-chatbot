import {
	ANTHROPIC_MODELS,
	DEFAULT_MODEL,
	GOOGLE_GEMINI_BASE_URL,
	GROQ_BASE_URL,
	LLM_PROVIDERS,
	LM_STUDIO_BASE_URL,
	OLLAMA_BASE_URL,
	OPEN_AI_BASE_URL,
	SIONIC_AI_BASE_URL,
	UPSTAGE_BASE_URL,
} from '@/constants';

import type {MAXSettings} from '@/features/setting/types';

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
			baseUrl: UPSTAGE_BASE_URL,
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
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.GOOGLE_GEMINI]: {
			enable: false,
			apiKey: '',
			baseUrl: GOOGLE_GEMINI_BASE_URL,
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.GROQ]: {
			enable: false,
			apiKey: '',
			baseUrl: GROQ_BASE_URL,
			allowStream: true,
			models: [],
		},
		[LLM_PROVIDERS.MISTRAL]: {
			enable: false,
			apiKey: '',
			baseUrl: '',
			allowStream: true,
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
	agents: [],
} as const;
