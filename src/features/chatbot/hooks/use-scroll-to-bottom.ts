import type {RefObject} from 'react';

export const useScrollToBottom = (ref: RefObject<HTMLDivElement>) => {
	const scrollToBottom = () => {
		ref.current?.scroll({
			top: ref.current?.scrollHeight,
			behavior: 'smooth',
		});
	};

	return scrollToBottom;
};
