import {ChatOllama} from '@langchain/community/chat_models/ollama';
import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {ChatAnthropic} from '@langchain/anthropic';
import {ChatOpenAI} from '@langchain/openai';
import {ChatGroq} from '@langchain/groq';

import {MAXSettings, ProviderSettings} from '@/features/setting/types';
import {LLM_PROVIDERS} from '@/libs/constants';
import Logger from '../logging';

export default function createChatModelInstance(provider: LLM_PROVIDERS, model: string, setting: MAXSettings) {
	const verbose = false;
	const providerOptions: ProviderSettings = setting.providers[provider];
	const options = {...providerOptions, model, verbose};

	try {
		switch (provider) {
			case LLM_PROVIDERS.OLLAMA:
				return new ChatOllama(options);
			case LLM_PROVIDERS.GOOGLE_GEMINI:
				return new ChatGoogleGenerativeAI(options);
			case LLM_PROVIDERS.GROQ:
				return new ChatGroq(options);
			case LLM_PROVIDERS.ANTHROPIC:
				return new ChatAnthropic(options);
			default:
				return new ChatOpenAI({
					...options,
					apiKey: providerOptions.apiKey || 'api-key',
					configuration: {
						baseURL: providerOptions.baseUrl,
					},
				});
		}
	} catch (error: any) {
		Logger.error(error);
		// new Notice('Failed to create chat model instance: ' + error?.message || error || 'Unknown error');
		throw error;
	}
}
