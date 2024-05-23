import MAXPlugin from '@/main';
import {MAXSettings} from '@/types';

let referenceCurrentNoteContent = '';

// Reference Current Note Indicator
export async function getActiveFileContent(plugin: MAXPlugin, settings: MAXSettings) {
	const dotElement = document.querySelector('.dotIndicator');
	referenceCurrentNoteContent = '';
	if (settings.general.allowReferenceCurrentNote === true) {
		if (dotElement) {
			(dotElement as HTMLElement).style.backgroundColor = '#da2c2c';
			referenceCurrentNoteContent = '';
		}
		const activeFile = plugin.app.workspace.getActiveFile();
		if (activeFile?.extension === 'md') {
			if (dotElement) {
				(dotElement as HTMLElement).style.backgroundColor = 'green';
			}
			const content = await plugin.app.vault.read(activeFile);
			const clearYamlContent = content.replace(/---[\s\S]+?---/, '').trim();
			referenceCurrentNoteContent = `\n\nAdditional Note:\n\n${clearYamlContent}\n\n`;
		}
	}
	return referenceCurrentNoteContent;
}

export function getCurrentNoteContent() {
	return referenceCurrentNoteContent;
}
