import {SettingItem} from '@/components/settings/setting-item';
import {useTranslation} from 'react-i18next';
import {OllamaSetting} from './components/ollama-setting';
import {ProfileSetting} from './components/profile-setting';
import {PromptSetting} from './components/prompt-setting';
import {SettingProvider} from './context';
import {DeveloperSetting} from './components/developer-setting';
import {LMStudioSetting} from './components/lm-studio-setting';
import {RestApiSetting} from './components/rest-api-setting';
import { OpenAiSetting } from './components/open-ai-setting';

export const Setting = () => {
	const {t} = useTranslation('settings');

	return (
		<SettingProvider>
			<ProfileSetting />
			{/* <GeneralSetting /> */}
			<PromptSetting />
			{/* <ChatHistorySetting /> */}
			{/* <CommandsSetting /> */}

			{/* language models settings */}
			<SettingItem heading name={t('Language models')} />
			<OllamaSetting />
			<LMStudioSetting />
			<RestApiSetting />
			<OpenAiSetting />

			{/* etc settings */}
			<DeveloperSetting />
		</SettingProvider>
	);
};
