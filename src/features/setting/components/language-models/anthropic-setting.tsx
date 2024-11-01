import {ChangeEvent, useCallback, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';

import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin, useSettings} from '@/hooks/useApp';
import { useSettingDispatch } from '../../context';

export const AnthropicSetting = () => {
	const {t} = useTranslation('settings');
	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.ANTHROPIC;

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
			name={t('Provider API Key', {name: 'Anthropic'})}
			description={
				<Trans
					t={t}
					i18nKey="Insert your provider API Key"
					values={{name: 'Anthropic'}}
					components={{a: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" />}}
				/>
			}
		>
			<input
				type="password"
				spellCheck={false}
				placeholder="sk-ant-api03-...-57SQAA"
				defaultValue={providerSettings?.apiKey}
				onChange={handleApiKeyChange}
			/>
		</SettingItem>
	);
};
