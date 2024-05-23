import {LLM_PROVIDERS} from '@/constants';
import {ReactNode, createContext, useMemo, useState, useContext, useEffect} from 'react';

interface Model {
	provider: LLM_PROVIDERS;
	model: string;
}

interface SettingState {
	models: Model[];
}

interface SettingDispatch {
	setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}

const SettingStateContext = createContext<SettingState | undefined>(undefined);
const SettingDispatchContext = createContext<SettingDispatch | undefined>(undefined);

export const SettingProvider = ({children}: {children: ReactNode}) => {
	const [models, setModels] = useState<Model[]>([]);

	const state = useMemo(() => ({models}), [models]);
	const actions = useMemo(() => ({setModels}), [setModels]);

	useEffect(() => {
		console.log('providers');
	}, []);

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
