/* eslint-disable @typescript-eslint/no-explicit-any */
import {ClientOptions} from '@langchain/openai';
import {requestUrl} from 'obsidian';
import Logger from './logging';

export const requestFetch: ClientOptions['fetch'] = async (url, init) => {
	Logger.info(url, init);
	const headers = init?.headers as unknown as Record<string, string>;
	const body = JSON.stringify(JSON.parse(`${init?.body ?? {}}`));

	const response = await requestUrl({
		url: `${url}`,
		method: 'POST',
		headers,
		body,
	});
	Logger.info('response', response.json);
	return response.json as unknown as Promise<Response>;
};
