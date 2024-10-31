import {ChangeEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';

export const GoogleSetting = () => {
	const {t} = useTranslation('settings');
	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.GOOGLE_GEMINI;

	const saveSettings = useCallback(async () => {
		await plugin.saveSettings();
		refreshChatbotView();
	}, [plugin]);

	const handleApiKeyChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			providerSettings.apiKey = event.target.value?.trim();
			void saveSettings();
		},
		[providerSettings, saveSettings]
	);

	return (
		<SettingItem name={t('Provider API Key', {name: 'Google'})} description={t('Insert your provider API Key', {name: 'Google'})}>
			<input type="password" spellCheck={false} placeholder="up_fJN...ETmB" defaultValue={providerSettings?.apiKey} onChange={handleApiKeyChange} />
		</SettingItem>
	);
};
