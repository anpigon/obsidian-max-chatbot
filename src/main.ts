import merge from 'lodash/merge';
import {DataWriteOptions, Platform, Plugin, TFile, WorkspaceLeaf} from 'obsidian';
import {DEFAULT_SETTINGS} from './constants';
import './i18n';
import {MAXSettings} from './types';
import Logger, {LogLvl} from './utils/logging';
import {ChatbotView, VIEW_TYPE_CHATBOT} from './views/chatbot-view';
import {MAXSettingTab} from './views/setting-view';

import './styles.css';

if (Platform.isMobile) {
	(window as any)['process'] = {env: {NODE_ENV: 'production'}};
}

export default class MAXPlugin extends Plugin {
	settings: MAXSettings | undefined;

	async onload() {
		await this.loadSettings();

		Logger.setLogLevel(this.settings?.isVerbose ? LogLvl.DEBUG : LogLvl.DISABLED);
		Logger.info('debug mode: on');

		const folderPath = this.settings?.profiles.profileFolderPath || DEFAULT_SETTINGS.profiles.profileFolderPath;

		const defaultFilePath = `${folderPath}/${DEFAULT_SETTINGS.profiles.profile}`;
		const defaultProfile = this.app.vault.getAbstractFileByPath(defaultFilePath) as TFile;

		// Check if the folder exists, create it if not
		if (!(await this.app.vault.adapter.exists(folderPath))) {
			await this.app.vault.createFolder(folderPath);
		}

		// Check if the 'Default.md' file exists, create it if not
		if (!(await this.app.vault.adapter.exists(defaultFilePath))) {
			this.app.vault.create(defaultFilePath, '');
			console.log('Default profile created.');
		}

		this.registerView(VIEW_TYPE_CHATBOT, leaf => new ChatbotView(leaf, this));

		// this.addRibbonIcon('bot', 'MAX Chatbot', () => this.activateView());

		this.addCommand({
			id: 'open-max-chatbot',
			name: 'Open MAX Chatbot',
			callback: () => this.activateView(),
			hotkeys: [
				{
					modifiers: ['Mod'],
					key: '0',
				},
			],
		});

		/* 		this.registerEvent(
			this.app.vault.on('create', async (file: TFile) => {
				if (file instanceof TFile && file.path.startsWith(folderPath)) {
					const fileContent = await this.app.vault.read(file);

					// Check if the file content is empty
					if (fileContent.trim() === '') {
						// File content is empty, proceed with default front matter and appending content
						defaultFrontMatter(this, file);
					}
				}
			})
		); */

		/* this.registerEvent(
			this.app.vault.on('delete', async (file: TFile) => {
				if (file instanceof TFile && file.path.startsWith(folderPath)) {
					const filenameMessageHistory = `./.obsidian/plugins/max-chatbot/data/messageHistory_${file.name.replace('.md', '.json')}`;
					this.app.vault.adapter.remove(filenameMessageHistory);

					if (file.path === defaultFilePath) {
						this.app.vault.create(defaultFilePath, '');
					} else {
						if (this.settings!.profiles.profile === file.name) {
							this.settings!.profiles.profile = DEFAULT_SETTINGS.profiles.profile;
							const fileContent = (await this.app.vault.read(defaultProfile)).replace(/^---\s*[\s\S]*?---/, '').trim();
							this.settings!.general.systemPrompt = fileContent;
							await updateSettingsFromFrontMatter(this, defaultProfile);
							await this.saveSettings();
						}
					}
					this.activateView();
				}
			})
		); */

		// Update frontmatter when the profile file is modified
		/* this.registerEvent(
			this.app.vault.on('modify', async (file: TFile) => {
				const currentProfilePath = `${folderPath}/${this.settings!.profiles.profile}`;
				if (file.path === currentProfilePath) {
					await updateSettingsFromFrontMatter(this, file);
					const fileContent = (await this.app.vault.read(file)).replace(/^---\s*[\s\S]*?---/, '').trim();
					this.settings!.general.systemPrompt = fileContent;
					await this.saveSettings();
				}
			})
		); */

		/* this.registerEvent(
			this.app.vault.on('rename', async (file: TFile, oldPath: string) => {
				try {
					const currentProfilePath = `${folderPath}/${this.settings!.profiles.profile}`;
					if (oldPath === currentProfilePath) {
						this.settings!.profiles.profile = file.name;
						this.settings!.appearance.chatbotName = file.basename;
						await this.saveSettings();
					}

					if (file instanceof TFile && file.path.startsWith(folderPath)) {
						const filenameMessageHistoryPath = './.obsidian/plugins/max-chatbot/data/';
						const oldProfileMessageHistory = `messageHistory_${oldPath.replace(`${folderPath}/`, '').replace('.md', '.json')}`;

						await this.app.vault.adapter
							.rename(
								filenameMessageHistoryPath + oldProfileMessageHistory,
								`${filenameMessageHistoryPath}messageHistory_${file.name.replace('.md', '.json')}`
							)
							.catch(error => {
								console.error('Error handling rename event:', error);
							});

						await this.app.vault.adapter.remove(filenameMessageHistoryPath + oldProfileMessageHistory);
					}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					if (error.message.includes('ENOENT: no such file or directory, unlink')) {
						// Ignore the specific error and do nothing
					} else {
						console.error('Error handling rename event:', error);
					}
				}
			})
		); */

		// this.registerEvent(
		// 	this.app.workspace.on('active-leaf-change', () => {
		// 		this.handleFileSwitch();
		// 		// window.dispatchEvent(new Event('active-leaf-change'));
		// 	})
		// );

		// this.registerEvent(
		// 	this.app.workspace.on('file-menu', (menu, file) => {
		// 		if (!(file instanceof TFile)) {
		// 			return;
		// 		}

		// 		menu.addItem(item => {
		// 			item.setTitle('MAX Chatbot: Generate new title').onClick(() => renameTitleCommand(this, this.settings!));
		// 		});
		// 	})
		// );

		// this.addCommand({
		// 	id: 'prompt-select-generate',
		// 	name: 'Prompt Select Generate',
		// 	callback: () => {
		// 		promptSelectGenerateCommand(this, this.settings!);
		// 	},
		// 	hotkeys: [
		// 		{
		// 			modifiers: ['Mod', 'Shift'],
		// 			key: '=',
		// 		},
		// 	],
		// });

		this.addSettingTab(new MAXSettingTab(this.app, this));
	}

