import {IconButton} from '@/components/buttons/icon-button';
import {IconStop} from '@/components/icons/icon-stop';
import {forwardRef} from 'react';

export interface ChatBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	controller?: AbortController;
	canStop?: boolean;
}

export const ChatBox = forwardRef<HTMLTextAreaElement, ChatBoxProps>(({controller, canStop, ...props}, ref) => {
	return (
		<div className="flex items-center justify-center mx-3 my-3 p-1 relative">
			<textarea
				ref={ref}
				className="w-full h-8 max-h-40 resize-none text-base overflow-y-auto text-[var(--text-normal)] placeholder:text-sm"
				// contentEditable
				placeholder="What can I help you with?"
				{...props}
			/>
			{canStop && (
				<IconButton
					label="stop"
					icon={<IconStop />}
					className="absolute right-2"
					onClick={() => {
						controller?.abort();
					}}
				/>
			)}
		</div>
	);
});

ChatBox.displayName = 'ChatBox';
