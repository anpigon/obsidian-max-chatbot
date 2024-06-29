import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MarkdownRenderer, Notice} from 'obsidian';
import {useCopyToClipboard} from 'usehooks-ts';
import {t} from 'i18next';

import type {FC} from 'react';

import {usePlugin} from '@/hooks/useApp';
import Logger from '@/libs/logging';

interface MarkdownViewProps {
	content: string;
}

const wrapDataviewBlocks = (content: string): string => {
	const regex = /(```(?:dataview|dataviewjs)[\s\S]*?```)/g;
	return content.replace(regex, '````$1````');
};

export const MarkdownView: FC<MarkdownViewProps> = ({content}) => {
	const plugin = usePlugin();
	const [, copyToClipboard] = useCopyToClipboard();
	const containerRef = useRef<HTMLDivElement>(null);
	const [renderedHTML, setRenderedHTML] = useState<string>('');

	const handleCopyClick = useCallback(
		(event: MouseEvent) => {
			const target = event.target as HTMLElement;
			Logger.debug('target', target);
			if (target.classList.contains('copy-code-button')) {
				const previousElement = target.previousElementSibling as HTMLElement;
				const textToCopy = previousElement?.innerText || '';
				copyToClipboard(textToCopy)
					.then(() => new Notice(t('Code copied to clipboard')))
					.catch(() => new Notice(t('Failed to copy text to clipboard')));
			}
		},
		[copyToClipboard]
	);

	useEffect(() => {
		const container = containerRef.current;

		if (container) {
			container.addEventListener('click', handleCopyClick);
		}

		return () => {
			if (container) {
				container.removeEventListener('click', handleCopyClick);
			}
		};
	}, [containerRef.current, handleCopyClick]);

	useEffect(() => {
		const renderMarkdown = async () => {
			if (typeof content === 'string' && content.trim()) {
				const processedContent = wrapDataviewBlocks(content.trim());
				const tempDiv = globalThis.document.createElement('div');
				await MarkdownRenderer.render(plugin.app, processedContent, tempDiv, '', plugin);
				setRenderedHTML(tempDiv.innerHTML);
			}
		};

		renderMarkdown().catch(() => {});
	}, [content, plugin]);

	if (typeof content !== 'string' || !content.trim()) {
		return null;
	}

	return (
		<div
			ref={containerRef}
			className="markdown-rendered"
			dangerouslySetInnerHTML={{
				__html: renderedHTML,
			}}
		/>
	);
};
