import {PropsWithChildren, forwardRef} from 'react';

export const MessageContainer = forwardRef<HTMLDivElement, PropsWithChildren>(({children}, ref) => {
	return (
		<div ref={ref} className="max-h-screen md:max-h-[calc(100%-60px)]; mt-0 flex-grow overflow-y-auto select-text break-words">
			{children}
		</div>
	);
});
