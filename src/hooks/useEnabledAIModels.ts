import {LLM_PROVIDERS} from '@/constants';
import type {MAXSettings} from '@/features/setting/types';
import {useEffect, useState} from 'react';
import {useSettings} from './useApp';

export interface ProviderModels {
	provider: LLM_PROVIDERS;
	models: string[];
}

export const useEnabledAIModels = () => {
	const settings = useSettings();
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
