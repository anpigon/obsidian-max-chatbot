import {App, TFile} from 'obsidian';

import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import {Document} from '@langchain/core/documents';

import {hashString} from './hash';
import Logger from './logging';

export async function obsidianDocumentLoader(app: App, files: TFile[]): Promise<Document[]> {
	const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
		chunkSize: 2000,
		chunkOverlap: 200,
	}); // One token is 4 characters on average

	const docs: Document[] = [];
	for (const file of files) {
		const fileMetadata = app.metadataCache.getFileCache(file);
		const noteContent = await app.vault.cachedRead(file);

		const frontmatter = fileMetadata?.frontmatter;
		const yamlPosition = fileMetadata?.sections?.find(({type}) => type === 'yaml')?.position;
		const pageContent = (yamlPosition ? noteContent.slice(yamlPosition.end.offset) : noteContent).trim();
		const filepath = file.path;
		const title = file.basename;
		const id = await hashString(file.path);

		docs.push({
			pageContent,
			metadata: {
				...frontmatter,
				id,
				title,
				filepath,
				content: pageContent,
			},
		});
	}
	Logger.info('Loaded ' + docs.length + ' documents from Obsidian');
	return docs;
}
