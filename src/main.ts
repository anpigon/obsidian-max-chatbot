// sort-imports-ignore
import './set-process-env-mobile';

import {decode, encode} from '@msgpack/msgpack';
import merge from 'lodash/merge';
import {Editor, Notice, Plugin, TFile, WorkspaceLeaf, normalizePath} from 'obsidian';

import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {VectorStoreBackup} from '@/libs/local-vector-store';
import Logger, {LogLevel} from '@/libs/logging';
import {ChatbotView, VIEW_TYPE_CHATBOT} from '@/views/chatbot-view';
import {MAXSettingTab} from '@/views/setting-view';

import type {MAXSettings} from '@/features/setting/types';

import './i18n';

import {DEFAULT_VECTOR_STORE_NAME, VECTOR_STORE_FILE_EXTENSION} from './constants';
import {ChatMessage} from './features/chatbot/hooks/use-llm';
import generateTitleFromContent from './libs/ai/generate/generateTitleFromContent';
import './styles.css';
import generateSummaryFromContent from './libs/ai/generate/generateSummaryFromContent';

export default class MAXPlugin extends Plugin {
	settings: MAXSettings | undefined;

	async onload() {
		await this.loadSettings();
		this.initializeLogger();
		this.registerViews();
		this.addCommands();
		this.addSettingTab(new MAXSettingTab(this.app, this));
	}

	async generateUniqueFilepath(activeFile: TFile): Promise<string> {
		const fileExtension = '.md';
		const allFiles = this.app.vault.getFiles(); // Retrieve all files from the vault

		let folderName = this.app.vault.getAbstractFileByPath(activeFile?.path || '')?.parent?.path || '';
		if (folderName && !folderName.endsWith('/')) folderName += '/';
		Logger.debug('folderName', folderName);
		Logger.debug('activeFile', activeFile);

		// Function to check if a file name already exists
		const filenameExists = (filename: string | null) => {
			return allFiles.some(file => file.path === folderName + filename + fileExtension);
		};

		let uniqueNameFound = false;
		let modelRenameTitle = '';
		const fileContent = await this.app.vault.read(activeFile);
		while (!uniqueNameFound) {
			modelRenameTitle = await generateTitleFromContent(this.settings!, fileContent);
			if (!filenameExists(modelRenameTitle)) {
				uniqueNameFound = true;
			}
		}

		const filename = folderName + modelRenameTitle + fileExtension;
		Logger.debug('filename', filename);
		return filename;
	}

	// 파일 제목 변경 명령어
	async commandRenameFileTitle() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return;

