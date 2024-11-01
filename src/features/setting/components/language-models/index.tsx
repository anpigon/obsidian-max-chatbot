import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';

import {AnthropicSetting} from './anthropic-setting';
import {UpstageSetting} from './upstage-setting';
import {OpenAiSetting} from './open-ai-setting';
import {GoogleSetting} from './google-setting';
import {GroqSetting} from './groq-setting';

export default function LanguageModels() {
	const {t} = useTranslation('settings');

	return (
		<>
			<SettingItem heading name={t('Language models')} />
			{/* <OllamaSetting /> */}
			{/* <RestApiSetting /> */}
			{/* `<SambaBovaSetting />` */}
			<OpenAiSetting />
			<AnthropicSetting />
			<GoogleSetting />
			<GroqSetting />
			<UpstageSetting />
		</>
	);
}