	// handleFileSwitch() {
	// 	currentActiveFile = this.app.workspace.getActiveFile();
	// }

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

		/* 
		const messageContainer = document.querySelector('#messageContainer');
		if (messageContainer) {
			messageContainer.scroll({
				top: messageContainer.scrollHeight,
				behavior: 'smooth',
			});
		} */
	}

	async loadSettings() {
		const loadedData = (await this.loadData()) as MAXSettings;
		this.settings = merge(DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings() {
		const currentProfileFile = `${this.settings!.profiles.profileFolderPath}/${this.settings!.profiles.profile}`;
		const currentProfile = this.app.vault.getAbstractFileByPath(currentProfileFile) as TFile;
		await updateFrontMatter(this, currentProfile);
		await this.saveData(this.settings);
	}
}

export async function defaultFrontMatter(plugin: MAXPlugin, file: TFile) {
	// Define a callback function to modify the frontmatter
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const setDefaultFrontMatter = (frontmatter: Record<string, any>) => {
		// Add or modify properties in the frontmatter
		frontmatter.model = DEFAULT_SETTINGS.general.model;
		frontmatter.max_tokens = parseInt(DEFAULT_SETTINGS.general.maxTokens);
		frontmatter.temperature = parseFloat(DEFAULT_SETTINGS.general.temperature);
		frontmatter.reference_current_note = DEFAULT_SETTINGS.general.allowReferenceCurrentNote;
		frontmatter.prompt = DEFAULT_SETTINGS.prompts.prompt;
		frontmatter.user_name = DEFAULT_SETTINGS.appearance.userName;
		// frontmatter.chatbot_name = DEFAULT_SETTINGS.appearance.chatbotName;
		frontmatter.allow_header = DEFAULT_SETTINGS.appearance.allowHeader;

		frontmatter.prompt_select_generate_system_role = DEFAULT_SETTINGS.editor.promptSelectGenerateSystemRole;
		frontmatter.ollama_mirostat = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostat;
		frontmatter.mirostatEta = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatEta;
		frontmatter.mirostatTau = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatTau;
		frontmatter.num_ctx = DEFAULT_SETTINGS.providers.OLLAMA.options.numCtx;
		frontmatter.num_gqa = DEFAULT_SETTINGS.providers.OLLAMA.options.numGqa;
		frontmatter.num_thread = DEFAULT_SETTINGS.providers.OLLAMA.options.numThread;
		frontmatter.ollama_repeat_last_n = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatLastN;
		frontmatter.repeat_penalty = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatPenalty;
		frontmatter.ollama_stop = DEFAULT_SETTINGS.providers.OLLAMA.options.stop;
		frontmatter.tfs_z = DEFAULT_SETTINGS.providers.OLLAMA.options.tfsZ;
		frontmatter.top_k = DEFAULT_SETTINGS.providers.OLLAMA.options.topK;
		frontmatter.top_p = DEFAULT_SETTINGS.providers.OLLAMA.options.topP;
		frontmatter.keep_alive = DEFAULT_SETTINGS.providers.OLLAMA.options.keepAlive;
	};

	// Optional: Specify data write options
	const writeOptions: DataWriteOptions = {
		// Specify options if needed
	};

	try {
		await plugin.app.fileManager.processFrontMatter(file, setDefaultFrontMatter, writeOptions);
	} catch (error) {
		console.error('Error processing frontmatter:', error);
	}

	await plugin.app.vault.append(file, DEFAULT_SETTINGS.general.systemPrompt);
}

export async function updateSettingsFromFrontMatter(plugin: MAXPlugin, file: TFile) {
	// 프론트메터를 수정하는 콜백 함수를 정의합니다.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateSettings = (frontmatter: any) => {
		// 프론트메터에 속성 추가 또는 수정하기
		if (!plugin.settings) return;
		plugin.settings.general.model = frontmatter.model;
		plugin.settings.general.maxTokens = frontmatter.max_tokens;
		plugin.settings.general.temperature = frontmatter.temperature;
		plugin.settings.general.allowReferenceCurrentNote = frontmatter.reference_current_note;
		plugin.settings.prompts.prompt = `${frontmatter.prompt}.md`;
		plugin.settings.appearance.userName = frontmatter.user_name;
		plugin.settings.appearance.chatbotName = file.basename;
		plugin.settings.appearance.allowHeader = frontmatter.allow_header;
		plugin.settings.editor.promptSelectGenerateSystemRole = frontmatter.prompt_select_generate_system_role;
		plugin.settings.providers.OLLAMA.options.mirostat = frontmatter.ollama_mirostat;
		plugin.settings.providers.OLLAMA.options.mirostatEta = frontmatter.ollama_mirostat_eta;
		plugin.settings.providers.OLLAMA.options.mirostatTau = frontmatter.ollama_mirostat_tau;
		plugin.settings.providers.OLLAMA.options.numCtx = frontmatter.ollama_num_ctx;
		plugin.settings.providers.OLLAMA.options.numGqa = frontmatter.ollama_num_gqa;
		plugin.settings.providers.OLLAMA.options.numThread = frontmatter.ollama_num_thread;
		plugin.settings.providers.OLLAMA.options.repeatLastN = frontmatter.ollama_repeat_last_n;
		plugin.settings.providers.OLLAMA.options.repeatPenalty = frontmatter.ollama_repeat_penalty;
		plugin.settings.providers.OLLAMA.options.stop = frontmatter.ollama_stop;
		plugin.settings.providers.OLLAMA.options.tfsZ = frontmatter.ollama_tfs_z;
		plugin.settings.providers.OLLAMA.options.topK = frontmatter.ollama_top_k;
		plugin.settings.providers.OLLAMA.options.topP = frontmatter.ollama_top_p;
		plugin.settings.providers.OLLAMA.options.keepAlive = frontmatter.ollama_keep_alive;
	};

	// Optional: Specify data write options
	const writeOptions: DataWriteOptions = {
		// Specify options if needed
	};

	try {
		await plugin.app.fileManager.processFrontMatter(file, updateSettings, writeOptions);
		const fileContent = (await plugin.app.vault.read(file)).replace(/^---\s*[\s\S]*?---/, '').trim();
		plugin.settings!.general.systemPrompt = fileContent;
		await updateProfile(plugin, file);
	} catch (error) {
		console.error('Error processing frontmatter:', error);
	}
}

