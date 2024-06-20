import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {useApp, usePlugin, useSettings} from '@/hooks/useApp';
import useOnceEffect from '@/hooks/useOnceEffect';
import {Notice} from 'obsidian';
import type {ChangeEvent, KeyboardEvent} from 'react';
import {useEffect, useRef, useTransition} from 'react';
import {useTranslation} from 'react-i18next';
import {ChatBox} from './components/chat-box';
import {ChatbotContainer} from './components/chatbot-container';
import {ChatbotHeader} from './components/chatbot-header';
import {Message} from './components/message';
import {MessagesContainer} from './components/messages-container';
import {useChatbotState} from './context';
import {useCurrentModel} from './hooks/use-current-model';
import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {useLLM} from './hooks/use-llm';

export const Chatbot: React.FC = () => {
	const app = useApp();
	const plugin = usePlugin();
	const settings = useSettings();
	const {t} = useTranslation('chatbot');
	const [, startTransition] = useTransition();

	const formRef = useRef<HTMLFormElement>(null);
	const chatBoxRef = useRef<HTMLTextAreaElement>(null);
	const messageContainerRef = useRef<HTMLDivElement>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	const chatbotName = settings?.appearance?.chatbotName ?? DEFAULT_SETTINGS.appearance.chatbotName;
	const username = settings?.appearance.userName || DEFAULT_SETTINGS.appearance.userName;

	const enabledModels = useEnabledLLMModels();
	const [currentModel, setCurrentModel] = useCurrentModel(settings);

	const {allowReferenceCurrentNote} = useChatbotState();

	const defaultSystemPrompt = t('You are a helpful assistant');

	const {messages, setMessages, isStreaming, controller, setMessage, processMessage} = useLLM({
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
		// messageContainerRef.current?.scrollTo(0, messageContainerRef.current.scrollHeight);
		messageContainerRef.current?.scroll({
			top: messageContainerRef.current?.scrollHeight,
			behavior: 'smooth',
		});
	};

	useOnceEffect(() => {
		chatBoxRef.current?.focus();
		scrollToBottom();
	});

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

	const handleDeleteMessage = (id: string) => {
		setMessages(messages.filter(message => message.id !== id));
	};

	const handleEditMessage = (id: string, message: string) => {
		const messageToEdit = messages.find(m => m.id === id);
		if (messageToEdit) {
			messageToEdit.content = message;
			setMessages([...messages]);
		}
	};

	return (
		<ChatbotContainer>
			<ChatbotHeader
				providers={enabledModels}
				botName={chatbotName}
				currentModel={currentModel}
				disabled={isStreaming}
				onChangeModel={(newProvider, newModel) => {
					setCurrentModel(newProvider, newModel);
					settings.general.provider = newProvider;
					settings.general.model = newModel;
					plugin.saveSettings();
				}}
				onStartNewChat={() => {
					controller?.abort();
					startTransition(() => {
						setMessages([]);
						setMessage('');
						resetInputForm();
						scrollToBottom();
					});
				}}
			/>

			<MessagesContainer ref={messageContainerRef}>
				{messages.map(({role, content, id, showLoading}, i) =>
					role === 'ai' ? (
						<Message
							key={id}
							id={id}
							type="bot"
							name={chatbotName}
							message={content}
							showLoading={showLoading}
							onDeleteMessage={handleDeleteMessage}
							onEditMessage={handleEditMessage}
						/>
					) : (
						<Message
							key={i}
							id={id}
							type="user"
							name={username}
							message={content}
							onDeleteMessage={handleDeleteMessage}
							onEditMessage={handleEditMessage}
						/>
					)
				)}
				<div ref={messageEndRef} />
			</MessagesContainer>

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
