import {useCallback, useEffect, useMemo, useRef} from 'react';
import {MarkdownRenderer, Notice} from 'obsidian';
import {useCopyToClipboard} from 'usehooks-ts';
import {t} from 'i18next';

import {usePlugin} from '@/hooks/useApp';

interface MarkdownViewProps {
	content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({content}) => {
	const plugin = usePlugin();
	const [, copyToClipboard] = useCopyToClipboard();
	const containerRef = useRef<HTMLDivElement>(null);

	const handleCopyClick = useCallback(async (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.classList.contains('copy-code-button')) {
			try {
				const previousElement = target.previousElementSibling as HTMLElement;
				const textToCopy = previousElement?.innerText || '';
				await copyToClipboard(textToCopy);
				new Notice(t('Text copied to clipboard'));
			} catch (error) {
				new Notice(t('Failed to copy text to clipboard'));
			}
		}
	}, []);

	useEffect(() => {
		const container = containerRef.current;

		container?.addEventListener('click', handleCopyClick);

		return () => {
			container?.removeEventListener('click', handleCopyClick);
		};
	}, [containerRef.current]);

	const renderedHTML = useMemo(() => {
		const tempDiv = document.createElement('div');
		MarkdownRenderer.render(plugin.app, content, tempDiv, '', plugin);
		return tempDiv.innerHTML;
	}, [content]);

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
