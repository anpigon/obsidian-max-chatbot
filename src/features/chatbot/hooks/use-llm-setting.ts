import { LLM_PROVIDERS } from '@/constants';
import { MAXSettings } from '@/types';

export const useLLMSetting = (settings: MAXSettings, provider: LLM_PROVIDERS) => {
	return settings.providers[provider];
};
