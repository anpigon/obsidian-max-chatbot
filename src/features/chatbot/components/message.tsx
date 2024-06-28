import {useCopyToClipboard} from 'usehooks-ts';
import clsx from 'clsx';

import {IconTrash} from '@/components/icons/icon-trash';
import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';

import {twMerge} from 'tailwind-merge';
import {Notice} from 'obsidian';
import {useState} from 'react';
import {t} from 'i18next';

import {MarkdownView} from '@/components';
import {SmallButton} from './button';
import {Loading} from './loading';

interface MessageProps {
	id: string;
	type: 'bot' | 'user';
	name: string;
	message: string;
	showLoading?: boolean;
	onDeleteMessage: (id: string) => void;
	onEditMessage: (id: string, message: string) => void;
}

export const Message: React.FC<MessageProps> = ({id, type, name, message, showLoading = false, onDeleteMessage, onEditMessage}) => {
	const [, copy] = useCopyToClipboard();
	const [editing, setEditing] = useState(false);

	const handleCopy = async () => {
		try {
			await copy(message?.toString() || '');
			new Notice(t('Text copied to clipboard'));
		} catch (error) {
			console.error(error);
			new Notice(t('Failed to copy text to clipboard'));
		}
	};

	const handleEdit: React.FormEventHandler<HTMLFormElement> = event => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const message = form.get('message')?.toString() ?? '';
		setEditing(false);
		onEditMessage(id, message);
	};

	return (
		<div
			className={twMerge(
				clsx('relative m-0 p-3 w-full inline-block group', {
					[`bg-[var(--background-primary)]`]: type === 'bot',
				})
			)}
		>
			<div data-component="userMessageToolBar" className="flex justify-between items-center h-5">
				<span data-component="username" className="block text-sm font-bold text-[var(--interactive-accent)] m-0">
					{name}
				</span>
				{!showLoading && (
					<div data-component="buttonContainer" className="invisible group-hover:visible m-0 flex justify-between items-center">
						<SmallButton title="regenerate" className="invisible opacity-0"></SmallButton>
						<SmallButton title="edit" onClick={() => setEditing(true)}>
							<IconEdit />
						</SmallButton>
						<SmallButton title="copy" onClick={() => handleCopy()}>
							<IconCopy />
						</SmallButton>
						<SmallButton title="trash" onClick={() => onDeleteMessage(id)}>
							<IconTrash />
						</SmallButton>
					</div>
				)}
			</div>
			<div className="m-0 peer">
				{editing ? (
					<form onSubmit={handleEdit}>
						<textarea name="message" className="w-full h-20" defaultValue={message?.toString()}></textarea>
						<div className="flex justify-end gap-1">
							<SmallButton type="button" title="cancel" onClick={() => setEditing(false)} className="w-fit">
								{t('Cancel')}
							</SmallButton>
							<SmallButton type="submit" title="save" className="w-fit">
								{t('Save')}
							</SmallButton>
						</div>
					</form>
				) : (
					<MarkdownView content={message} />
				)}
			</div>
			{showLoading && <Loading className="hidden peer-empty:block" />}
		</div>
	);
};
