import {useState} from 'react';

import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {LLM_PROVIDERS} from '@/constants';

import type {MAXSettings} from '@/features/setting/types';

interface CurrentModel {
	provider: LLM_PROVIDERS;
	model: string;
}

// 기본 설정을 가져오는 함수
const getInitialSettings = (settings: MAXSettings) => ({
	provider: settings?.general.provider || DEFAULT_SETTINGS.general.provider,
	model: settings?.general.model || DEFAULT_SETTINGS.general.model,
});

export const useCurrentModel = (settings: MAXSettings): [CurrentModel, (provider: LLM_PROVIDERS, model: string) => void] => {
	const initialSettings = getInitialSettings(settings);
	const [provider, setProvider] = useState<LLM_PROVIDERS>(initialSettings.provider);
	const [model, setModel] = useState<string>(initialSettings.model);

	const setCurrentModel = (newProvider: LLM_PROVIDERS, newModel: string) => {
		setProvider(newProvider);
		setModel(newModel);
	};

	return [
		{
			provider,
			model,
		},
		setCurrentModel,
	];
};
