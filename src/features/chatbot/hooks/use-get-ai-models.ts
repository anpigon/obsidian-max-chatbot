import {LLM_PROVIDERS} from '@/constants';
import {MAXSettings} from '@/types';
import {useEffect, useState} from 'react';

export interface ProviderModels {
	provider: LLM_PROVIDERS;
	models: string[];
}

export const useGetAiModels = (settings: MAXSettings) => {
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		const models = Object.entries(settings?.providers ?? {})
			?.filter(([, provider]) => provider.enable)
			.map(([key, provider]) => ({
				provider: key as LLM_PROVIDERS,
				models: provider.models.filter((model: string) => !model.includes('embed')),
			}));
		setModels(models);
	}, []);

	return models;
};
