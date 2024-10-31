import {forwardRef} from 'react';

import {usePlugin} from '@/hooks/useApp';

import {useChatbotDispatch, useChatbotState} from '../context';
import TextArea, {TextAreaProps} from './TextArea';
import ReferenceToggle from './ReferenceToggle';
import {SelectModel} from './SelectModel';

export const ChatBox = forwardRef<HTMLTextAreaElement, TextAreaProps>(({controller, canStop, disabled, ...props}, ref) => {
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
			<div className="relative">
				<TextArea {...props} ref={ref} disabled={disabled} canStop={canStop} controller={controller} />
				<div className="absolute bottom-2 left-0">
					<SelectModel disabled={disabled} />
				</div>
			</div>
		</div>
	);
});

ChatBox.displayName = 'ChatBox';
