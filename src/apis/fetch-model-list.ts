import {GOOGLE_GEMINI_BASE_URL, MISTRAL_BASE_URL, OPEN_AI_MODELS, OPEN_ROUTER_BASE_URL} from '@/constants';
import {ProviderSettings} from '@/types';
import {requestJson} from '@/utils/http';
import {OpenAI} from 'openai';

export async function requestOllamaModels(baseUrl: string) {
	// const json = await requestJson<{models: []}>(`${baseUrl}/api/tags`);
	const response = await fetch(`${baseUrl}/api/tags`);
	const json = await response.json();
	const models = json.models.map((model: {name: string}) => model.name);
	return models;
}

export async function requestLMStudioModels({baseUrl, apiKey}: ProviderSettings) {
	const openai = new OpenAI({
		baseURL: baseUrl,
		apiKey,
		dangerouslyAllowBrowser: true,
	});
	const models = await openai.models.list();
	return models.data
		.map((model: {id: string}) => model.id)
		.map(model =>
			model
				.split('/')
				.filter(model => !model.endsWith('.gguf'))
				.join('/')
		);
}

export async function requestOpenAIModels({baseUrl, apiKey}: ProviderSettings) {
	const excludeModels = [
		'gpt-3.5-turbo-0613',
		'gpt-3.5-turbo-0125',
		'gpt-3.5-turbo-0301',
		'gpt-3.5-turbo-1106',
		'gpt-3.5-turbo-16k-0613',
		'gpt-3.5-turbo-instruct-0914',
		'gpt-4o-2024-05-13',
		'gpt-4-0613',
		'gpt-4-1106-preview',
		'gpt-4-turbo-2024-04-09',
		'gpt-4-vision-preview',
		'gpt-4-1106-vision-preview',
	];
	const openai = new OpenAI({
		baseURL: baseUrl,
		apiKey,
		dangerouslyAllowBrowser: true,
	});
	const models = await openai.models.list();
	return models.data
		.map((model: {id: string}) => model.id)
		.filter((model: string) => model.startsWith('gpt-') && !model.endsWith('-preview') && !excludeModels.includes(model))
		.sort();
}

export async function fetchRestApiModels({baseUrl, apiKey}: ProviderSettings) {
	// URL Validation
	try {
		new URL(baseUrl);
	} catch (error) {
		throw new Error('Invalid REST API URL: ' + baseUrl);
	}

	const jsonData = await requestJson(`${baseUrl}/models`, {
		headers: {Authorization: `Bearer ${apiKey}`},
	});

	// Check if the response is valid
	if (jsonData && (jsonData.data || Array.isArray(jsonData))) {
		let models;
		if (Array.isArray(jsonData)) {
			models = jsonData.map((model: {id: number}) => model.id);
		} else {
			models = jsonData.data.map((model: {id: number}) => model.id);
		}
		return models;
	}

	return [];
}

// Anthropic API models are static. No need to fetch them.

export async function fetchGoogleGeminiModels({apiKey}: ProviderSettings) {
	const jsonData = await requestJson(`${GOOGLE_GEMINI_BASE_URL}/models?key=${apiKey}`);

	// Check if the response is valid and has data
	if (jsonData?.models) {
		const models = jsonData.models.map((model: {name: string}) => model.name).filter((model: string) => model.endsWith('models/gemini-pro'));

		return models;
	}

	return [];
}

export async function fetchMistralModels({apiKey}: ProviderSettings) {
	const jsonData = await requestJson(`${MISTRAL_BASE_URL}/models`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	// Check if the response is valid
	if (jsonData?.data) {
		const models = jsonData.data.map((model: {id: number}) => model.id);
		return models;
	}

	return [];
}

export async function fetchOpenAIBaseModels({baseUrl, apiKey}: ProviderSettings) {
	const openai = new OpenAI({
		baseURL: baseUrl,
		apiKey,
		dangerouslyAllowBrowser: true, // apiKey is stored within data.json
	});

	const list = await openai.models.list();

	if (openai.baseURL === 'https://api.openai.com/v1') {
		return OPEN_AI_MODELS;
	} else {
		const models = list.data.map(model => model.id);
		return models;
	}
}

export async function fetchOpenRouterModels({baseUrl, apiKey}: ProviderSettings) {
	const jsonData = await requestJson(`${OPEN_ROUTER_BASE_URL}/models`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	// Check if the response is valid
	if (jsonData && (jsonData.data || Array.isArray(jsonData))) {
		let models;
		if (Array.isArray(jsonData)) {
			models = jsonData.map((model: {id: number}) => model.id);
		} else {
			models = jsonData.data.map((model: {id: number}) => model.id);
		}
		return models;
	}

	return [];
}
