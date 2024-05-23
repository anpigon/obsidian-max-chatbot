import {IconCopy} from '@/components/icons/icon-copy';
import {IconEdit} from '@/components/icons/icon-edit';
import {IconRegenerate} from '@/components/icons/icon-regenerate';
import {IconTrash} from '@/components/icons/icon-trash';
import {Button} from './button';
import {Loading} from './loading';

export interface UserMessageProps {
	name: string;
	message: React.ReactNode;
}

export const BotMessage: React.FC<UserMessageProps> = ({name, message}) => {
	return (
		<div className="relative m-0 p-3 w-full inline-block group">
			<div data-component="userMessageToolBar" className="flex justify-between items-center h-5">
				<span data-component="username" className="block text-sm font-bold text-[var(--interactive-accent)] m-0">
					{name}
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
			<div className="m-0 break-words *:m-0 *:leading-6 peer">{message}</div>
			<Loading className="hidden peer-empty:block" />
		</div>
	);
};
