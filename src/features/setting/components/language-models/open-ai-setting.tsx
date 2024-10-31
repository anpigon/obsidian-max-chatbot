import {ChangeEventHandler, useCallback} from 'react';
import {Trans, useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';

export const OpenAiSetting = () => {
	const {t} = useTranslation('settings');

	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.OPEN_AI;

	const saveSettings = useCallback(async () => {
		await plugin.saveSettings();
		refreshChatbotView();
	}, [plugin]);

	const handleApiKeyChange: ChangeEventHandler<HTMLInputElement> = event => {
		providerSettings.apiKey = event.target.value?.trim();
		void saveSettings();
	};

	//t('Insert your provider API Key', {name: 'OpenAI API'})}
	return (
		<SettingItem
			name={t('Provider API Key', {name: 'OpenAI'})}
			description={
				<Trans
					t={t}
					i18nKey="Insert your provider API Key"
					values={{name: 'OpenAI API'}}
					components={{a: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" />}}
				/>
			}
		>
			<input type="password" spellCheck={false} placeholder="sk-aOO-...Cvll" defaultValue={providerSettings?.apiKey} onChange={handleApiKeyChange} />
		</SettingItem>
	);
};
