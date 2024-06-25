import {createContext, useContext, useMemo, useState} from 'react';

import type {Dispatch, ReactNode, SetStateAction} from 'react';

import {LLM_PROVIDERS} from '@/constants';

interface Model {
	provider: LLM_PROVIDERS;
	model: string;
}

interface SettingState {
	models: Model[];
}

interface SettingDispatch {
	setModels: Dispatch<SetStateAction<Model[]>>;
	refreshChatbotView: () => void;
}

const SettingStateContext = createContext<SettingState | undefined>(undefined);
const SettingDispatchContext = createContext<SettingDispatch | undefined>(undefined);

export const SettingProvider = ({children}: {children: ReactNode}) => {
	const [models, setModels] = useState<Model[]>([]);

	const refreshChatbotView = () => {
		globalThis.dispatchEvent(new Event('updateChatbotView', {}));
	};

	const state = useMemo(() => ({models}), [models]);
	const actions = useMemo(
		() => ({
			setModels,
			refreshChatbotView,
		}),
		[setModels]
	);

	return (
		<SettingStateContext.Provider value={state}>
			<SettingDispatchContext.Provider value={actions}>{children}</SettingDispatchContext.Provider>
		</SettingStateContext.Provider>
	);
};

export const useSettingState = (): SettingState => {
	const context = useContext(SettingStateContext);
	if (!context) {
		throw new Error('useSettingState must be used within a SettingProvider');
	}
	return context;
};

export const useSettingDispatch = (): SettingDispatch => {
	const context = useContext(SettingDispatchContext);
	if (!context) {
		throw new Error('useSettingDispatch must be used within a SettingProvider');
	}
	return context;
};
