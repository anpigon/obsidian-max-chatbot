import {ClientOptions} from '@langchain/openai';
import {requestUrl} from 'obsidian';
import Logger from './logging';

export const requestFetch: ClientOptions['fetch'] = async (req, init) => {
	Logger.info(req, init);
	const headers = init?.headers as unknown as Record<string, string>;
	const body = init?.body ? JSON.stringify(JSON.parse(init.body as string)) : '{}';

	const url = req instanceof Request ? req.url : req;
	const response = await requestUrl({
		url,
		method: 'POST',
		headers,
		body,
	});
	Logger.info('response', response.json);
	return response.json as unknown as Promise<Response>;
};
