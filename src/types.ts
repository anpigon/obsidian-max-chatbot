import {LLM_PROVIDERS} from './constants';
import useChatStream from './hooks/useChatStream';

export interface ProviderSettings {
	enable: boolean;
	apiKey: string;
	baseUrl: string;
	allowStream: boolean;
	models: string[];
}

export interface OllamaSettings extends ProviderSettings {
	options: {
		mirostat: number;
		mirostatEta: number;
		mirostatTau: number;
		numCtx: number;
		numGqa: number;
		numThread: number;
		repeatLastN: number;
		repeatPenalty: number;
		stop: string[];
		tfsZ: number;
		topK: number;
		topP: number;
		keepAlive: string;
	};
}

export interface LLMProviderSettings {
	[LLM_PROVIDERS.SIONIC_AI]: ProviderSettings;
	[LLM_PROVIDERS.OLLAMA]: OllamaSettings;
	[LLM_PROVIDERS.LM_STUDIO]: ProviderSettings;
	[LLM_PROVIDERS.REST_API]: ProviderSettings;
	[LLM_PROVIDERS.OPEN_AI]: ProviderSettings;
	[LLM_PROVIDERS.UPSTAGE]: ProviderSettings;
	[LLM_PROVIDERS.ANTHROPIC]: ProviderSettings;
	[LLM_PROVIDERS.GOOGLE_GEMINI]: ProviderSettings;
	[LLM_PROVIDERS.MISTRAL]: ProviderSettings;
	[LLM_PROVIDERS.OPEN_ROUTER]: ProviderSettings;
	[LLM_PROVIDERS.GROQ]: ProviderSettings;

}

export interface MAXSettings {
	profiles: {
		profile: string;
		profileFolderPath: string;
	};
	general: {
		provider: LLM_PROVIDERS;
		model: string;
		systemPrompt: string;
		maxTokens: string;
		temperature: string;
		allowReferenceCurrentNote: boolean;
	};
	appearance: {
		userName: string;
		chatbotName: string;
		allowHeader: boolean;
	};
	prompts: {
		prompt: string;
		promptFolderPath: string;
	};
	editor: {
		promptSelectGenerateSystemRole: string;
	};
	chatHistory: {
		chatHistoryFolderPath: string;
		templateFilePath: string;
		allowRenameNoteTitle: boolean;
	};
	providers: LLMProviderSettings;
	toggleGeneralSettings: boolean;
	toggleAppearanceSettings: boolean;
	togglePromptSettings: boolean;
	toggleEditorSettings: boolean;
	toggleChatHistorySettings: boolean;
	toggleProfileSettings: boolean;
	toggleAPIConnectionSettings: boolean;
	toggleOpenAISettings: boolean;
	toggleMistralSettings: boolean;
	toggleGoogleGeminiSettings: boolean;
	toggleAnthropicSettings: boolean;
	toggleRestApiSettings: boolean;
	toggleOpenRouterSettings: boolean;
	toggleOllamaSettings: boolean;
	toggleAdvancedSettings: boolean;
	allModels: string[];
	isVerbose: boolean;
	langSmithKey: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type UseChatStreamRole = 'bot' | 'user';

export type UseChatStreamChatMessage = {
	role: UseChatStreamRole;
	content: string;
	id: string;
};

export type UseChatStreamHttpOptions = {
	url: string;
	method: HttpMethod;
	query?: Record<string, string>;
	headers?: HeadersInit;
	body?: Record<string, string>;
};

export type UseChatStreamEventHandlers = {
	onMessageAdded: (message: UseChatStreamChatMessage) => unknown | Promise<unknown>;
};

export type UseChatStreamInputMethod = {
	type: 'body' | 'query';
	key: string;
};

export type UseChatStreamInput = {
	options: UseChatStreamHttpOptions;
	method: UseChatStreamInputMethod;
	handlers: UseChatStreamEventHandlers;
};

export type UseChatStreamResult = ReturnType<typeof useChatStream>;
