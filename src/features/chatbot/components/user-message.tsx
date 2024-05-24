import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';
import {IconRegenerate} from '@/components/icons/icon-regenerate';
import {IconTrash} from '@/components/icons/icon-trash';
import {Button} from './button';

export interface UserMessageProps {
	username: string;
	message: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({username, message}) => {
	return (
		<div className="bg-[var(--background-primary)] relative m-0 p-3 w-full inline-block group whitespace-pre-wrap">
			<div data-component="userMessageToolBar" className="flex justify-between items-center h-5">
				<span data-component="username" className="block text-sm font-bold text-[var(--interactive-accent)] m-0">
					{username}
				</span>
				<div data-component="buttonContainer" className="invisible group-hover:visible m-0 flex justify-between items-center">
					<Button title="regenerate" className="invisible opacity-0">
						<IconRegenerate />
					</Button>
					<Button title="edit">
						<IconEdit />
					</Button>
					<Button title="copy">
						<IconCopy />
					</Button>
					<Button title="trash">
						<IconTrash />
					</Button>
				</div>
			</div>
			<div className="m-0 whitespace-pre-wrap">{message}</div>
		</div>
	);
};
