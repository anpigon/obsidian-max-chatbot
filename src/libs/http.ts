/* eslint-disable @typescript-eslint/no-explicit-any */
import {RequestUrlParam, requestUrl} from 'obsidian';

export const requestJson = async <T = unknown>(url: string, options?: Omit<RequestUrlParam, 'url' | 'method' | 'contentType'>, timeout = 5000): Promise<T> => {
	// timeout을 5000ms(5초)로 기본 설정
	const timeoutPromise = new Promise<T>((_, reject) => {
		globalThis.setTimeout(() => {
			reject(new Error('Request timed out'));
		}, timeout);
	});

	const requestPromise = requestUrl({
		url,
		method: 'GET',
		contentType: 'application/json',
		...options,
	}).then(response => response.json as unknown as T);

	return Promise.race([requestPromise, timeoutPromise]); // requestPromise와 timeoutPromise 중 먼저 완료되는 것을 반환
};
