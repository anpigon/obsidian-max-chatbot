import {useEffect, useState} from 'react';

import {LLM_PROVIDERS, embeddingModelKeys} from '@/libs/constants';
import {useSettings} from './useApp';

import type {MAXSettings} from '@/features/setting/types';

export interface ProviderModels {
	provider: LLM_PROVIDERS;
	models: string[];
}

const getFilteredModels = (settings: MAXSettings | undefined, filterFn: (model: string) => boolean) => {
	return Object.entries(settings?.providers ?? {})
		.filter(([, provider]) => provider.enable)
		.map(([key, provider]) => ({
			provider: key as LLM_PROVIDERS,
			models: provider.models.filter(filterFn),
		}));
};

export const useEnabledLLMModels = () => {
	const settings = useSettings();
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		setModels(getFilteredModels(settings, model => !model.includes('embed')));
	}, [settings]);

	return models;
};

export const useEnabledEmbeddingModel = () => {
	const settings = useSettings();
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		const enabledEmbeddingModel = getFilteredModels(settings, model => embeddingModelKeys.some(key => model.includes(key))).filter(
			item => item.models.length
		);
		setModels(enabledEmbeddingModel);
	}, [settings]);

	return models;
};

export const useEnabledAllAIModels = () => {
	const settings = useSettings();
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		setModels(getFilteredModels(settings, () => true));
	}, [settings]);

	return models;
};
