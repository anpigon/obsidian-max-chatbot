import {forwardRef, type TextareaHTMLAttributes} from 'react';
import {useTranslation} from 'react-i18next';

import {usePlugin} from '@/hooks/useApp';

import {useChatbotDispatch, useChatbotState} from '../context';
import ReferenceToggle from './ReferenceToggle';
import TextArea from './TextArea';

export interface ChatBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	controller?: AbortController;
	canStop?: boolean;
}

export const ChatBox = forwardRef<HTMLTextAreaElement, ChatBoxProps>(({controller, canStop, ...props}, ref) => {
	const plugin = usePlugin();
	const {t} = useTranslation('chatbot');

	const {allowReferenceCurrentNote} = useChatbotState();
	const {setAllowReferenceCurrentNote} = useChatbotDispatch();

	const handleToggleChange = (checked: boolean) => {
		setAllowReferenceCurrentNote(checked);
		if (plugin.settings) {
			plugin.settings.general.allowReferenceCurrentNote = checked;
			void plugin.saveSettings();
		}
	};

	return (
		<div className="flex flex-col mx-3 my-3 p-1">
			<ReferenceToggle checked={allowReferenceCurrentNote} onChange={handleToggleChange} />
			<TextArea {...props} ref={ref} canStop={canStop} controller={controller} />
		</div>
	);
});

ChatBox.displayName = 'ChatBox';
