import './set-process-env-mobile';

import merge from 'lodash/merge';
import {Plugin, WorkspaceLeaf, normalizePath} from 'obsidian';

import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import type {MAXSettings} from '@/features/setting/types';
import Logger, {LogLevel} from './utils/logging';
import {ChatbotView, VIEW_TYPE_CHATBOT} from './views/chatbot-view';
import {MAXSettingTab} from './views/setting-view';

import './i18n';

import './styles.css';
import {decode, encode} from '@msgpack/msgpack';
import {VectorStoreBackup} from './utils/local-vector-store';

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

		this.addSettingTab(new MAXSettingTab(this.app, this));
	}

	onunload() {
		this.app.workspace.getLeavesOfType(VIEW_TYPE_CHATBOT).forEach(leaf => {
			const maxView = leaf.view as ChatbotView;
			if (maxView) {
				this.saveSettings();
			}
		});
	}

	async activateView() {
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

	async loadSettings() {
		const loadedData = (await this.loadData()) as MAXSettings;
		this.settings = merge(DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	public async getVectorStoreFilepath(storeName?: string) {
		const vectorStoresDir = normalizePath(this.manifest.dir + '/vector_stores');
		if (!(await this.app.vault.adapter.exists(vectorStoresDir))) {
			await this.app.vault.adapter.mkdir(vectorStoresDir);
		}

		const vectorStoreFilepath = normalizePath(vectorStoresDir + `/${storeName || 'vector_store'}` + '.bin');
		Logger.info('vectorStoreFilepath', vectorStoreFilepath);

		return vectorStoreFilepath;
	}

	public async saveVectorStoreData(storeName: string, data: VectorStoreBackup) {
		const normalizedPath = await this.getVectorStoreFilepath(storeName);
		await this.app.vault.adapter.writeBinary(normalizedPath, encode(data));
		Logger.info('Saved vector store data');
	}

	public async loadVectorStoreData(storeName: string) {
		const normalizedPath = await this.getVectorStoreFilepath(storeName);
		const vectorStoreData = await this.app.vault.adapter.readBinary(normalizedPath);
		Logger.info('Loaded vector store data');
		return decode(vectorStoreData) as VectorStoreBackup;
	}
}
