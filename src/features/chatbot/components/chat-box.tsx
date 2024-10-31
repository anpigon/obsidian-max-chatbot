import {forwardRef, type TextareaHTMLAttributes} from 'react';

import {usePlugin} from '@/hooks/useApp';

import {useChatbotDispatch, useChatbotState} from '../context';
import ReferenceToggle from './ReferenceToggle';
import {SelectModel} from './SelectModel';
import TextArea from './TextArea';

export interface ChatBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	controller?: AbortController;
	canStop?: boolean;
}

export const ChatBox = forwardRef<HTMLTextAreaElement, ChatBoxProps>(({controller, canStop, disabled, ...props}, ref) => {
	const plugin = usePlugin();

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
			<SelectModel disabled={disabled} />
		</div>
	);
});

ChatBox.displayName = 'ChatBox';
