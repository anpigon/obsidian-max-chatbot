import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';

import {OpenAiSetting} from './open-ai-setting';

export default function LanguageModels() {
	const {t} = useTranslation('settings');

	return (
		<>
			<SettingItem heading name={t('Language models')} />
			{/* <OllamaSetting /> */}
			{/* <RestApiSetting /> */}
			<OpenAiSetting />
			{/* <GoogleSetting />
			<GroqSetting />
			<UpstageSetting />
			<AnthropicSetting /> */}
		</>
	);
}
