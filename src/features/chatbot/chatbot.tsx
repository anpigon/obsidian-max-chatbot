import {useTranslation} from 'react-i18next';
import {useEffect, useRef} from 'react';
import {Notice} from 'obsidian';

import type {ChangeEvent, FC, KeyboardEvent} from 'react';

import {usePlugin, useSettings} from '@/hooks/useApp';
import useOnceEffect from '@/hooks/useOnceEffect';

import {useBoolean} from 'usehooks-ts';

import {MessagesContainer} from './components/messages-container';
import {ChatbotContainer} from './components/chatbot-container';
import {MessageInputBox} from './components/message-input-box';
import {useScrollToBottom} from './hooks/use-scroll-to-bottom';
import {ChatHistories} from './components/chat-histories';
import {Message} from './components/message';
import {Drawer} from './components/drawer';
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

	const {allowReferenceCurrentNote} = useChatbotState();

	const defaultSystemPrompt = t('You are a helpful assistant');

	const scrollToBottom = useScrollToBottom(messageContainerRef);

	const {newSession, sessionID, loadChatHistory, messages, isStreaming, controller, setMessage, processMessage, deleteMessage, updateMessage} = useLLM({
		systemPrompt: defaultSystemPrompt,
		allowReferenceCurrentNote,
		handlers: {onMessageAdded: scrollToBottom},
	});

	useEffect(() => {
		if (!sessionID || !messages.length) return;
		// Save chat history to the file
		void plugin.saveChatHistory(sessionID, messages);
	}, [sessionID, messages]);

	useOnceEffect(() => {
		chatBoxRef.current?.focus();
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
			void processMessage(value);
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

	const handleStartNewChat = () => {
		controller?.abort();
		newSession();
		resetInputForm();
		scrollToBottom();
	};

	return (
		<ChatbotContainer>
			<div className="py-4 px-0 text-center relative">
				<IconButton className="absolute top-2 left-2" label={t('chat history')} icon="history" onClick={handleViewHistory} />
				<IconButton className="absolute top-2 right-2" label={t('Start new chat')} icon="plus" onClick={handleStartNewChat} />
			</div>

			<Drawer side="left" isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
				<div className="p-4 relative">
					<h3 className="text-lg font-semibold p-0 mt-0 mb-4">{t('Chat History')}</h3>
					<IconButton className="absolute top-4 right-4" label={t('close', {ns: 'common'})} icon="x" onClick={handleCloseDrawer} />
					{isDrawerOpen && (
						<ChatHistories
							onSelect={(sessionID: string) => {
								handleCloseDrawer();
								void loadChatHistory(sessionID);
							}}
						/>
					)}
				</div>
			</Drawer>

			<MessagesContainer ref={messageContainerRef}>
				{messages.map(({role, content, id, showLoading}, i) =>
					role === 'ai' ? (
						<Message
							key={id}
							id={id}
							type="bot"
							name="AI"
							message={content}
							showLoading={showLoading}
							onDeleteMessage={deleteMessage}
							onEditMessage={updateMessage}
						/>
					) : (
						<Message key={i} id={id} type="user" name="USER" message={content} onDeleteMessage={deleteMessage} onEditMessage={updateMessage} />
					)
				)}
				<div ref={messageEndRef} />
			</MessagesContainer>

			<form ref={formRef}>
				<MessageInputBox
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
