import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {ChatAnthropic} from '@langchain/anthropic';
import {ChatOpenAI} from '@langchain/openai';
import {ChatGroq} from '@langchain/groq';

import {ChatOllama} from '@langchain/ollama';

import {providerBaseUrls} from '../constants/provider-base-urls';
import {MAXSettings} from '@/features/setting/types';
import getProviderOptions from './getProviderOptions';
import {LLM_PROVIDERS} from '@/libs/constants';
import Logger from '../logging';

export default function createChatModelInstance(provider: LLM_PROVIDERS, model: string, settings: MAXSettings) {
	const verbose = false;
	const providerOptions = getProviderOptions(provider, settings);
	const options = {...providerOptions, model, verbose};

	try {
		const apiKey = providerOptions.apiKey || 'api-key';
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
					apiKey,
					configuration: {
						baseURL: options.baseUrl || providerBaseUrls[provider],
						apiKey,
					},
				});
		}
	} catch (error) {
		Logger.error(error);
		// new Notice('Failed to create chat model instance: ' + error?.message || error || 'Unknown error');
		throw error;
	}
}
