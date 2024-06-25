import {ReactNode, createContext, useContext, useMemo, useState} from 'react';

import {useSettings} from '@/hooks/useApp';

interface ChatbotState {
	allowReferenceCurrentNote: boolean;
}

interface ChatbotDispatch {
	setAllowReferenceCurrentNote: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatbotStateContext = createContext<ChatbotState | undefined>(undefined);
const ChatbotDispatchContext = createContext<ChatbotDispatch | undefined>(undefined);

export const ChatbotProvider = ({children}: {children: ReactNode}) => {
	const settings = useSettings();

	const [allowReferenceCurrentNote, setAllowReferenceCurrentNote] = useState(settings.general.allowReferenceCurrentNote);

	const state = useMemo(() => ({allowReferenceCurrentNote}), [allowReferenceCurrentNote]);
	const actions = useMemo(() => ({setAllowReferenceCurrentNote}), [setAllowReferenceCurrentNote]);

	return (
		<ChatbotStateContext.Provider value={state}>
			<ChatbotDispatchContext.Provider value={actions}>{children}</ChatbotDispatchContext.Provider>
		</ChatbotStateContext.Provider>
	);
};

export const useChatbotState = (): ChatbotState => {
	const context = useContext(ChatbotStateContext);
	if (!context) {
		throw new Error('useChatbotState must be used within a ChatbotProvider');
	}
	return context;
};

export const useChatbotDispatch = (): ChatbotDispatch => {
	const context = useContext(ChatbotDispatchContext);
	if (!context) {
		throw new Error('useChatbotDispatch must be used within a ChatbotProvider');
	}
	return context;
};
