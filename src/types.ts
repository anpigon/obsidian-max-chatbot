import useChatStream from './hooks/useChatStream';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type UseChatStreamRole = 'bot' | 'user';

export type UseChatStreamChatMessage = {
	role: UseChatStreamRole;
	content: string;
	id: string;
};

export type UseChatStreamHttpOptions = {
	url: string;
	method: HttpMethod;
	query?: Record<string, string>;
	headers?: HeadersInit;
	body?: Record<string, string>;
};

export type UseChatStreamEventHandlers = {
	onMessageAdded: (message: UseChatStreamChatMessage) => void | Promise<void>;
};

export type UseChatStreamInputMethod = {
	type: 'body' | 'query';
	key: string;
};

export type UseChatStreamInput = {
	options: UseChatStreamHttpOptions;
	method: UseChatStreamInputMethod;
	handlers: UseChatStreamEventHandlers;
};

export type UseChatStreamResult = ReturnType<typeof useChatStream>;
