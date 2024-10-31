import {OpenAI} from 'openai';

import {GOOGLE_GEMINI_BASE_URL, GROQ_BASE_URL, MISTRAL_BASE_URL, OPEN_AI_MODELS, OPEN_ROUTER_BASE_URL} from '@/constants';
import {requestJson} from '@/libs/http';
import Logger from '@/libs/logging';

import type {ProviderSettings} from '@/features/setting/types';

export async function requestOllamaModels(baseUrl: string) {
	// const json = await requestJson<{models: []}>(`${baseUrl}/api/tags`);
	const response = await globalThis.fetch(`${baseUrl}/api/tags`);
	const json = (await response.json()) as {models: {name: string}[]};
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
		Logger.error(error);
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

interface GoogleGeminiModel {
	description: string;
	displayName: string;
	inputTokenLimit: number;
	name: string;
	outputTokenLimit: number;
	supportedGenerationMethods: string[];
	temperature: number;
	topP: number;
	version: string;
}

export async function fetchGoogleGeminiModels({apiKey}: Pick<ProviderSettings, 'apiKey'>) {
	const jsonData = await requestJson<{models: GoogleGeminiModel[]}>(`${GOOGLE_GEMINI_BASE_URL}/models?key=${apiKey}`);
	return jsonData.models;
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

interface GroqModel {
	id: string;
	object: string;
	created: number;
	context_window: number;
	owned_by: string;
	active: true;
}

export async function fetchGroqModels({apiKey}: Pick<ProviderSettings, 'apiKey'>) {
	const jsonData = await requestJson<{
		object: 'list';
		data: GroqModel[];
	}>(`${GROQ_BASE_URL}/models`, {
		headers: {Authorization: `Bearer ${apiKey}`},
	});
	return jsonData.data;
}
