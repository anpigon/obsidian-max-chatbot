import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';

import { AnthropicSetting } from './anthropic-setting';
import { UpstageSetting } from './upstage-setting';
import { GoogleSetting } from './google-setting';
import {OpenAiSetting} from './open-ai-setting';
import { GroqSetting } from './groq-setting';
import { SambaBovaSetting } from './sambanova-setting';

export default function LanguageModels() {
	const {t} = useTranslation('settings');

	return (
		<>
			<SettingItem heading name={t('Language models')} />
			{/* <OllamaSetting /> */}
			{/* <RestApiSetting /> */}
			<OpenAiSetting />
			<AnthropicSetting />
			<GoogleSetting />
			<GroqSetting />
			<UpstageSetting />
			<div className="hidden">
				<SambaBovaSetting />
			</div>
		</>
	);
}
