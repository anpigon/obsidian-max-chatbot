import {Key, useState} from 'react';

import useOnceEffect from '@/hooks/useOnceEffect';
import {ChatbotProvider} from './context';
import Logger from '@/libs/logging';
import {Chatbot} from './chatbot';

export default () => {
	const [key, setKey] = useState<Key>(0);

	useOnceEffect(() => {
		const updateChatbotView = (data: any) => {
			Logger.debug('updateChatbotView', data);
			setKey(Date.now());
		};

		globalThis.addEventListener('updateChatbotView', updateChatbotView);

		return () => {
			globalThis.removeEventListener('updateChatbotView', updateChatbotView);
		};
	});

	return (
		<ChatbotProvider>
			<Chatbot key={key} />
		</ChatbotProvider>
	);
};
