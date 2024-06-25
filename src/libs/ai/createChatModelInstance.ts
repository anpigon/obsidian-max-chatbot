import {ChatOllama} from '@langchain/community/chat_models/ollama';
import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {ChatOpenAI} from '@langchain/openai';
import {ChatGroq} from '@langchain/groq';

import {MAXSettings, ProviderSettings} from '@/features/setting/types';
import {LLM_PROVIDERS} from '@/constants';

export default function createChatModelInstance(provider: LLM_PROVIDERS, model: string, setting: MAXSettings) {
	const verbose = false;
	const providerOptions: ProviderSettings = setting.providers[provider];
	const options = {...providerOptions, model, verbose};

	switch (provider) {
		case LLM_PROVIDERS.OLLAMA:
			return new ChatOllama(options);
		case LLM_PROVIDERS.GOOGLE_GEMINI:
			return new ChatGoogleGenerativeAI(options);
		case LLM_PROVIDERS.GROQ:
			return new ChatGroq(options);
		default:
			return new ChatOpenAI({
				...options,
				configuration: {
					apiKey: providerOptions.apiKey,
					baseURL: providerOptions.baseUrl,
				},
			});
	}
}