export async function updateFrontMatter(plugin: MAXPlugin, file: TFile) {
	// Define a callback function to modify the frontmatter
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const modifyFrontMatter = (frontmatter: any) => {
		if (!plugin.settings) return;
		// Add or modify properties in the frontmatter
		frontmatter.model = plugin.settings.general.model;
		frontmatter.max_tokens = parseInt(plugin.settings.general.maxTokens);
		frontmatter.temperature = parseFloat(plugin.settings.general.temperature);
		frontmatter.reference_current_note = plugin.settings.general.allowReferenceCurrentNote;
		frontmatter.prompt = plugin.settings.prompts.prompt.replace('.md', '');
		frontmatter.user_name = plugin.settings.appearance.userName;
		frontmatter.chatbot_name = plugin.settings.appearance.chatbotName;
		frontmatter.allow_header = plugin.settings.appearance.allowHeader;
		frontmatter.prompt_select_generate_system_role = plugin.settings.editor.promptSelectGenerateSystemRole;
		frontmatter.ollama_mirostat = plugin.settings.providers.OLLAMA.options.mirostat;
		frontmatter.ollama_mirostat_eta = plugin.settings.providers.OLLAMA.options.mirostatEta;
		frontmatter.ollama_mirostat_tau = plugin.settings.providers.OLLAMA.options.mirostatTau;
		frontmatter.ollama_num_ctx = plugin.settings.providers.OLLAMA.options.numCtx;
		frontmatter.ollama_num_gqa = plugin.settings.providers.OLLAMA.options.numGqa;
		frontmatter.ollama_num_thread = plugin.settings.providers.OLLAMA.options.numThread;
		frontmatter.ollama_repeat_last_n = plugin.settings.providers.OLLAMA.options.repeatLastN;
		frontmatter.ollama_repeat_penalty = plugin.settings.providers.OLLAMA.options.repeatPenalty;
		frontmatter.ollama_stop = plugin.settings.providers.OLLAMA.options.stop;
		frontmatter.ollama_tfs_z = plugin.settings.providers.OLLAMA.options.tfsZ;
		frontmatter.ollama_top_k = plugin.settings.providers.OLLAMA.options.topK;
		frontmatter.ollama_top_p = plugin.settings.providers.OLLAMA.options.topP;
		frontmatter.ollama_keep_alive = plugin.settings.providers.OLLAMA.options.keepAlive;
	};

	// Optional: Specify data write options
	const writeOptions: DataWriteOptions = {
		// Specify options if needed
	};

	try {
		await plugin.app.fileManager.processFrontMatter(file, modifyFrontMatter, writeOptions);
		await updateProfile(plugin, file);
	} catch (error) {
		console.error('Error processing frontmatter:', error);
	}
}

