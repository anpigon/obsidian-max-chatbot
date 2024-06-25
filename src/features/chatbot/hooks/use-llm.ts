import {ChatOllama} from '@langchain/community/chat_models/ollama';
import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {TFile, getFrontMatterInfo} from 'obsidian';
import {useState, useTransition} from 'react';
import {ChatOpenAI} from '@langchain/openai';
import {ChatGroq} from '@langchain/groq';

import {AIMessage, HumanMessage, MessageType, SystemMessage, type BaseMessage} from '@langchain/core/messages';
import {BaseLanguageModelInput} from '@langchain/core/language_models/base';
import {Runnable, RunnableConfig} from '@langchain/core/runnables';
import {StringOutputParser} from '@langchain/core/output_parsers';
import useOnceEffect from '@/hooks/useOnceEffect';
import {LLM_PROVIDERS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import Logger from '@/utils/logging';

import type {ProviderSettings} from '@/features/setting/types';

interface UseLLMProps {
	provider: LLM_PROVIDERS;
	model: string;
	systemPrompt: string;
	allowReferenceCurrentNote?: boolean;
	handlers?: UseChatStreamEventHandlers;
}

interface UseChatMessage {
	role: MessageType;
	content: string;
	id: string;
	showLoading?: boolean;
}

interface UseChatStreamEventHandlers {
	onMessageAdded: (message: UseChatMessage) => any | Promise<any>;
}

const BOT_ERROR_MESSAGE = 'Something went wrong fetching AI response.';

const getChatModel = (provider: LLM_PROVIDERS, model: string, options: ProviderSettings) => {
	const verbose = false;
	const commonOptions = {...options, model, verbose};

	switch (provider) {
		case LLM_PROVIDERS.OLLAMA:
			return new ChatOllama({...commonOptions, baseUrl: options.baseUrl});
		case LLM_PROVIDERS.GOOGLE_GEMINI:
			return new ChatGoogleGenerativeAI({...commonOptions, baseUrl: options.baseUrl});
		case LLM_PROVIDERS.GROQ:
			return new ChatGroq(commonOptions);
		default:
			return new ChatOpenAI({
				model,
				apiKey: options.apiKey || 'api-key',
				configuration: {baseURL: options.baseUrl},
				verbose,
			});
	}
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

export const useLLM = ({provider, model, systemPrompt, allowReferenceCurrentNote, handlers}: UseLLMProps) => {
	const plugin = usePlugin();
	const app = plugin.app;
	const settings = plugin.settings!;
	const options = settings.providers[provider];

	const [, startTransition] = useTransition();
	const [controller, setController] = useState<AbortController>();
	const [isStreaming, setIsStreaming] = useState(false);
	const [messages, setMessages] = useState<UseChatMessage[]>([]);
	const [message, setMessage] = useState('');
	const [currentActiveFile, setCurrentActiveFile] = useState<null | TFile>(null);

	const llm = getChatModel(provider, model, options);
	const outputParser = new StringOutputParser();

	const prepareMessages = (message: string) => {
		const humanMessage = addMessage({content: message, role: 'human'});
		const aiMessage = addMessage({content: '', role: 'ai', showLoading: true});
		return {humanMessage, aiMessage};
	};

	const getCurrentNoteContent = async () => {
		if (currentActiveFile?.extension === 'md') {
			const title = app.metadataCache.getFileCache(currentActiveFile)?.frontmatter?.title || currentActiveFile.basename;
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

		console.log('Processing message:', message);
		console.log('Current active file:', currentActiveFile);
		console.log('Allow reference current note:', allowReferenceCurrentNote);
		const currentNote = allowReferenceCurrentNote ? await getCurrentNoteContent() : '';

		const systemPromptTemplate: UseChatMessage = {
			content: (settings.general.systemPrompt || systemPrompt) + currentNote,
			role: 'system',
			id: Date.now().toString(36) + '-system',
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
			handleError(error, aiMessage);
		} finally {
			setIsStreaming(false);
			updateLoadingState();
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
		const messageWithId = {...message, id: Date.now().toString(36) + '-' + message.role};
		startTransition(() => {
			setMessages(messages => [...messages, messageWithId]);
		});
		return messageWithId;
	};

	const appendMessageToChat = (message: string) => {
		startTransition(() => {
			setMessages(messages => {
				const latestMessage = messages[messages.length - 1];
				return [
					...messages.slice(0, -1),
					{
						...latestMessage,
						content: latestMessage.content + message,
					},
				];
			});
		});
	};

	const handleError = (error: any, aiMessage: UseChatMessage) => {
		if (error instanceof Error && error.message === 'AbortError') {
			handleAbortError();
			return;
		}
		Logger.error('Error invoking LLM:', error);

		const errorMessage = (error as Error)?.message || BOT_ERROR_MESSAGE;
		appendMessageToChat(errorMessage);
		handlers?.onMessageAdded?.({...aiMessage, content: errorMessage});
	};

	const handleAbortError = () => {
		setMessages(messages => {
			if (messages.length === 0) return messages;
			const latestMessage = messages[messages.length - 1];
			if (latestMessage.role === 'ai' && latestMessage.content === '') {
				return [...messages.slice(0, -1), {...latestMessage, content: latestMessage.content + ' (Request aborted)'}];
			}
			return messages;
		});
	};

	const updateLoadingState = () => {
		setMessages(messages => {
			const latestMessage = messages[messages.length - 1];
			return [
				...messages.slice(0, -1),
				{
					...latestMessage,
					showLoading: false,
				},
			];
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
