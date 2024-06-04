import clsx from 'clsx';
import {useCopyToClipboard} from 'usehooks-ts';

import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';
import {IconTrash} from '@/components/icons/icon-trash';

import {twMerge} from 'tailwind-merge';
import {Button} from './button';
import {Loading} from './loading';
import {Notice} from 'obsidian';
import { t } from 'i18next';

interface MessageProps {
	id: string;
	type: 'bot' | 'user';
	name: string;
	message: React.ReactNode;
	showLoading?: boolean;
	onDeleteMessage: (id: string) => void;
}

export const Message: React.FC<MessageProps> = ({name, message, onDeleteMessage, id, type, showLoading = false}) => {
	const [copiedText, copy] = useCopyToClipboard();

	const handleCopy = async () => {
		try {
			await copy(message?.toString() || '');
			new Notice(t('Text copied to clipboard'));
		} catch (error) {
			console.error(error);
			new Notice(t('Failed to copy text to clipboard'));
		}
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
						<Button title="edit">
							<IconEdit />
						</Button>
						<Button title="copy" onClick={handleCopy}>
							<IconCopy />
						</Button>
						<Button title="trash" onClick={() => onDeleteMessage(id)}>
							<IconTrash />
						</Button>
					</div>
				)}
			</div>
			<div className="m-0 whitespace-pre-wrap break-words *:m-0 *:leading-6 peer">{message}</div>
			{showLoading && <Loading className="hidden peer-empty:block" />}
		</div>
	);
};
