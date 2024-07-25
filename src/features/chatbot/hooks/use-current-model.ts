import {useState} from 'react';

import {LLM_PROVIDERS} from '@/constants';

import getSelectedAIProviderAndModel from '@/libs/settings/getSelectedAIProviderAndModel';

import type {MAXSettings} from '@/features/setting/types';

interface CurrentModel {
	provider: LLM_PROVIDERS;
	model: string;
}

export const useCurrentModel = (settings: MAXSettings): [CurrentModel, (provider: LLM_PROVIDERS, model: string) => void] => {
	const defaultModel = getSelectedAIProviderAndModel(settings);
	const [provider, setProvider] = useState<LLM_PROVIDERS>(defaultModel.provider);
	const [model, setModel] = useState<string>(defaultModel.model);

	if (settings.providers[provider].models.indexOf(model) === -1) {
		setModel(settings.providers[provider].models[0]);
	}

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
