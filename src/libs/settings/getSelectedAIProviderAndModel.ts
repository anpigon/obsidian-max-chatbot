import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {MAXSettings} from '@/features/setting/types';

export default function getSelectedAIProviderAndModel(settings: MAXSettings) {
	return {
		provider: settings?.general.provider || DEFAULT_SETTINGS.general.provider,
		model: settings?.general.model || DEFAULT_SETTINGS.general.model,
	};
}