		try {
			new Notice('Generating title...');
			const newFilepath = await this.generateUniqueFilepath(activeFile);
			await this.app.vault.rename(activeFile, newFilepath);
			new Notice('Renamed note title.');
		} catch (error) {
			Logger.error('Error renaming file title', error);
			new Notice('Failed to rename note title.');
		}
	}

	async commandSummaryText(editor: Editor) {
		try {
			new Notice('Generating summary...');
			const anchor = editor.getCursor('to');
			const selectedText = editor.getSelection();
			Logger.debug('selectedText', selectedText);
			const response = await generateSummaryFromContent(this.settings!, selectedText);
			// TODO: Show response in a modal or a new note
			Logger.debug('response', response);
			editor.replaceRange(`\n\n## Summary\n${response}\n\n`, anchor, anchor);
			new Notice('Summary generated.');
		} catch (error) {
			Logger.error('Error generating summary', error);
			new Notice('Failed to generate summary.');
		}
	}

	onunload() {
		this.app.workspace.getLeavesOfType(VIEW_TYPE_CHATBOT).forEach(leaf => {
			const maxView = leaf.view as ChatbotView;
			if (maxView) {
				this.saveSettings().catch(error => Logger.error(error));
			}
		});
	}

	// 채팅봇 뷰 활성화
	async activateView(): Promise<void> {
		const {workspace} = this.app;
		const leaf = this.findExistingChatbotLeaf() || (await this.createNewChatbotLeaf());
		if (leaf) workspace.revealLeaf(leaf);
	}

	private findExistingChatbotLeaf(): WorkspaceLeaf | null {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CHATBOT);
		return leaves.length > 0 ? leaves[0] : null;
	}

	private async createNewChatbotLeaf(): Promise<WorkspaceLeaf | null> {
		const leaf = this.app.workspace.getRightLeaf(false);
		await leaf?.setViewState({type: VIEW_TYPE_CHATBOT, active: true});
		return leaf;
	}

	// 설정 관련 메서드
	async loadSettings(): Promise<void> {
		const loadedData = (await this.loadData()) as MAXSettings;
		this.settings = merge(DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	// 로거 초기화
	private initializeLogger(): void {
		Logger.setLogLevel(this.settings?.isVerbose ? LogLevel.DEBUG : LogLevel.DISABLED);
		Logger.info('debug mode: on');
	}

	// 뷰 및 명령어 등록
	private registerViews(): void {
		this.registerView(VIEW_TYPE_CHATBOT, leaf => new ChatbotView(leaf, this));
		this.addRibbonIcon('bot', 'MAX Chatbot', () => this.activateView());
	}

	private addCommands(): void {
		this.addCommand({
			id: 'open-max-chatbot',
			name: 'Open MAX Chatbot',
			callback: () => this.activateView(),
		});

		this.addCommand({
			id: 'rename-note-title',
			name: 'Rename Note Title',
			editorCallback: () => this.commandRenameFileTitle(),
		});

		this.addCommand({
			id: 'summary-selected-text',
			name: 'Summary Selected Text',
			editorCheckCallback: (checking, editor) => {
				if (checking) {
					return !!editor.getSelection();
				}
				void this.commandSummaryText(editor);
			},
		});

		this.registerFileMenuEvent();
	}

	private registerFileMenuEvent(): void {
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (!(file instanceof TFile)) return;
				menu.addItem(item => {
					item.setTitle(`${this.manifest.name}: Rename Note Title`).onClick(() => this.commandRenameFileTitle());
				});
			})
		);
	}

	public async getVectorStoreFilepath(storeName?: string): Promise<string> {
		const vectorStoresDir = normalizePath(this.manifest.dir + '/vector_stores');
		if (!(await this.app.vault.adapter.exists(vectorStoresDir))) {
			await this.app.vault.adapter.mkdir(vectorStoresDir);
		}

		const vectorStoreFilepath = normalizePath(vectorStoresDir + `/${storeName || DEFAULT_VECTOR_STORE_NAME}` + VECTOR_STORE_FILE_EXTENSION);
		Logger.info('vectorStoreFilepath', vectorStoreFilepath);

		return vectorStoreFilepath;
	}

	public async saveVectorStoreData(storeName: string, data: VectorStoreBackup): Promise<void> {
		try {
			const normalizedPath = await this.getVectorStoreFilepath(storeName);
			await this.app.vault.adapter.writeBinary(normalizedPath, encode(data));
			Logger.info('Saved vector store data');
		} catch (error) {
			Logger.error('Error saving vector store data', error);
			// Handle error appropriately
		}
	}

	public async loadVectorStoreData(storeName: string): Promise<VectorStoreBackup> {
		try {
			const normalizedPath = await this.getVectorStoreFilepath(storeName);
			const vectorStoreData = await this.app.vault.adapter.readBinary(normalizedPath);
			Logger.info('Loaded vector store data');
			return decode(vectorStoreData) as VectorStoreBackup;
		} catch (error) {
			Logger.error('Error loading vector store data', error);
			// Handle or rethrow error appropriately
			throw error;
		}
	}

	public async getChatHistoryFilepath(fileName = 'sessions'): Promise<string> {
		const chatbotSessionsFilepath = normalizePath(this.manifest.dir + '/sessions');
		if (!(await this.app.vault.adapter.exists(chatbotSessionsFilepath))) {
			await this.app.vault.adapter.mkdir(chatbotSessionsFilepath);
		}
		const chatHistoryFilepath = normalizePath(chatbotSessionsFilepath + `/${fileName}.json`);
		return chatHistoryFilepath;
	}

	public async saveChatHistory(sessionID: string, messages: ChatMessage[]): Promise<void> {
		try {
			const chatSessionsFilepath = await this.getChatHistoryFilepath('sessions');
			const chatbotSessions = (await this.loadJSONData<{sessionID: string; title: string; created: number}[]>(chatSessionsFilepath)) || [];

			const existingSessionIndex = chatbotSessions.findIndex(session => session.sessionID === sessionID);
			if (existingSessionIndex !== -1) {
				chatbotSessions[existingSessionIndex].title = messages[0]?.content || 'chat history';
			} else {
				chatbotSessions.push({
					sessionID,
					title: messages[0]?.content || 'chat history',
					created: Date.now(),
				});
			}
			await this.app.vault.adapter.write(chatSessionsFilepath, JSON.stringify(chatbotSessions));

			const chatHistoryFilepath = await this.getChatHistoryFilepath(sessionID);
			await this.app.vault.adapter.write(
				chatHistoryFilepath,
				JSON.stringify(messages.map(message => ({id: message.id, content: message.content, role: message.role})))
			);
			Logger.info('채팅 기록 저장 완료');
		} catch (error) {
			Logger.error('채팅 기록 저장 중 오류 발생', error);
			// 적절한 오류 처리
		}
	}

	public getChatHistories = async (): Promise<{sessionID: string; title: string; created: number}[]> => {
		const chatSessionsFilepath = await this.getChatHistoryFilepath('sessions');
		return (await this.loadJSONData<{sessionID: string; title: string; created: number}[]>(chatSessionsFilepath)) || [];
	};

	// delete chat history function
	public async deleteChatHistory(sessionID: string): Promise<void> {
		try {
			const chatSessionsFilepath = await this.getChatHistoryFilepath('sessions');
			let chatbotSessions = (await this.loadJSONData<{sessionID: string; title: string; created: number}[]>(chatSessionsFilepath)) || [];
			chatbotSessions = chatbotSessions.filter(session => session.sessionID !== sessionID);
			await this.app.vault.adapter.write(chatSessionsFilepath, JSON.stringify(chatbotSessions));

			const chatHistoryFilepath = await this.getChatHistoryFilepath(sessionID);
			if (await this.app.vault.adapter.exists(chatHistoryFilepath)) {
				await this.app.vault.adapter.remove(chatHistoryFilepath);
			}
			Logger.info('채팅 기록 삭제 완료');
		} catch (error) {
			Logger.error('채팅 기록 삭제 중 오류 발생', error);
			// 적절한 오류 처리
		}
	}

	public async loadChatHistory(sessionID: string): Promise<ChatMessage[] | null> {
		const chatHistoryFilepath = await this.getChatHistoryFilepath(sessionID);
		const chatHistory = await this.loadJSONData<{id: string; content: string; role: string}[]>(chatHistoryFilepath);
		if (chatHistory) {
			return chatHistory as ChatMessage[];
		}
		return null;
	}

	private async loadJSONData<T>(filePath: string): Promise<T | null> {
		try {
			if (await this.app.vault.adapter.exists(filePath)) {
				const json = await this.app.vault.adapter.read(filePath);
				return JSON.parse(json) as T;
			}
		} catch (error) {
			Logger.error('JSON 데이터 로딩 중 오류 발생', error);
		}
		return null;
	}
}
