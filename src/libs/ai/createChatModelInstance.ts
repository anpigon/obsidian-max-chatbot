import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {ChatAnthropic} from '@langchain/anthropic';
import {ChatOpenAI} from '@langchain/openai';
import {ChatGroq} from '@langchain/groq';

import {ChatOllama} from '@langchain/ollama';

import {LLM_PROVIDERS, SAMBANOVA_BASE_URL} from '@/libs/constants';
import {ProviderSettings} from '@/features/setting/types';
import Logger from '../logging';

export default function createChatModelInstance(provider: LLM_PROVIDERS, model: string, providerOptions: ProviderSettings) {
	const verbose = false;
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
			case LLM_PROVIDERS.SAMBANOVA:
				return new ChatOpenAI({
					...options,
					configuration: {baseURL: SAMBANOVA_BASE_URL, apiKey: providerOptions.apiKey},
				});
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
