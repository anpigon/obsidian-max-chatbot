import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';

import {GoogleSetting} from './google-setting';
import {GroqSetting} from './groq-setting';
import {LMStudioSetting} from './lm-studio-setting';
import {OllamaSetting} from './ollama-setting';
import {OpenAiSetting} from './open-ai-setting';
import {RestApiSetting} from './rest-api-setting';
import {UpstageSetting} from './upstage-setting';

export default function LanguageModels() {
	const {t} = useTranslation('settings');

	return (
		<>
			<SettingItem heading name={t('Language models')} />
			<OllamaSetting />
			<LMStudioSetting />
			<RestApiSetting />
			<OpenAiSetting />
			<GoogleSetting />
			<GroqSetting />
			<UpstageSetting />
		</>
	);
}
