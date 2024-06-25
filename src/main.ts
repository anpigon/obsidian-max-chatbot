// sort-imports-ignore
import './set-process-env-mobile';

import {decode, encode} from '@msgpack/msgpack';
import merge from 'lodash/merge';
import {Notice, Plugin, TFile, WorkspaceLeaf, normalizePath} from 'obsidian';

import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {VectorStoreBackup} from '@/libs/local-vector-store';
import Logger, {LogLevel} from '@/libs/logging';
import {ChatbotView, VIEW_TYPE_CHATBOT} from '@/views/chatbot-view';
import {MAXSettingTab} from '@/views/setting-view';

import type {MAXSettings} from '@/features/setting/types';

import './i18n';

import {DEFAULT_VECTOR_STORE_NAME, VECTOR_STORE_FILE_EXTENSION} from './constants';
import generateTitleFromContent from './libs/ai/generate/generateTitleFromContent';
import './styles.css';

export default class MAXPlugin extends Plugin {
	settings: MAXSettings | undefined;

	async onload() {
		await this.loadSettings();

		Logger.setLogLevel(this.settings?.isVerbose ? LogLevel.DEBUG : LogLevel.DISABLED);
		Logger.info('debug mode: on');

		this.registerView(VIEW_TYPE_CHATBOT, leaf => new ChatbotView(leaf, this));

		this.addCommand({
			id: 'open-max-chatbot',
			name: 'Open MAX Chatbot',
			callback: () => this.activateView(),
		});
		this.addRibbonIcon('bot', 'MAX Chatbot', () => this.activateView());

		this.addCommand({
			id: 'rename-note-title',
			name: 'Rename Note Title',
			editorCallback: () => this.commandRenameFileTitle(),
		});
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (!(file instanceof TFile)) return;
				menu.addItem(item => {
					item.setTitle(`${this.manifest.name}: Rename Note Title`).onClick(() => this.commandRenameFileTitle());
				});
			})
		);

		this.addSettingTab(new MAXSettingTab(this.app, this));
	}

	async commandRenameFileTitle() {
		const fileExtension = '.md';
		const allFiles = this.app.vault.getFiles(); // Retrieve all files from the vault
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			return;
		}

		let folderName = this.app.vault.getAbstractFileByPath(activeFile?.path || '')?.parent?.path || '';
		if (folderName && !folderName.endsWith('/')) folderName += '/';
		Logger.debug('folderName', folderName);
		Logger.debug('activeFile', activeFile);

		// Function to check if a file name already exists
		const filenameExists = (filename: string | null) => {
			return allFiles.some(file => file.path === folderName + filename + fileExtension);
		};

		try {
			new Notice('Generating title...');

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
			await this.app.vault.rename(activeFile, filename);

			new Notice('Renamed note title.');
		} catch (error) {
			Logger.error(error);
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

	async activateView(): Promise<void> {
		const {workspace} = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_CHATBOT);

		if (leaves.length > 0) {
			// 이미 존재하는 리프 사용
			leaf = leaves[0];
		} else {
			// 워크스페이스에서 뷰를 찾을 수 없으므로
			// 새로운 리프를 우측 사이드바에 생성
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({type: VIEW_TYPE_CHATBOT, active: true});
		}

		// 리프(leaf)가 접힌 사이드바에 있는 경우 "표시(Reveal)" 합니다.
		if (leaf) workspace.revealLeaf(leaf);
	}

	async loadSettings(): Promise<void> {
		const loadedData = (await this.loadData()) as MAXSettings;
		this.settings = merge(DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
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
}
