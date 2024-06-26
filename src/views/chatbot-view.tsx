import {Root, createRoot} from 'react-dom/client';
import {ItemView, WorkspaceLeaf} from 'obsidian';
import React from 'react';

import {ErrorBoundary} from '@/components';
import Chatbot from '@/features/chatbot';
import {AppContext} from '@/context';
import MAXPlugin from '@/main';

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

	getViewType(): string {
		return VIEW_TYPE_CHATBOT;
	}

	getDisplayText(): string {
		return 'MAX Chatbot';
	}

	async onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<React.StrictMode>
				<ErrorBoundary>
					<AppContext.Provider value={this.plugin}>
						<Chatbot />
					</AppContext.Provider>
				</ErrorBoundary>
			</React.StrictMode>
		);
	}

	async onClose(): Promise<void> {
		this.root?.unmount();
		this.root = null;
	}
}
