import {MAXSettings} from '@/types';
import {requestUrl} from 'obsidian';
import OpenAI from 'openai';

// Request response from Ollama
// NOTE: Abort does not work for requestUrl
export async function fetchOllamaResponseEditor(settings: MAXSettings, selectionString: string) {
	const ollamaRESTAPIURL = settings.providers.OLLAMA.baseUrl;

	if (!ollamaRESTAPIURL) {
		return;
	}

	try {
		const response = await requestUrl({
			url: `${ollamaRESTAPIURL}/api/chat`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: settings.general.model,
				messages: [
					{
						role: 'system',
						content: settings.editor.promptSelectGenerateSystemRole,
					},
					{role: 'user', content: selectionString},
				],
				stream: false,
				options: {
					temperature: parseInt(settings.general.temperature),
					num_predict: parseInt(settings.general.maxTokens),
				},
			}),
		});

		const message = response.json.message.content;

		return message;
	} catch (error) {
		console.error('Error making API request:', error);
		throw error;
	}
}

// Request response from openai-based rest api url (editor)
export async function fetchRESTAPIURLDataEditor(settings: MAXSettings, selectionString: string) {
	try {
		const response = await requestUrl({
			url: `${settings.providers.REST_API.baseUrl}/chat/completions`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${settings.providers.REST_API.apiKey}`,
			},
			body: JSON.stringify({
				model: settings.general.model,
				messages: [
					{
						role: 'system',
						content: settings.editor.promptSelectGenerateSystemRole || 'You are a helpful assistant.',
					},
					{role: 'user', content: selectionString},
				],
				max_tokens: parseInt(settings.general.maxTokens) || -1,
				temperature: parseInt(settings.general.temperature),
			}),
		});

		const message = response.json.choices[0].message.content;
		return message;
	} catch (error) {
		console.error('Error making API request:', error);
		throw error;
	}
}

// Fetch Anthropic API Editor
export async function fetchAnthropicResponseEditor(settings: MAXSettings, selectionString: string) {
	try {
		const response = await requestUrl({
			url: 'https://api.anthropic.com/v1/messages',
			method: 'POST',
			headers: {
				'anthropic-version': '2023-06-01',
				'content-type': 'application/json',
				'x-api-key': settings.providers.ANTHROPIC.apiKey,
			},
			body: JSON.stringify({
				model: settings.general.model,
				system: settings.editor.promptSelectGenerateSystemRole,
				messages: [{role: 'user', content: selectionString}],
				max_tokens: parseInt(settings.general.maxTokens) || 4096,
				temperature: parseInt(settings.general.temperature),
			}),
		});

		const message = response.json.content[0].text;
		return message;
	} catch (error) {
		console.error(error);
	}
}

// Fetch Google Gemini API Editor
export async function fetchGoogleGeminiDataEditor(settings: MAXSettings, selectionString: string) {
	try {
		const API_KEY = settings.providers.GOOGLE_GEMINI.apiKey;

		const requestBody = {
			contents: [
				{
					parts: [
						{
							text: settings.editor.promptSelectGenerateSystemRole + selectionString,
						},
					],
				},
			],
		};

		const response = await requestUrl({
			url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		const message = response.json.candidates[0].content.parts[0].text;
		return message;
	} catch (error) {
		console.error(error);
	}
}

// Fetch Mistral API Editor
export async function fetchMistralDataEditor(settings: MAXSettings, selectionString: string) {
	try {
		const response = await requestUrl({
			url: 'https://api.mistral.ai/v1/chat/completions',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${settings.providers.MISTRAL.apiKey}`,
			},
			body: JSON.stringify({
				model: settings.general.model,
				messages: [
					{
						role: 'system',
						content: settings.editor.promptSelectGenerateSystemRole,
					},
					{role: 'user', content: selectionString},
				],
				max_tokens: parseInt(settings.general.maxTokens),
				temperature: parseInt(settings.general.temperature),
			}),
		});

		const message = response.json.choices[0].message.content;
		return message;
	} catch (error) {
		console.error(error);
	}
}

// Fetch OpenAI-Based API Editor
export async function fetchOpenAIBaseAPIResponseEditor(settings: MAXSettings, selectionString: string) {
	const openai = new OpenAI({
		apiKey: settings.providers.OPEN_AI.apiKey,
		baseURL: settings.providers.OPEN_AI.baseUrl,
		dangerouslyAllowBrowser: true, // apiKey is stored within data.json
	});

	const completion = await openai.chat.completions.create({
		model: settings.general.model,
		max_tokens: parseInt(settings.general.maxTokens),
		messages: [
			{
				role: 'system',
				content: settings.editor.promptSelectGenerateSystemRole,
			},
			{role: 'user', content: selectionString},
		],
	});

	const message = completion.choices[0].message.content;
	return message;
}

// Request response from openai-based rest api url (editor)
export async function fetchOpenRouterEditor(settings: MAXSettings, selectionString: string) {
	try {
		const response = await requestUrl({
			url: 'https://openrouter.ai/api/v1/chat/completions',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${settings.providers.OPEN_ROUTER.apiKey}`,
			},
			body: JSON.stringify({
				model: settings.general.model,
				messages: [
					{
						role: 'system',
						content: settings.editor.promptSelectGenerateSystemRole,
					},
					{role: 'user', content: selectionString},
				],
				max_tokens: parseInt(settings.general.maxTokens),
				temperature: parseInt(settings.general.temperature),
			}),
		});

		const message = response.json.choices[0].message.content;
		return message;
	} catch (error) {
		console.error('Error making API request:', error);
		throw error;
	}
}