export async function updateProfile(plugin: MAXPlugin, file: TFile) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await plugin.app.fileManager.processFrontMatter(file, (frontmatter: Record<string, any>) => {
			plugin.settings!.general.model = frontmatter.model || DEFAULT_SETTINGS.general.model;

			const modelName = document.querySelector('#modelName');
			if (modelName) {
				modelName.textContent = `Model: ${plugin.settings!.general.model}`;
			}

			if (frontmatter.max_tokens) {
				plugin.settings!.general.maxTokens = frontmatter.max_tokens.toString();
				frontmatter.max_tokens = parseInt(plugin.settings!.general.maxTokens);
			} else {
				plugin.settings!.general.maxTokens = DEFAULT_SETTINGS.general.maxTokens;
			}

			if (frontmatter.temperature) {
				if (frontmatter.temperature < 0) {
					frontmatter.temperature = '0.00';
				} else if (frontmatter.temperature > 2) {
					frontmatter.temperature = '2.00';
				} else {
					plugin.settings!.general.temperature = parseFloat(frontmatter.temperature).toFixed(2).toString();
					frontmatter.temperature = parseFloat(plugin.settings!.general.temperature);
				}
			} else {
				plugin.settings!.general.temperature = DEFAULT_SETTINGS.general.temperature;
				frontmatter.temperature = DEFAULT_SETTINGS.general.temperature;
			}

			plugin.settings!.general.allowReferenceCurrentNote = frontmatter.reference_current_note;

			const referenceCurrentNoteElement = document.getElementById('referenceCurrentNote') as HTMLElement;
			if (referenceCurrentNoteElement) {
				if (frontmatter.reference_current_note === true) {
					referenceCurrentNoteElement.style.display = 'block';
				} else {
					referenceCurrentNoteElement.style.display = 'none';
				}
			}

			if (frontmatter.prompt && frontmatter.prompt !== '') {
				plugin.settings!.prompts.prompt = `${frontmatter.prompt}.md`;
			} else {
				plugin.settings!.prompts.prompt = DEFAULT_SETTINGS.prompts.prompt;
			}

			if (frontmatter.user_name) {
				plugin.settings!.appearance.userName = frontmatter.user_name.substring(0, 30);
			} else {
				plugin.settings!.appearance.userName = DEFAULT_SETTINGS.appearance.userName;
			}
			frontmatter.user_name = plugin.settings!.appearance.userName;

			const userNames = document.querySelectorAll('.userName');
			userNames.forEach(userName => {
				userName.textContent = plugin.settings!.appearance.userName;
			});

			// if (frontmatter.chatbot_name) {
			// plugin.settings!.appearance.chatbotName = frontmatter.chatbot_name.toUpperCase().substring(0, 30);
			// } else {
			// 	plugin.settings!.appearance.chatbotName = DEFAULT_SETTINGS.appearance.chatbotName;
			// }
			// frontmatter.chatbot_name = plugin.settings!.appearance.chatbotName;

			const chatbotNameHeading = document.querySelector('#chatbotNameHeading') as HTMLHeadingElement;
			const chatbotNames = document.querySelectorAll('.chatbotName');
			if (chatbotNameHeading) {
				chatbotNameHeading.textContent = plugin.settings!.appearance.chatbotName;
			}
			chatbotNames.forEach(chatbotName => {
				chatbotName.textContent = plugin.settings!.appearance.chatbotName;
			});

			plugin.settings!.editor.promptSelectGenerateSystemRole = frontmatter.prompt_select_generate_system_role;

			plugin.settings!.appearance.allowHeader = frontmatter.allow_header;
			if (frontmatter.allow_header === true) {
				const header = document.querySelector('#header') as HTMLElement;

				if (header) {
					header.style.display = 'block';
					referenceCurrentNoteElement.style.margin = '-0.5rem 0 0.5rem 0';
				}
			} else {
				const header = document.querySelector('#header') as HTMLElement;
				const messageContainer = document.querySelector('#messageContainer') as HTMLElement;
				if (header) {
					header.style.display = 'none';
					messageContainer.style.maxHeight = 'calc(100% - 60px)';
					referenceCurrentNoteElement.style.margin = '0.5rem 0 0.5rem 0';
				}
			}

			// 구문 분석된 값이 유효한 정수인지 확인하고, 그렇지 않은 경우 기본 URL로 폴백합니다.
			const mirostat = parseInt(frontmatter.ollama_mirostat, 10);
			if (isNaN(mirostat)) {
				plugin.settings!.providers.OLLAMA.options.mirostat = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostat;
			} else {
				plugin.settings!.providers.OLLAMA.options.mirostat = mirostat;
			}
			frontmatter.ollama_mirostat = plugin.settings!.providers.OLLAMA.options.mirostat;

			const mirostatRta = parseFloat(frontmatter.ollama_mirostat.toFixed(2));
			if (isNaN(mirostatRta)) {
				plugin.settings!.providers.OLLAMA.options.mirostatEta = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatEta;
			} else {
				plugin.settings!.providers.OLLAMA.options.mirostatEta = mirostatRta;
			}
			frontmatter.ollama_mirostat_eta = plugin.settings!.providers.OLLAMA.options.mirostatEta;

			const mirostatTau = parseFloat(frontmatter.ollama_mirostat_tau.toFixed(2));
			if (isNaN(mirostatTau)) {
				plugin.settings!.providers.OLLAMA.options.mirostatTau = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatTau;
			} else {
				plugin.settings!.providers.OLLAMA.options.mirostatTau = mirostatTau;
			}
			frontmatter.ollama_mirostat_tau = plugin.settings!.providers.OLLAMA.options.mirostatTau;

			const numCtx = parseInt(frontmatter.ollama_num_ctx, 10);
			if (isNaN(numCtx)) {
				plugin.settings!.providers.OLLAMA.options.numCtx = DEFAULT_SETTINGS.providers.OLLAMA.options.numCtx;
			} else {
				plugin.settings!.providers.OLLAMA.options.numCtx = numCtx;
			}
			frontmatter.ollama_num_ctx = plugin.settings!.providers.OLLAMA.options.numCtx;

			const numGqa = parseInt(frontmatter.ollama_num_gqa, 10);
			if (isNaN(numGqa)) {
				plugin.settings!.providers.OLLAMA.options.numGqa = DEFAULT_SETTINGS.providers.OLLAMA.options.numGqa;
			} else {
				plugin.settings!.providers.OLLAMA.options.numGqa = numGqa;
			}
			frontmatter.ollama_num_gqa = plugin.settings!.providers.OLLAMA.options.numGqa;

			const numThread = parseInt(frontmatter.ollama_num_thread, 10);
			if (isNaN(numThread)) {
				plugin.settings!.providers.OLLAMA.options.numThread = DEFAULT_SETTINGS.providers.OLLAMA.options.numThread;
			} else {
				plugin.settings!.providers.OLLAMA.options.numThread = numThread;
			}
			frontmatter.ollama_num_thread = plugin.settings!.providers.OLLAMA.options.numThread;

			const repeatLastN = parseInt(frontmatter.ollama_repeat_last_n, 10);
			if (isNaN(repeatLastN)) {
				plugin.settings!.providers.OLLAMA.options.repeatLastN = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatLastN;
			} else {
				plugin.settings!.providers.OLLAMA.options.repeatLastN = repeatLastN;
			}
			frontmatter.ollama_repeat_last_n = plugin.settings!.providers.OLLAMA.options.repeatLastN;

			const repeatPenalty = parseFloat(frontmatter.ollama_repeat_penalty.toFixed(2));
			if (isNaN(repeatPenalty)) {
				plugin.settings!.providers.OLLAMA.options.repeatPenalty = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatPenalty;
			} else {
				plugin.settings!.providers.OLLAMA.options.repeatPenalty = repeatPenalty;
			}
			frontmatter.ollama_repeat_penalty = plugin.settings!.providers.OLLAMA.options.repeatPenalty;

			plugin.settings!.providers.OLLAMA.options.stop = frontmatter.ollama_stop;

			const tfsZ = parseFloat(frontmatter.ollama_tfs_z.toFixed(2));
			if (isNaN(tfsZ)) {
				plugin.settings!.providers.OLLAMA.options.tfsZ = DEFAULT_SETTINGS.providers.OLLAMA.options.tfsZ;
			} else {
				plugin.settings!.providers.OLLAMA.options.tfsZ = tfsZ;
			}
			frontmatter.ollama_tfs_z = plugin.settings!.providers.OLLAMA.options.tfsZ;

			const topK = parseInt(frontmatter.ollama_top_k, 10);
			if (isNaN(topK)) {
				plugin.settings!.providers.OLLAMA.options.topK = DEFAULT_SETTINGS.providers.OLLAMA.options.topK;
			} else {
				plugin.settings!.providers.OLLAMA.options.topK = topK;
			}
			frontmatter.ollama_top_k = plugin.settings!.providers.OLLAMA.options.topK;

			const topP = parseFloat(frontmatter.ollama_top_p.toFixed(2));
			if (isNaN(topP)) {
				plugin.settings!.providers.OLLAMA.options.topP = DEFAULT_SETTINGS.providers.OLLAMA.options.topP;
			} else {
				plugin.settings!.providers.OLLAMA.options.topP = topP;
			}
			frontmatter.ollama_top_p = plugin.settings!.providers.OLLAMA.options.topP;

			// Regular expression to validate the input value and capture the number and unit
			const match = String(frontmatter.ollama_keep_alive).match(/^(-?\d+)(m|hr|h)?$/);

			if (match) {
				const num = parseInt(match[1]);
				const unit = match[2];

				// Convert to seconds based on the unit
				let seconds;
				if (unit === 'm') {
					seconds = num * 60; // Convert minutes to seconds
				} else if (unit === 'hr' || unit === 'h') {
					seconds = num * 3600; // Convert hours to seconds
				} else {
					seconds = num; // Assume it's already in seconds if no unit
				}

				// Store the value in seconds
				plugin.settings!.providers.OLLAMA.options.keepAlive = seconds.toString();
			} else {
				// If the input is invalid, revert to the default setting
				plugin.settings!.providers.OLLAMA.options.keepAlive = DEFAULT_SETTINGS.providers.OLLAMA.options.keepAlive;
			}
			frontmatter.ollama_keep_alive = plugin.settings!.providers.OLLAMA.options.keepAlive;
		});
	} catch (error) {
		console.error('Error processing frontmatter:', error);
	}
}
