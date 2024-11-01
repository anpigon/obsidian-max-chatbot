import {Trans, useTranslation} from 'react-i18next';
import {ChangeEvent, useCallback} from 'react';

import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';

export const SambaBovaSetting = () => {
	const {t} = useTranslation('settings');
	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.SAMBANOVA;

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
		<SettingItem
			name={t('Provider API Key', {name: 'SambaBova'})}
			description={
				<Trans
					t={t}
					i18nKey="Insert your provider API Key"
					values={{name: 'SambaBova'}}
					components={{a: <a href="https://cloud.sambanova.ai/apis" target="_blank" rel="noopener noreferrer" />}}
				/>
			}
		>
			<input type="password" spellCheck={false} placeholder="b61aa...3b9f24" defaultValue={providerSettings?.apiKey} onChange={handleApiKeyChange} />
		</SettingItem>
	);
};
