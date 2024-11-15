import { requestUrl } from "obsidian";

const obsidianFetchApi = async (
	input: RequestInfo | URL,
	init?: RequestInit
) => {
	try {
		let url: string;
		if (input instanceof URL) {
			url = input.href; // URL 객체는 href로 문자열 추출
		} else if (input instanceof Request) {
			url = input.url; // Request 객체는 url 속성 사용
		} else {
			url = input; // string인 경우 그대로 사용
		}
		const response = await requestUrl({
			url,
			method: init?.method || 'GET',
			headers: init?.headers as Record<string, string>,
			body: init?.body?.toString(),
		});

		return new Response(response.text, {
			status: response.status,
			headers: new Headers(response.headers),
		});
	} catch (error) {
		// @ts-expect-error
		// eslint-disable-next-line no-undef
		console.error("API request failed:", error, error?.response);
		throw error;
	}
};

export default obsidianFetchApi;
