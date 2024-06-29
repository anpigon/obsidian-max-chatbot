import {useTranslation} from 'react-i18next';
import {useEffect, useRef} from 'react';
import {Notice} from 'obsidian';

import type {ChangeEvent, FC, KeyboardEvent} from 'react';

import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {usePlugin, useSettings} from '@/hooks/useApp';
import useOnceEffect from '@/hooks/useOnceEffect';

import {useBoolean} from 'usehooks-ts';

import {MessagesContainer} from './components/messages-container';
import {ChatbotContainer} from './components/chatbot-container';
import {useScrollToBottom} from './hooks/use-scroll-to-bottom';
import {ChatHistories} from './components/chat-histories';
import {ChatbotHeader} from './components/chatbot-header';
import {useCurrentModel} from './hooks/use-current-model';
import {ChatBox} from './components/chat-box';
import {Message} from './components/message';
import {Drawer} from './components/drawer';
import {LLM_PROVIDERS} from '@/constants';
import {useChatbotState} from './context';
import {IconButton} from '@/components';
import {useLLM} from './hooks/use-llm';

export const Chatbot: FC = () => {
	const plugin = usePlugin();
	const settings = useSettings();
	const {t} = useTranslation('chatbot');

	const formRef = useRef<HTMLFormElement>(null);
	const chatBoxRef = useRef<HTMLTextAreaElement>(null);
	const messageContainerRef = useRef<HTMLDivElement>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	const {value: isDrawerOpen, setTrue: handleViewHistory, setFalse: handleCloseDrawer} = useBoolean(false);

	const chatbotName = settings?.appearance?.chatbotName ?? DEFAULT_SETTINGS.appearance.chatbotName;
	const username = settings?.appearance.userName || DEFAULT_SETTINGS.appearance.userName;

	const enabledModels = useEnabledLLMModels();
	const [currentModel, setCurrentModel] = useCurrentModel(settings);

	const {allowReferenceCurrentNote} = useChatbotState();

	const defaultSystemPrompt = t('You are a helpful assistant');

	const scrollToBottom = useScrollToBottom(messageContainerRef);

	const {newSession, sessionID, loadChatHistory, messages, isStreaming, controller, setMessage, processMessage, deleteMessage, updateMessage} = useLLM({
		provider: currentModel.provider,
		model: currentModel.model,
		systemPrompt: defaultSystemPrompt,
		allowReferenceCurrentNote,
		handlers: {onMessageAdded: scrollToBottom},
	});

	useEffect(() => {
		if (!sessionID || !messages.length) return;
		// Save chat history to the file
		plugin.saveChatHistory(sessionID, messages);
	}, [sessionID, messages]);

	useOnceEffect(() => {
		chatBoxRef.current?.focus();
		scrollToBottom();
	});

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({behavior: 'auto', block: 'end'});
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

	const handleChangeModel = (newProvider: LLM_PROVIDERS, newModel: string) => {
		setCurrentModel(newProvider, newModel);
		settings.general.provider = newProvider;
		settings.general.model = newModel;
		plugin.saveSettings();
	};

	const handleStartNewChat = () => {
		controller?.abort();
		newSession();
		resetInputForm();
		scrollToBottom();
	};

	return (
		<ChatbotContainer>
			<ChatbotHeader
				providers={enabledModels}
				botName={chatbotName}
				currentModel={currentModel}
				disabled={isStreaming}
				onChangeModel={handleChangeModel}
				leftComponent={<IconButton label={t('chat history')} icon="history" onClick={handleViewHistory} />}
				rightComponent={<IconButton className="absolute top-2 right-2" label={t('Start new chat')} icon="plus" onClick={handleStartNewChat} />}
			/>
			<Drawer side="left" isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
				<div className="p-4 relative">
					<h3 className="text-lg font-semibold p-0 mt-0 mb-4">{t('Chat History')}</h3>
					<IconButton className="absolute top-4 right-4" label={t('close', {ns: 'common'})} icon="x" onClick={handleCloseDrawer} />
					{isDrawerOpen && <ChatHistories />}
				</div>
			</Drawer>

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
							onDeleteMessage={deleteMessage}
							onEditMessage={updateMessage}
						/>
					) : (
						<Message key={i} id={id} type="user" name={username} message={content} onDeleteMessage={deleteMessage} onEditMessage={updateMessage} />
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
