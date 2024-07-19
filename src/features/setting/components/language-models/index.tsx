import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';

import {LMStudioSetting} from './lm-studio-setting';
import {RestApiSetting} from './rest-api-setting';
import {UpstageSetting} from './upstage-setting';
import {OpenAiSetting} from './open-ai-setting';
import {GoogleSetting} from './google-setting';
import {OllamaSetting} from './ollama-setting';
import {GroqSetting} from './groq-setting';

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
			{/* TODO: Anthropic API의 CORS 에러로 인해 현재는 주석 처리 됨. 이후 CORS 문제 해결 시 주석 해제 요망 */}
			{/* <AnthropicSetting /> */}
		</>
	);
}
