import {LLM_PROVIDERS} from '@/libs/constants';

import type {MAXSettings} from '@/features/setting/types';

export const useGetLLMSetting = (settings: MAXSettings, provider: LLM_PROVIDERS) => {
	return settings.providers[provider];
};
