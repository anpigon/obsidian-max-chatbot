import {Document} from '@langchain/core/documents';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import {App, TFile, getFrontMatterInfo, parseYaml} from 'obsidian';

import {hashString} from './hash';
import Logger from './logging';

export async function obsidianDocumentLoader(app: App, files: TFile[], maxTokenSize = 512): Promise<Document[]> {
	// 여기의 청크 사이즈는 토큰 크기가 아니라 문자 크기이다.
	const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
		chunkSize: maxTokenSize * 4,
		chunkOverlap: 0,
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
		const hash = await hashString(pageContent);

		docs.push({
			pageContent,
			metadata: {
				title,
				...frontmatter,
				filepath,
				hash,
				id,
			},
		});
	}
	Logger.info('Loaded ' + docs.length + ' documents from Obsidian');

	return docs;
}
