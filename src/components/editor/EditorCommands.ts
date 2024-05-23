/* eslint-disable @typescript-eslint/no-explicit-any */
import MAXPlugin from '@/main';
import {fetchModelRenameTitle} from './FetchRenameNoteTitle';
import {MarkdownView, Notice} from 'obsidian';
import {
	fetchOpenAIBaseAPIResponseEditor,
	fetchOllamaResponseEditor,
	fetchRESTAPIURLDataEditor,
	fetchAnthropicResponseEditor,
	fetchMistralDataEditor,
	fetchGoogleGeminiDataEditor,
	fetchOpenRouterEditor,
} from '../FetchModelEditor';
import {DEFAULT_SETTINGS, OPEN_AI_MODELS} from '@/constants';
import {MAXSettings} from '@/types';
import {ANTHROPIC_MODELS} from '@/constants';

export async function renameTitleCommand(plugin: MAXPlugin, settings: MAXSettings) {
	let uniqueNameFound = false;
	let modelRenameTitle;
	let folderName = plugin.app.vault.getAbstractFileByPath(plugin.app.workspace.getActiveFile()?.path || '')?.parent?.path || '';
	const fileExtension = '.md';
	const allFiles = plugin.app.vault.getFiles(); // Retrieve all files from the vault
	const activeFile = plugin.app.workspace.getActiveFile();
	let fileContent = '';

	try {
		new Notice('Generating title...');

		if (activeFile) {
			fileContent = await plugin.app.vault.read(activeFile);
		}

		if (folderName && !folderName.endsWith('/')) {
			folderName += '/';
		}

		// Function to check if a file name already exists
		const fileNameExists = (name: string | null) => {
			return allFiles.some(file => file.path === folderName + name + fileExtension);
		};

		while (!uniqueNameFound) {
			modelRenameTitle = await fetchModelRenameTitle(settings, fileContent);

			if (!fileNameExists(modelRenameTitle)) {
				uniqueNameFound = true;
			}
		}

		const fileName = folderName + modelRenameTitle + fileExtension;

		if (activeFile) {
			plugin.app.vault.rename(activeFile, fileName);
		}

		new Notice('Renamed note title.');
	} catch (error) {
		console.error(error);
	}
}

// Prompt + Select + Generate command
export async function promptSelectGenerateCommand(plugin: MAXPlugin, settings: MAXSettings) {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	const select = view?.editor.getSelection();
	if (view && select && select.trim() !== '') {
		if (settings.providers.OLLAMA.baseUrl && settings.providers.OLLAMA.models.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchOllamaResponseEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response);

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + response?.length,
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error?.message}`);
				console.log(error.message);
			}
		} else if (settings.providers.REST_API.baseUrl && settings.providers.REST_API.models.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchRESTAPIURLDataEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response);

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + response?.length,
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (ANTHROPIC_MODELS.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchAnthropicResponseEditor(settings, select);
				view.editor.replaceSelection(response);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (settings.providers.GOOGLE_GEMINI.models.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchGoogleGeminiDataEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response);

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + response?.length,
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (settings.providers.MISTRAL.models.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchMistralDataEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response);

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + response?.length,
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (OPEN_AI_MODELS.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchOpenAIBaseAPIResponseEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response || '');

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + (response?.length ?? 0),
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (
			settings.providers.OPEN_AI.baseUrl !== DEFAULT_SETTINGS.providers.OPEN_AI.baseUrl &&
			settings.providers.OPEN_AI.models.includes(settings.general.model)
		) {
			try {
				new Notice('Generating...');
				const response = await fetchOpenAIBaseAPIResponseEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response || '');

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + (response?.length ?? 0),
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		} else if (settings.providers.OPEN_ROUTER.models.includes(settings.general.model)) {
			try {
				new Notice('Generating...');
				const response = await fetchOpenRouterEditor(settings, select);
				// Replace the current selection with the response
				const cursorStart = view.editor.getCursor('from');
				view.editor.replaceSelection(response);

				// Calculate new cursor position based on the length of the response
				const cursorEnd = {
					line: cursorStart.line,
					ch: cursorStart.ch + response?.length,
				};

				// Keep the new text selected
				view.editor.setSelection(cursorStart, cursorEnd);
			} catch (error: any) {
				new Notice(`Error occurred while fetching completion: ${error.message}`);
				console.log(error.message);
			}
		}
		new Notice('Generation complete.');
	} else {
		new Notice('No text selected.');
	}
}
