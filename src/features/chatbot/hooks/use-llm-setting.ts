import {LLM_PROVIDERS} from '@/constants';
import type {MAXSettings} from '@/features/setting/types';

export const useLLMSetting = (settings: MAXSettings, provider: LLM_PROVIDERS) => {
	return settings.providers[provider];
};
