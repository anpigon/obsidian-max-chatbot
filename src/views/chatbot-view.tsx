import {AppContext} from '@/context';
import {Chatbot} from '@/features/chatbot';
import MAXPlugin from '@/main';
import {ItemView, WorkspaceLeaf} from 'obsidian';
import React from 'react';
import {Root, createRoot} from 'react-dom/client';

export const VIEW_TYPE_CHATBOT = 'max-chatbot-view';

export function filenameMessageHistoryJSON(plugin: MAXPlugin) {
	const filenameMessageHistoryPath = './.obsidian/plugins/max-chatbot/data/';
	const currentProfileMessageHistory = `messageHistory_${plugin.settings!.profiles.profile.replace('.md', '.json')}`;

	return filenameMessageHistoryPath + currentProfileMessageHistory;
}

export class ChatbotView extends ItemView {
	private root: Root | null = null;
	readonly icon = 'bot';

	constructor(
		readonly leaf: WorkspaceLeaf,
		readonly plugin: MAXPlugin
	) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_CHATBOT;
	}

	getDisplayText() {
		return 'MAX Chatbot view';
	}

	async onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<React.StrictMode>
				<AppContext.Provider value={this.plugin}>
					<Chatbot />
				</AppContext.Provider>
			</React.StrictMode>
		);
	}

	async onClose() {
		// Nothing to clean up.
		this.root?.unmount();
	}
}
