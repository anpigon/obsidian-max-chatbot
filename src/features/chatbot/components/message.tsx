import clsx from 'clsx';
import {useCopyToClipboard} from 'usehooks-ts';

import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';
import {IconTrash} from '@/components/icons/icon-trash';

import {t} from 'i18next';
import {Notice} from 'obsidian';
import {useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {Button} from './button';
import {Loading} from './loading';

interface MessageProps {
	id: string;
	type: 'bot' | 'user';
	name: string;
	message: React.ReactNode;
	showLoading?: boolean;
	onDeleteMessage: (id: string) => void;
	onEditMessage: (id: string, message: string) => void;
}

export const Message: React.FC<MessageProps> = ({id, type, name, message, showLoading = false, onDeleteMessage, onEditMessage}) => {
	const [copiedText, copy] = useCopyToClipboard();
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
				clsx('relative m-0 p-3 w-full inline-block group whitespace-pre-wrap', {
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
						<Button title="regenerate" className="invisible opacity-0"></Button>
						<Button title="edit" onClick={() => setEditing(true)}>
							<IconEdit />
						</Button>
						<Button title="copy" onClick={() => handleCopy()}>
							<IconCopy />
						</Button>
						<Button title="trash" onClick={() => onDeleteMessage(id)}>
							<IconTrash />
						</Button>
					</div>
				)}
			</div>
			<div className="m-0 whitespace-pre-wrap break-words *:m-0 *:leading-6 peer">
				{editing ? (
					<form onSubmit={handleEdit}>
						<textarea name="message" className="w-full h-20" defaultValue={message?.toString()}></textarea>
						<div className="flex justify-end gap-1">
							<Button type="button" title="cancel" onClick={() => setEditing(false)} className="w-fit">
								{t('Cancel')}
							</Button>
							<Button type="submit" title="save" className="w-fit">
								{t('Save')}
							</Button>
						</div>
					</form>
				) : (
					message
				)}
			</div>
			{showLoading && <Loading className="hidden peer-empty:block" />}
		</div>
	);
};
