import {ChangeEventHandler, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

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

	return (
		<SettingItem name={t('Provider API Key', {name: 'OpenAI API'})} description={t('Insert your provider API Key', {name: 'OpenAI API'})}>
			<input type="password" spellCheck={false} placeholder="sk-aOO-...Cvll" defaultValue={providerSettings?.apiKey} onChange={handleApiKeyChange} />
		</SettingItem>
	);
};
