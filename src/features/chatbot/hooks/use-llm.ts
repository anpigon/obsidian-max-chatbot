import { LLM_PROVIDERS } from '@/constants';
import { ProviderSettings } from '@/types';
import Logger from '@/utils/logging';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { AIMessage, HumanMessage, MessageType, SystemMessage, type BaseMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import { useState, useTransition } from 'react';

interface UseLLMProps {
	provider: LLM_PROVIDERS;
	model: string;
	options: ProviderSettings;
	handlers?: UseChatStreamEventHandlers;
}

interface UseChatMessage {
	role: MessageType;
	content: string;
	id: string;
}

interface UseChatStreamEventHandlers {
	onMessageAdded: (message: UseChatMessage) => unknown | Promise<unknown>;
}

const BOT_ERROR_MESSAGE = 'Something went wrong fetching AI response.';

const getChatModel = ({ provider, model, options }: Pick<UseLLMProps, 'provider' | 'model' | 'options'>) => {
    const verbose = true;
    switch (provider) {
        case LLM_PROVIDERS.SIONIC_AI:
		case LLM_PROVIDERS.LM_STUDIO:
		case LLM_PROVIDERS.OPEN_AI:
		case LLM_PROVIDERS.REST_API:
            return new ChatOpenAI({ model, apiKey: options.apiKey, configuration: { baseURL: options.baseUrl }, verbose });
        case LLM_PROVIDERS.OLLAMA:
            return new ChatOllama({ ...options, model, baseUrl: options.baseUrl, verbose });
        default:
            // throw new Error(`Provider ${provider} is not supported.`);
			return new ChatOpenAI({ model, apiKey: options.apiKey, configuration: { baseURL: options.baseUrl }, verbose });
    }
};

const createMessageHistory = (messages: UseChatMessage[], message: string) => {
	const history = messages.map(({ role, content }) => {
		switch (role) {
			case 'human':
				return new HumanMessage({ content });
			case 'ai':
				return new AIMessage({ content });
			case 'system':
				return new SystemMessage({ content });
			default:
				return null;
		}
	}).filter(Boolean) as BaseMessage[];

	return [...history, new HumanMessage({ content: message })];
}

export const useLLM = ({provider, model, options, handlers}: UseLLMProps) => {
	const [, startTransition] = useTransition();
	const [controller, setController] = useState<AbortController>();
	const [isStreaming, setIsStreaming] = useState(false);
	const [messages, setMessages] = useState<UseChatMessage[]>([]);
	const [message, setMessage] = useState('');

	const llm = getChatModel({provider, options, model});
	const outputParser = new StringOutputParser();

	const prepareMessages = (message: string) => {
		const humanMessage = addMessage({content: message ?? message, role: 'human'});
		const aiMessage = addMessage({content: '', role: 'ai'});
		return { humanMessage, aiMessage };
	}

	const processMessage = async (message: string) => {
		const messageHistory = createMessageHistory(messages, message);
        const { humanMessage, aiMessage } = prepareMessages(message);

		await handlers?.onMessageAdded?.(humanMessage);
		setMessage('');
		setIsStreaming(true);

		if (controller) controller.abort();
		const newController = new AbortController();
		setController(newController);

		try {
			const chain = llm.bind({signal: newController.signal}).pipe(outputParser);
			Logger.info('Sending message to LLM:', messages);
			const response = await(options.allowStream ? handleStreaming(chain, messageHistory) : handleInvocation(chain, messageHistory));
			Logger.info('Response from LLM:', response);

			await handlers?.onMessageAdded?.({...aiMessage, content: response});
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				// Request was aborted, do not show the notice
				return;
			}
			Logger.error('Error invoking LLM:', error);

			const message = (error as Error)?.message || BOT_ERROR_MESSAGE;
			appendMessageToChat(message);
			await handlers?.onMessageAdded?.({...aiMessage, content: message});

			// new Notice('An error occurred while fetching the response. Please try again later.');
		} finally {
			setIsStreaming(false);
		}
	};

	const handleStreaming = async (chain: Runnable<BaseLanguageModelInput, string, RunnableConfig>, messages: BaseMessage[]) => {
		const stream = await chain.stream(messages);
		let response = '';

		for await (const chunk of stream) {
			appendMessageToChat(chunk);
			response += chunk;
		}

		return response;
	};

	const handleInvocation = async (chain: Runnable<BaseLanguageModelInput, string, RunnableConfig>, messages: BaseMessage[]) => {
		const response = await chain.invoke(messages);
		appendMessageToChat(response);
		return response;
	};

	const addMessage = (message: Omit<UseChatMessage, 'id'>) => {
		const messageWithId = {...message, id: crypto.randomUUID() as string};
		startTransition(() => {
			setMessages(messages => [...messages, messageWithId]);
		});
		return messageWithId;
	};

	const appendMessageToChat = (message: string) => {
		startTransition(() => {
			setMessages(messages => {
				const latestMessage = messages[messages.length - 1];
				return [...messages.slice(0, -1), {...latestMessage, content: latestMessage.content + message}];
			});
		});
	};

	return {
		controller,
		messages,
		setMessages,
		message,
		setMessage,
		isStreaming,
		processMessage,
	};
};
