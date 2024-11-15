import {LLM_PROVIDERS} from '@/libs/constants';

import { providerBaseUrls } from '@/libs/constants/provider-base-urls';

import type {MAXSettings, ProviderSettings} from '@/features/setting/types';

const providers = Object.values(LLM_PROVIDERS).reduce(
	(acc, key) => {
		acc[key] = {
			apiKey: '',
			baseUrl: providerBaseUrls[key],
		};
		return acc;
	},
	{} as Record<LLM_PROVIDERS, ProviderSettings>
);

export const DEFAULT_SETTINGS: MAXSettings = {
	profiles: {
		profile: 'MAX.md',
		profileFolderPath: 'MAX/Profiles',
	},
	general: {
		provider: LLM_PROVIDERS.OPEN_AI,
		model: 'gpt-4o-mini',
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
		...providers,
		[LLM_PROVIDERS.OLLAMA]: {
			enable: false,
			baseUrl: providerBaseUrls.OLLAMA,
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
	allModels: [],
	isVerbose: false,
	langSmithKey: '',
	agents: [],
} as const;
