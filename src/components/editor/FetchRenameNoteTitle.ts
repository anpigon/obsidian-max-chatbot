/* eslint-disable @typescript-eslint/no-explicit-any */
import {Notice, requestUrl} from 'obsidian';
import OpenAI from 'openai';
import {MAXSettings} from '@/types';
import {ANTHROPIC_MODELS, OPEN_AI_MODELS} from '@/constants';

// Rename note title based on specified model
export async function fetchModelRenameTitle(settings: MAXSettings, referenceCurrentNoteContent: string) {
	const clearYamlContent = referenceCurrentNoteContent.replace(/---[\s\S]+?---/, '').trim();

	const prompt = `You are a title generator. You will give succinct titles that does not contain backslashes,
                    forward slashes, or colons. Generate a title as your response.\n\n`;

	try {
		if (settings.providers.OLLAMA.baseUrl && settings.providers.OLLAMA.models.includes(settings.general.model)) {
			const url = `${settings.providers.OLLAMA.baseUrl}/api/generate`;

			const requestBody = {
				prompt: `${prompt}\n\n${clearYamlContent}\n\n`,
				model: settings.general.model,
				stream: false,
				options: {
					temperature: parseInt(settings.general.temperature),
					num_predict: 40,
				},
			};

			const response = await requestUrl({
				url,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			const parseText = JSON.parse(response.text);
			let title = parseText.response;

			// Remove backslashes, forward slashes, colons, and quotes
			if (title) {
				title = title.replace(/[\\/:"]/g, '');
			}

			return title;
		} else if (settings.providers.REST_API.models.includes(settings.general.model)) {
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
							{role: 'system', content: prompt + clearYamlContent},
							{role: 'user', content: '\n'},
						],
						max_tokens: 40,
					}),
				});

				let title = response.json.choices[0].message.content;

				// Remove backslashes, forward slashes, colons, and quotes
				if (title) {
					title = title.replace(/[\\/:"]/g, '');
				}
				return title;
			} catch (error) {
				console.error('Error making API request:', error);
				throw error;
			}
		} else if (ANTHROPIC_MODELS.includes(settings.general.model)) {
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
						system: prompt,
						messages: [{role: 'user', content: `${clearYamlContent}`}],
						max_tokens: 40,
						temperature: parseInt(settings.general.temperature),
					}),
				});

				let title = response.json.content[0].text;

				// Remove backslashes, forward slashes, colons, and quotes
				if (title) {
					title = title.replace(/[\\/:"]/g, '');
				}
				return title;
			} catch (error: any) {
				new Notice(error);
				console.error(error);
				throw error;
			}
		} else if (settings.providers.GOOGLE_GEMINI.models.includes(settings.general.model)) {
			try {
				const API_KEY = settings.providers.GOOGLE_GEMINI.apiKey;

				const requestBody = {
					contents: [
						{
							parts: [{text: prompt + clearYamlContent}],
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

				let title = response.json.candidates[0].content.parts[0].text;
				// Remove backslashes, forward slashes, colons, and quotes
				if (title) {
					title = title.replace(/[\\/:"]/g, '');
				}
				return title;
			} catch (error) {
				console.error(error);
			}
		} else if (settings.providers.MISTRAL.models.includes(settings.general.model)) {
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
							{role: 'system', content: prompt + clearYamlContent},
							{role: 'user', content: '\n'},
						],
						max_tokens: 40,
					}),
				});

				let title = response.json.choices[0].message.content;

				// Remove backslashes, forward slashes, colons, and quotes
				if (title) {
					title = title.replace(/[\\/:"]/g, '');
				}
				return title;
			} catch (error) {
				console.error(error);
			}
		} else if (OPEN_AI_MODELS.includes(settings.general.model) || settings.providers.OPEN_AI.models.includes(settings.general.model)) {
			const openai = new OpenAI({
				apiKey: settings.providers.OPEN_AI.apiKey,
				baseURL: settings.providers.OPEN_AI.baseUrl,
				dangerouslyAllowBrowser: true, // apiKey is stored within data.json
			});

			const chatCompletion = await openai.chat.completions.create({
				model: settings.general.model,
				max_tokens: 40,
				messages: [
					{role: 'system', content: prompt + clearYamlContent},
					{role: 'user', content: ''},
				],
			});

			let title = chatCompletion.choices[0].message.content;
			// Remove backslashes, forward slashes, colons, and quotes
			if (title) {
				title = title.replace(/[\\/:"]/g, '');
			}

			return title;
		} else if (settings.providers.OPEN_ROUTER.models.includes(settings.general.model)) {
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
							{role: 'system', content: prompt + clearYamlContent},
							{role: 'user', content: '\n'},
						],
						max_tokens: 40,
					}),
				});

				let title = response.json.choices[0].message.content;

				// Remove backslashes, forward slashes, colons, and quotes
				if (title) {
					title = title.replace(/[\\/:"]/g, '');
				}
				return title;
			} catch (error) {
				console.error('Error making API request:', error);
				throw error;
			}
		} else {
			throw new Error('Invalid model selected for renaming note title. Please check your settings.');
		}
	} catch (error: any) {
		console.log('ERROR');
		throw new Error(error.response?.data?.error || error.message);
	}
}
