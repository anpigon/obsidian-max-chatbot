import {SettingItem} from '@/components/settings/setting-item';
import {useTranslation} from 'react-i18next';
import {OllamaSetting} from './components/ollama-setting';
import {ProfileSetting} from './components/profile-setting';
import {PromptSetting} from './components/prompt-setting';
import {SettingProvider} from './context';
import {DeveloperSetting} from './components/developer-setting';
import {LMStudioSetting} from './components/lm-studio-setting';
import {RestApiSetting} from './components/rest-api-setting';
import {OpenAiSetting} from './components/open-ai-setting';
import {ChatHistorySetting} from './components/chat-history-setting';
import {CommandsSetting} from './components/commands-setting';
import {GeneralSetting} from './components/general-setting';
import { UpstageSetting } from './components/upstage-setting';

export const Setting = () => {
	const {t} = useTranslation('settings');

	return (
		<SettingProvider>
			<div className="hidden">
				<ProfileSetting />
				<GeneralSetting />
				<PromptSetting />
				<ChatHistorySetting />
				<CommandsSetting />
			</div>

			{/* language models settings */}
			<SettingItem heading name={t('Language models')} />
			<OllamaSetting />
			<LMStudioSetting />
			<RestApiSetting />
			<OpenAiSetting />
			<UpstageSetting />

			{/* etc settings */}
			<DeveloperSetting />
		</SettingProvider>
	);
};
