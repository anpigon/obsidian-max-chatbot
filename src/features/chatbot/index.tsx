import {Chatbot} from './chatbot';
import {ChatbotProvider} from './context';

export default () => {
	return (
		<ChatbotProvider>
			<Chatbot />
		</ChatbotProvider>
	);
};
