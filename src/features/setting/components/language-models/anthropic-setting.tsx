import {useCallback, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import clsx from 'clsx';

import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';
import {Toggle} from '@/components/form/toggle';

export const AnthropicSetting = () => {
	const {t} = useTranslation('settings');

	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.ANTHROPIC;

	const [enable, setEnable] = useState(providerSettings?.enable ?? false);
	const [apiKey, setApiKey] = useState(providerSettings?.apiKey ?? '');
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream ?? false);

	useEffect(() => {
		const save = async () => {
			await plugin.saveSettings();
			refreshChatbotView();
		};
		void save();
	}, [enable, apiKey, allowStream, plugin]);

	return (
		<>
			<SettingItem heading name={t('Anthropic')} className="bg-secondary rounded-lg !px-3  mt-1">
				<Toggle
					checked={enable}
					onChange={event => {
						const value = event.target.checked;
						setEnable(value);
						providerSettings.enable = value;
					}}
				/>
			</SettingItem>

			<div className={twMerge(clsx('p-3 hidden', {block: enable}))}>
				<SettingItem name={t('Provider API Key', {name: 'Anthropic API'})} description={t('Insert your provider API Key', {name: 'Anthropic API'})}>
					<input
						type="password"
						spellCheck={false}
						placeholder="sk-ant-api03-...-57SQAA"
						defaultValue={apiKey}
						onChange={event => {
							const value = event.target.value?.trim();
							setApiKey(value);
							providerSettings.apiKey = value;
						}}
					/>
				</SettingItem>

				<SettingItem name={t('Allow Stream')} description={t('Allow the model to stream responses.', {name: 'Anthropic'})}>
					<Toggle
						name="allowStream"
						checked={allowStream}
						onChange={event => {
							const value = event.target.checked;
							setAllowStream(value);
							providerSettings.allowStream = value;
						}}
					/>
				</SettingItem>
			</div>
		</>
	);
};
