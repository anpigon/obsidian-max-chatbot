import {Document} from '@langchain/core/documents';
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {App, TFile} from 'obsidian';

import {hashString} from './hash';
import Logger from './logging';

export async function obsidianDocumentLoader(app: App, files: TFile[]): Promise<Document[]> {
	const docs: Document[] = [];
	for (const file of files) {
		const fileMetadata = app.metadataCache.getFileCache(file);
		if (!fileMetadata) continue;
		// 여기의 청크 사이즈는 토큰 크기가 아니라 문자 크기이다.
		const maxTokenSize = 512;
		const splitter = new RecursiveCharacterTextSplitter({chunkSize: maxTokenSize * 4, chunkOverlap: 0, separators: ['\n', '. ', '? ', '! ', ' ', '']}); // One token is 4 characters on average

		// TODO 예를 들어 #이 사용된 경우와 바로 뒤에 ###이 사용된 경우와 같이 에지 케이스를 확인합니다.
		const noteContent = await app.vault.cachedRead(file);
		let headerCount = 0;
		let docCount = 1;
		const headingTree: string[] = [];
		let currentHeadingLevel = 0;
		let foundFrontmatter = false;

		for (const section of fileMetadata.sections || []) {
			const sectionContent = noteContent.slice(section.position.start.offset, section.position.end.offset);
			const addDoc = async (embedContent: string, isMetadata: boolean = false) => {
				const id = file.path + (isMetadata ? ' metadata' : headingTree.join('') + ' ID' + docCount);
				docs.push({
					metadata: {
						id,
						hash: hashString(id + sectionContent),
						filepath: file.path,
						order: isMetadata ? 0 : docCount,
						header: [...headingTree],
						content: isMetadata ? 'Metadaten:\n' + sectionContent : sectionContent,
					},
					pageContent: embedContent,
				});
				if (!isMetadata) docCount++;
			};

			if (section.type === 'yaml' && !foundFrontmatter) {
				const embedContent = 'Note Path: ' + file.path + '\n' + 'Metadaten:\n' + sectionContent;
				addDoc(embedContent, true);
				foundFrontmatter = true;
				continue;
			} else if (section.type === 'heading') {
				const currentHeading = fileMetadata.headings![headerCount];
				const headingContent = noteContent.slice(currentHeading.position.start.offset, currentHeading.position.end.offset);
				if (currentHeading.level > currentHeadingLevel) {
					headingTree.push(headingContent);
					currentHeadingLevel = currentHeading.level;
				} else if (currentHeading.level < currentHeadingLevel) {
					headingTree.pop();
					headingTree.pop();
					headingTree.push(headingContent);
					currentHeadingLevel = currentHeading.level;
				} else {
					headingTree.pop();
					headingTree.push(headingContent);
				}
				headerCount++;
			} else if (section.type === 'thematicBreak') {
				// ignoring --- in markdown
				continue;
			} else if (section.type === 'paragraph') {
				const splitParagraph = await splitter.splitText(sectionContent);
				for (let i = 0; i < splitParagraph.length; i++) {
					// 이는 어떤 이유로든 구분 기호가 다음 청크에만 추가되기 때문에 수행됩니다.
					let splittedByChar = '';
					if (
						splitParagraph[i + 1] &&
						(splitParagraph[i + 1].charAt(0) === '.' || splitParagraph[i + 1].charAt(0) === '?' || splitParagraph[i + 1].charAt(0) === '!')
					) {
						splittedByChar = splitParagraph[i + 1].charAt(0);
						splitParagraph[i + 1] = splitParagraph[i + 1].slice(1).trim();
					}
					const paragraph = splitParagraph[i] + splittedByChar;
					const embedContent = 'Note Path: ' + file.path + '\n' + headingTree.join('\n') + '\n' + paragraph;
					addDoc(embedContent);
				}
			} else if (section.type === 'code') {
				// 지금은 최대 토큰 크기보다 큰 코드 블록을 무시합니다(
				if (sectionContent.length > maxTokenSize * 4) continue;
				const embedContent = 'Note Path: ' + file.path + '\n' + headingTree.join('\n') + '\n' + sectionContent;
				addDoc(embedContent);
			} else {
				// TODO 다른 유형의 섹션 처리
				if (sectionContent.length > maxTokenSize * 8) continue;
				const embedContent = 'Note Path: ' + file.path + '\n' + headingTree.join('\n') + '\n' + sectionContent;
				addDoc(embedContent);
			}
		}
	}
	Logger.info('Loaded ' + docs.length + ' documents from Obsidian');

	return docs;
}
