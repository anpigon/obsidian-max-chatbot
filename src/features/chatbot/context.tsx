import {Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState} from 'react';

import {DEFAULT_SETTINGS} from '../setting/constants';
import {LLM_PROVIDERS} from '@/libs/constants';
import {useSettings} from '@/hooks/useApp';

export type SelectedModel = {
	provider: LLM_PROVIDERS;
	model: string;
};

interface ChatbotState {
	allowReferenceCurrentNote: boolean;
	selectedModel: SelectedModel;
}

interface ChatbotDispatch {
	setAllowReferenceCurrentNote: Dispatch<SetStateAction<boolean>>;
	setSelectedModel: Dispatch<SetStateAction<SelectedModel>>;
}

const ChatbotStateContext = createContext<ChatbotState | undefined>(undefined);
const ChatbotDispatchContext = createContext<ChatbotDispatch | undefined>(undefined);

export const ChatbotProvider = ({children}: {children: ReactNode}) => {
	const settings = useSettings();

	const [selectedModel, setSelectedModel] = useState<SelectedModel>({
		provider: settings?.general.provider || DEFAULT_SETTINGS.general.provider,
		model: settings?.general.model || DEFAULT_SETTINGS.general.model,
	});
	const [allowReferenceCurrentNote, setAllowReferenceCurrentNote] = useState(settings.general.allowReferenceCurrentNote);

	const state = useMemo(() => ({allowReferenceCurrentNote, selectedModel}), [allowReferenceCurrentNote, selectedModel]);
	const actions = useMemo(() => ({setAllowReferenceCurrentNote, setSelectedModel}), []);

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
