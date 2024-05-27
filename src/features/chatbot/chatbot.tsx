import {DEFAULT_SETTINGS} from '@/constants';
import {useApp, usePlugin, useSettings} from '@/hooks/useApp';
import {Notice} from 'obsidian';
import type {ChangeEvent, KeyboardEvent} from 'react';
import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {BotMessage} from './components/bot-message';
import {ChatBox} from './components/chat-box';
import {ChatbotContainer} from './components/chatbot-container';
import {ChatbotHeader} from './components/chatbot-header';
import {MessageContainer} from './components/message-container';
import {UserMessage} from './components/user-message';
import {useChatbotState} from './context';
import {useCurrentModel} from './hooks/use-current-model';
import {useGetAiModels} from './hooks/use-get-ai-models';
import {useLLM} from './hooks/use-llm';

export const Chatbot: React.FC = () => {
	const app = useApp();
	const plugin = usePlugin();
	const settings = useSettings();
	const {t} = useTranslation('chatbot');

	const formRef = useRef<HTMLFormElement>(null);
	const chatBoxRef = useRef<HTMLTextAreaElement>(null);
	const messageContainerRef = useRef<HTMLDivElement>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	const chatbotName = settings?.appearance?.chatbotName ?? DEFAULT_SETTINGS.appearance.chatbotName;
	const username = settings?.appearance.userName || DEFAULT_SETTINGS.appearance.userName;

	const providers = useGetAiModels(settings);
	const [currentModel, setCurrentModel] = useCurrentModel(settings);

	const {allowReferenceCurrentNote} = useChatbotState();

	const defaultSystemPrompt = t('You are a helpful assistant');

	const {messages, isStreaming, controller, setMessage, processMessage} = useLLM({
		provider: currentModel.provider,
		model: currentModel.model,
		systemPrompt: defaultSystemPrompt,
		allowReferenceCurrentNote,
		handlers: {
			onMessageAdded() {
				scrollToBottom();
			},
		},
	});

	const scrollToBottom = () => {
		messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
	};

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
	}, [messages]);

	useEffect(() => {
		if (!isStreaming) {
			chatBoxRef.current?.focus();
		}
	}, [isStreaming]);

	const resetInputForm = () => {
		if (formRef.current && chatBoxRef.current) {
			formRef.current.reset();
			chatBoxRef.current.style.height = '';
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!event.shiftKey && event.key === 'Enter') {
			event.preventDefault();

			const value = event.currentTarget.value.trim();
			if (!value.length) {
				return;
			}

			if (!settings.general.model) {
				new Notice('No LLM model selected. Please select a model to proceed.');
				return;
			}

			resetInputForm();
			setMessage(value);
			processMessage(value);
		}
	};

	const handleInput = () => {
		if (!chatBoxRef.current) return;
		chatBoxRef.current.style.height = '';
		chatBoxRef.current.style.height = `${chatBoxRef.current.scrollHeight}px`;
	};

	const handleBlur = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (chatBoxRef.current && !event.target.value) {
			chatBoxRef.current.style.height = '';
		}
	};

	return (
		<ChatbotContainer>
			<ChatbotHeader
				providers={providers}
				botName={chatbotName}
				currentModel={currentModel}
				disabled={isStreaming}
				onChangeModel={(newProvider, newModel) => {
					setCurrentModel(newProvider, newModel);
					settings.general.provider = newProvider;
					settings.general.model = newModel;
					plugin.saveSettings();
				}}
			/>

			<MessageContainer ref={messageContainerRef}>
				{messages.map(({role, content}, i) =>
					role === 'ai' ? <BotMessage key={i} name={chatbotName} message={content} /> : <UserMessage key={i} username={username} message={content} />
				)}
				<div ref={messageEndRef} />
			</MessageContainer>

			<form ref={formRef}>
				<ChatBox
					ref={chatBoxRef}
					canStop={isStreaming}
					disabled={isStreaming}
					onKeyDown={handleKeyDown}
					onInput={handleInput}
					onBlur={handleBlur}
					controller={controller}
				/>
			</form>
		</ChatbotContainer>
	);
};
