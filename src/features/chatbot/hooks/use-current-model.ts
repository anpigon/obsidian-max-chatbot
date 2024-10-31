import {useState} from 'react';

import {LLM_PROVIDERS} from '@/libs/constants';

import getSelectedAIProviderAndModel from '@/libs/settings/getSelectedAIProviderAndModel';

import {usePlugin, useSettings} from '@/hooks/useApp';

export const useCurrentModel = () => {
	const plugin = usePlugin();
	const settings = useSettings();
	const defaultModel = getSelectedAIProviderAndModel(settings);
	const [provider, setProvider] = useState<LLM_PROVIDERS>(defaultModel.provider);
	const [model, setModel] = useState<string>(defaultModel.model);

	// if (settings.providers[provider].models.indexOf(model) === -1) {
	// 	setModel(settings.providers[provider].models[0]);
	// }

	const setCurrentModel = (newProvider: LLM_PROVIDERS, newModel: string) => {
		setProvider(newProvider);
		setModel(newModel);

		settings.general.provider = newProvider;
		settings.general.model = newModel;
		void plugin.saveSettings();
	};

	const currentModel = {
		provider,
		model,
	};

	return [currentModel, setCurrentModel] as [
		{
			provider: LLM_PROVIDERS;
			model: string;
		},
		// eslint-disable-next-line no-unused-vars
		(newProvider: LLM_PROVIDERS, newModel: string) => void,
	];
};
