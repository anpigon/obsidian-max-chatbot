import {ErrorBoundary} from '@/components';
import {AppContext} from '@/context';
import MAXPlugin from '@/main';
import {Modal} from 'obsidian';
import React from 'react';
import {Root, createRoot} from 'react-dom/client';
import {AddAgentForm, AddAgentFormData} from './components/AddAgentForm';

export default class AddAgentModal extends Modal {
	private root: Root | null = null;
	public static EventName = 'AddAgentModalEvent';

	constructor(
		readonly plugin: MAXPlugin,
		// eslint-disable-next-line no-unused-vars
		readonly onConfirm: (data: AddAgentFormData) => void
	) {
		super(plugin.app);
	}

	onOpen(): void {
		const {contentEl} = this;
		this.root = createRoot(contentEl);
		this.root.render(
			<React.StrictMode>
				<ErrorBoundary>
					<AppContext.Provider value={this.plugin}>
						<AddAgentForm
							onConfirm={data => {
								this.onConfirm(data);
								this.close();
							}}
							onClose={() => {
								this.close();
							}}
						/>
					</AppContext.Provider>
				</ErrorBoundary>
			</React.StrictMode>
		);
	}

	onClose(): void {
		// const {contentEl} = this;
		// contentEl.empty();
		this.root?.unmount();
		this.root = null;
	}
}
