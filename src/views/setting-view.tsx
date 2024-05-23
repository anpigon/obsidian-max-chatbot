import {ErrorBoundary} from '@/components/error-boundary';
import {AppContext} from '@/context';
import {Setting} from '@/features/setting';
import MAXPlugin from '@/main';
import {App, PluginSettingTab} from 'obsidian';
import React from 'react';
import {Root, createRoot} from 'react-dom/client';

export class MAXSettingTab extends PluginSettingTab {
	plugin: MAXPlugin;
	private root: Root | null = null;

	constructor(app: App, plugin: MAXPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
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
		return;
	}

	hide() {
		this.root?.unmount();
	}
}
