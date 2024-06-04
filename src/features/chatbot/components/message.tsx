import clsx from 'clsx';

import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';
import {IconTrash} from '@/components/icons/icon-trash';

import {twMerge} from 'tailwind-merge';
import {Button} from './button';
import {Loading} from './loading';

interface MessageProps {
	name: string;
	message: React.ReactNode;
	onDeleteMessage: (id: string) => void;
	id: string;
	showLoading?: boolean;
	type: 'bot' | 'user';
}

export const Message: React.FC<MessageProps> = ({name, message, onDeleteMessage, id, type, showLoading = false}) => {
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
						<Button title="copy">
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
