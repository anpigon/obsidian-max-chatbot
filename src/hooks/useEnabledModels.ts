import {useEffect, useState} from 'react';

import {LLM_PROVIDERS} from '@/libs/constants';
import {useSettings} from './useApp';

import {CHAT_MODEL_OPTIONS, ChatModelOption} from '@/libs/constants/chat-models';

import type {LLMProviderSettings} from '@/features/setting/types';

export type ProviderModels = {
	provider: LLM_PROVIDERS;
	models: ChatModelOption[];
};

export const useEnabledLLMModels = () => {
	const settings = useSettings();
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		if (!settings?.providers) return;

		const filteredModels = Object.entries<ChatModelOption[]>(CHAT_MODEL_OPTIONS)
			.filter(([provider, models]) => {
				if (!models?.length) return false;
				if (!(provider in settings.providers)) return false;
				const setting = settings.providers[provider as keyof LLMProviderSettings];
				return setting.apiKey || setting.enable;
			})
			.map(([provider, models]) => ({
				provider: provider as LLM_PROVIDERS,
				models,
			}));

		setModels(filteredModels);
	}, [settings]);

	return models;
};

export const useEnabledEmbeddingModel = () => {
	const settings = useSettings();
	const [models, setModels] = useState<ProviderModels[]>([]);

	useEffect(() => {
		setModels([]);
	}, [settings]);

	return models;
};
