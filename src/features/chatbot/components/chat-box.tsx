import {IconButton} from '@/components/buttons/icon-button';
import {Toggle} from '@/components/form/toggle';
import {IconStop} from '@/components/icons/icon-stop';
import {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useChatbotDispatch, useChatbotState} from '../context';
import {usePlugin} from '@/hooks/useApp';

export interface ChatBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	controller?: AbortController;
	canStop?: boolean;
}

export const ChatBox = forwardRef<HTMLTextAreaElement, ChatBoxProps>(({controller, canStop, ...props}, ref) => {
	const plugin = usePlugin();
	const {t} = useTranslation('chatbot');

	const {allowReferenceCurrentNote} = useChatbotState();
	const {setAllowReferenceCurrentNote} = useChatbotDispatch();

	return (
		<div className="flex flex-col mx-3 my-3 p-1">
			<label className="flex items-center font-ui-smaller text-[var(--text-faint)]">
				<Toggle
					checked={allowReferenceCurrentNote}
					onChange={e => {
						setAllowReferenceCurrentNote(e.target.checked);
						plugin.settings!.general.allowReferenceCurrentNote = e.target.checked;
						plugin.saveSettings();
					}}
					className="scale-50 mx-[-5px]"
				/>
				{t('Refer to the current note')}
			</label>
			<div className="flex w-full relative items-center">
				<textarea
					ref={ref}
					autoFocus
					className="w-full h-8 max-h-40 resize-none text-base overflow-y-auto text-[var(--text-normal)] placeholder:text-sm"
					// contentEditable
					placeholder={t("What can I help you with?")}
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
		</div>
	);
});

ChatBox.displayName = 'ChatBox';
