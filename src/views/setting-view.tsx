import {Root, createRoot} from 'react-dom/client';
import {App, PluginSettingTab} from 'obsidian';
import React from 'react';

import {ErrorBoundary} from '@/components/error-boundary';
import {Setting} from '@/features/setting';
import {AppContext} from '@/context';
import MAXPlugin from '@/main';

export class MAXSettingTab extends PluginSettingTab {
	private root: Root | null = null;

	constructor(
		readonly app: App,
		readonly plugin: MAXPlugin
	) {
		super(app, plugin);
	}

	display() {
		this.root = createRoot(this.containerEl);
		this.root.render(
			<React.StrictMode>
				<ErrorBoundary>
					<AppContext.Provider value={this.plugin}>
						<Setting />
					</AppContext.Provider>
				</ErrorBoundary>
			</React.StrictMode>
		);
	}

	hide() {
		this.root?.unmount();
	}
}
