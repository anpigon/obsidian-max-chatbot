import {TFile, getFrontMatterInfo} from 'obsidian';
import {useState} from 'react';

import {AIMessage, HumanMessage, MessageType, SystemMessage, type BaseMessage} from '@langchain/core/messages';
import {BaseLanguageModelInput} from '@langchain/core/language_models/base';
import {Runnable, RunnableConfig} from '@langchain/core/runnables';
import {StringOutputParser} from '@langchain/core/output_parsers';
import {useApp, usePlugin, useSettings} from '@/hooks/useApp';
import useOnceEffect from '@/hooks/useOnceEffect';
import {LLM_PROVIDERS} from '@/libs/constants';
import Logger from '@/libs/logging';
import {v4 as uuidv4} from 'uuid';

import createChatModelInstance from '@/libs/ai/createChatModelInstance';
import {LLMProviderSettings} from '@/features/setting/types';

export interface UseLLMProps {
	provider: LLM_PROVIDERS;
	model: string;
	systemPrompt: string;
	allowReferenceCurrentNote?: boolean;
	handlers?: UseChatStreamEventHandlers;
}

export interface ChatMessage {
	role: MessageType;
	content: string;
	id: string;
	showLoading?: boolean;
}

interface UseChatStreamEventHandlers {
	onMessageAdded: (message: ChatMessage) => any | Promise<any>;
}

const BOT_ERROR_MESSAGE = 'Something went wrong fetching AI response.';

const createMessageHistory = (messages: ChatMessage[], message: string) => {
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

const messageUtils = {
	create: (message: Omit<ChatMessage, 'id'>): ChatMessage => ({
		...message,
		id: Date.now().toString(36) + '-' + message.role,
	}),

	append: (messages: ChatMessage[], content: string): ChatMessage[] => {
		const latestMessage = messages[messages.length - 1];
		return [...messages.slice(0, -1), {...latestMessage, content: latestMessage.content + content}];
	},

	updateLoading: (messages: ChatMessage[]): ChatMessage[] => {
		const latestMessage = messages[messages.length - 1];
		return [...messages.slice(0, -1), {...latestMessage, showLoading: false}];
	},
};

export const useLLM = ({provider, model, systemPrompt, allowReferenceCurrentNote, handlers}: UseLLMProps) => {
	const app = useApp();
	const plugin = usePlugin();
	const settings = useSettings();

	const isValidProvider = (provider: LLM_PROVIDERS): provider is keyof LLMProviderSettings => {
		return provider in settings.providers;
	};

	if (!isValidProvider(provider)) {
		throw new Error(`Invalid provider: ${provider}`);
	}

	const options = settings.providers[provider];

	const [controller, setController] = useState<AbortController>();
	const [isStreaming, setIsStreaming] = useState(false);
	const [sessionID, setSessionID] = useState<string>(uuidv4());
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [message, setMessage] = useState('');
	const [currentActiveFile, setCurrentActiveFile] = useState<null | TFile>(null);

	const llm = createChatModelInstance(provider, model, settings);
	const outputParser = new StringOutputParser();

	const loadChatHistory = async (sessionID: string) => {
		const chatHistory = await plugin.loadChatHistory(sessionID);
		if (chatHistory) {
			setSessionID(sessionID);
			setMessages(chatHistory);
		}
	};

	const handleNewSession = () => {
		setSessionID(uuidv4());
		setMessages([]);
		setMessage('');
	};

	const handleMessageOperation = (operation: 'delete' | 'edit', id: string, newContent?: string) => {
		setMessages(messages => {
			if (operation === 'delete') {
				return messages.filter(message => message.id !== id);
			} else if (operation === 'edit' && newContent) {
				return messages.map(message => (message.id === id ? {...message, content: newContent} : message));
			}
			return messages;
		});
	};

	const prepareMessages = (message: string) => ({
		humanMessage: addMessage({content: message, role: 'human'}),
		aiMessage: addMessage({content: '', role: 'ai', showLoading: true}),
	});

	const getCurrentNoteContent = async () => {
		if (currentActiveFile?.extension === 'md') {
			const fileCache = app.metadataCache.getFileCache(currentActiveFile);
			const frontmatter = fileCache?.frontmatter as {title: string} | undefined;
			const title = frontmatter?.title || currentActiveFile.basename;
			const content = await app.vault.cachedRead(currentActiveFile);
			const clearFrontMatterContent = content.slice(getFrontMatterInfo(content).contentStart);
			return `\n\n<Notes>\n\n# ${title}\n\n${clearFrontMatterContent}\n\n</Notes>\n\n`;
		}
		return '';
	};

	useOnceEffect(() => {
		const handleFileSwitch = () => {
			const activeFile = app.workspace.getActiveFile();
			setCurrentActiveFile(activeFile);
		};
		handleFileSwitch();

		app.workspace.on('active-leaf-change', handleFileSwitch);

		return () => {
			app.workspace.off('active-leaf-change', handleFileSwitch);
		};
	});

	const processMessage = async (message: string) => {
		setIsStreaming(true);
		const currentNote = allowReferenceCurrentNote ? await getCurrentNoteContent() : '';
		const systemPromptTemplate = messageUtils.create({
			content: (settings.general.systemPrompt || systemPrompt) + currentNote,
			role: 'system',
		});

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
			handleError(error, aiMessage);
		} finally {
			setIsStreaming(false);
			setMessages(messages => messageUtils.updateLoading(messages));
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

	const addMessage = (message: Omit<ChatMessage, 'id'>) => {
		const newMessage = messageUtils.create(message);
		setMessages(messages => [...messages, newMessage]);
		return newMessage;
	};

	const appendMessageToChat = (content: string) => {
		setMessages(messages => messageUtils.append(messages, content));
	};

	const handleError = (error: Error, aiMessage: ChatMessage) => {
		if (error instanceof Error && error.message === 'AbortError') {
			setMessages(messages => messageUtils.append(messages, ' (Request aborted)'));
			return;
		}
		Logger.error('Error invoking LLM:', error);
		const errorMessage = error?.message || BOT_ERROR_MESSAGE;
		appendMessageToChat(errorMessage);
		handlers?.onMessageAdded?.({...aiMessage, content: errorMessage});
	};

	return {
		controller,
		messages,
		setMessages,
		message,
		setMessage,
		isStreaming,
		sessionID,
		processMessage,
		loadChatHistory,
		newSession: handleNewSession,
		deleteMessage: (id: string) => handleMessageOperation('delete', id),
		updateMessage: (id: string, newContent: string) => handleMessageOperation('edit', id, newContent),
	};
};
