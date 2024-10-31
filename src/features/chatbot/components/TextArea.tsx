import { memo, forwardRef, TextareaHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import { IconButton, IconStop } from "@/components";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	controller?: AbortController;
	canStop?: boolean;
}

const TextArea = memo(
	forwardRef<HTMLTextAreaElement, TextAreaProps>(({controller, canStop, ...props}, ref) => {
		const {t} = useTranslation('chatbot');

		return (
			<div className="flex w-full relative items-center">
				<textarea ref={ref} autoFocus className="w-full pb-7" placeholder={t('What can I help you with?')} {...props} />
				{canStop && <IconButton label="stop" icon={<IconStop />} className="absolute right-2" onClick={() => controller?.abort()} />}
			</div>
		);
	})
);

TextArea.displayName = 'TextArea';

export default TextArea;
