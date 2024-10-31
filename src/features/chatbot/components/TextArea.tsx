import { useTranslation } from "react-i18next";
import { memo, forwardRef } from "react";

import { IconButton, IconStop } from "@/components";
import { ChatBoxProps } from "./chat-box";

const TextArea = memo(
	forwardRef<HTMLTextAreaElement, ChatBoxProps>(({controller, canStop, ...props}, ref) => {
		const {t} = useTranslation('chatbot');

		return (
			<div className="flex w-full relative items-center">
				<textarea ref={ref} autoFocus className="w-full" placeholder={t('What can I help you with?')} {...props} />
				{canStop && <IconButton label="stop" icon={<IconStop />} className="absolute right-2" onClick={() => controller?.abort()} />}
			</div>
		);
	})
);

TextArea.displayName = 'TextArea';

export default TextArea;
