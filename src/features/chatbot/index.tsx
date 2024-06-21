import {ChatbotProvider} from './context';
import {Chatbot} from './chatbot';

export default () => {
	return (
		<ChatbotProvider>
			<Chatbot />
		</ChatbotProvider>
	);
};
