import {LLM_PROVIDERS} from '@/constants';
import {useApp} from '@/hooks/useApp';
import {currentActiveFile} from '@/main';
import {ProviderSettings} from '@/types';
import Logger from '@/utils/logging';
import {ChatOllama} from '@langchain/community/chat_models/ollama';
import {BaseLanguageModelInput} from '@langchain/core/language_models/base';
import {AIMessage, HumanMessage, MessageType, SystemMessage, type BaseMessage} from '@langchain/core/messages';
import {StringOutputParser} from '@langchain/core/output_parsers';
import {Runnable, RunnableConfig} from '@langchain/core/runnables';
import {ChatOpenAI} from '@langchain/openai';
import {getFrontMatterInfo} from 'obsidian';
import {useState, useTransition} from 'react';

interface UseLLMProps {
	provider: LLM_PROVIDERS;
	model: string;
	options: ProviderSettings;
	systemPrompt: string;
	allowReferenceCurrentNote?: boolean;
	handlers?: UseChatStreamEventHandlers;
}

interface UseChatMessage {
	role: MessageType;
	content: string;
	id: string;
}

interface UseChatStreamEventHandlers {
	onMessageAdded: (message: UseChatMessage) => any | Promise<any>;
}

const BOT_ERROR_MESSAGE = 'Something went wrong fetching AI response.';

const getChatModel = ({provider, model, options}: Pick<UseLLMProps, 'provider' | 'model' | 'options'>) => {
	const verbose = false;
	if (provider === LLM_PROVIDERS.OLLAMA) {
		return new ChatOllama({...options, model, baseUrl: options.baseUrl, verbose});
	}
	return new ChatOpenAI({model, apiKey: options.apiKey || 'api-key', configuration: {baseURL: options.baseUrl}, verbose});
};

const createMessageHistory = (messages: UseChatMessage[], message: string) => {
	const history = messages
		.map(({role, content}) => {
			switch (role) {
				case 'human':
					return new HumanMessage({content});
				case 'ai':
					return new AIMessage({content});
				case 'system':
					return new SystemMessage({content});
				default:
					return null;
			}
		})
		.filter(Boolean) as BaseMessage[];

	return [...history, new HumanMessage({content: message})];
};

export const useLLM = ({provider, model, systemPrompt, allowReferenceCurrentNote, options, handlers}: UseLLMProps) => {
	const app = useApp();
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
		return {humanMessage, aiMessage};
	};

	const getCurrentNoteContent = async () => {
		if (currentActiveFile?.extension === 'md') {
			const title = app.metadataCache.getFileCache(currentActiveFile)?.frontmatter?.title || currentActiveFile.basename;
			const content = await app.vault.cachedRead(currentActiveFile);
			const clearFrontMatterContent = content.slice(getFrontMatterInfo(content).contentStart);
			return '\n\n' + '<Additional Note>' + `\n\n# ${title}\n\n` + clearFrontMatterContent + '\n\n</Additional Note>\n\n';
		}
		return '';
	};

	const processMessage = async (message: string) => {
		setIsStreaming(true);

		const currentNote = allowReferenceCurrentNote ? await getCurrentNoteContent() : '';

		const systemPromptTemplate: UseChatMessage = {
			content: systemPrompt + currentNote,
			role: 'system',
			id: crypto.randomUUID() as string,
		};

		const messageHistory = createMessageHistory([systemPromptTemplate, ...messages], message);
		const {humanMessage, aiMessage} = prepareMessages(message);

		await handlers?.onMessageAdded?.(humanMessage);
		setMessage('');

		if (controller) controller.abort();
		const newController = new AbortController();
		setController(newController);

		try {
			const chain = llm.bind({signal: newController.signal}).pipe(outputParser);
			Logger.info('Sending message to LLM:', messageHistory);
			const response = await (options.allowStream ? handleStreaming(chain, messageHistory) : handleInvocation(chain, messageHistory));
			Logger.info('Response from LLM:', response);

			await handlers?.onMessageAdded?.({...aiMessage, content: response});
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				// Request was aborted, do not show the notice
				setMessages(messages => {
					const latestMessage = messages[messages.length - 1];
					if (latestMessage.role === 'ai' && latestMessage.content === '') {
						return [...messages.slice(0, -1), {...latestMessage, content: latestMessage.content + ' (Request aborted)'}];
					}
					return messages;
				});
				return;
			}
			Logger.error('Error invoking LLM:', error);

			const errorMessage = (error as Error)?.message || BOT_ERROR_MESSAGE;
			appendMessageToChat(errorMessage);
			await handlers?.onMessageAdded?.({...aiMessage, content: errorMessage});

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
