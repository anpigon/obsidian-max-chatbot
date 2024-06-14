import './set-process-env-mobile';

import merge from 'lodash/merge';
import {Plugin, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS} from './constants';
import './i18n';
import {MAXSettings} from './types';
import Logger, {LogLvl} from './utils/logging';
import {ChatbotView, VIEW_TYPE_CHATBOT} from './views/chatbot-view';
import {MAXSettingTab} from './views/setting-view';

import './styles.css';

export default class MAXPlugin extends Plugin {
	settings: MAXSettings | undefined;

	async onload() {
		await this.loadSettings();

		Logger.setLogLevel(this.settings?.isVerbose ? LogLvl.DEBUG : LogLvl.DISABLED);
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
}
