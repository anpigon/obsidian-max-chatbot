import {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import clsx from 'clsx';

import {SettingItem} from '@/components/settings/setting-item';
import {fetchGroqModels} from '@/apis/fetch-model-list';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';
import {Toggle} from '@/components/form/toggle';
import {Icon} from '@/components/icons/icon';
import Logger from '@/utils/logging';
import {Button} from '@/components';

export const GroqSetting = () => {
	const {t} = useTranslation('settings');
	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.GROQ;

	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [enable, setEnable] = useState(providerSettings?.enable ?? false);
	const [apiKey, setApiKey] = useState(providerSettings?.apiKey ?? '');
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream);

	const saveSettings = useCallback(async () => {
		await plugin.saveSettings();
		refreshChatbotView();
	}, [plugin]);

	const handleToggleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.checked;
			setEnable(value);
			providerSettings.enable = value;
			saveSettings();
		},
		[providerSettings, saveSettings]
	);

	const handleApiKeyChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value?.trim();
			setApiKey(value);
			providerSettings.apiKey = value;
			saveSettings();
		},
		[providerSettings, saveSettings]
	);

	const handleAllowStreamChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.checked;
			setAllowStream(value);
			providerSettings.allowStream = value;
			saveSettings();
		},
		[providerSettings, saveSettings]
	);

	const loadModels = useCallback(async () => {
		setError('');
		setIsLoading(true);

		try {
			const models = await fetchGroqModels({apiKey});
			Logger.info('Groq Models:', models);
			setIsConnected(true);
			providerSettings.models = models.filter(model => model.active && model.object === 'model').map(model => model.id);
			saveSettings();
		} catch (err: unknown) {
			if (err instanceof Error) {
				Logger.error(err);
				setError(err.message);
			} else {
				Logger.error('An unknown error occurred');
				setError('An unknown error occurred');
			}
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	}, [providerSettings, saveSettings]);

	useEffect(() => {
		if (enable && apiKey) loadModels();
	}, [enable, apiKey, loadModels]);

	return (
		<>
			<SettingItem heading name={t('Groq')} className="bg-secondary rounded-lg px-3 mt-1">
				<Toggle checked={enable} onChange={handleToggleChange} />
			</SettingItem>

			<div className={twMerge(clsx('p-3 hidden', {block: enable}))}>
				<SettingItem name={t('Provider API Key', {name: 'Groq'})} description={t('Insert your provider API Key', {name: 'Groq'})}>
					<input type="password" spellCheck={false} placeholder="gsk_Im9...Rz4Qq" defaultValue={apiKey} onChange={handleApiKeyChange} />
				</SettingItem>

				<SettingItem
					name={t('Connectivity Check')}
					description={<Trans t={t} i18nKey="Test if the Api Key and proxy address are filled in correctly" />}
				>
					<div className="flex items-center mr-2 font-ui-smaller">
						{isLoading && (
							<>
								<Icon name="loader" className="animate-spin mr-1" />
								<span>{t('Checking connection')}</span>
							</>
						)}
						{!isLoading && error && (
							<>
								<Icon name="ban" className="text-red mr-1" />
								<span className="text-red max-w-32 text-ellipsis overflow-hidden whitespace-nowrap" title={error}>
									{error}
								</span>
							</>
						)}
						{!isLoading && isConnected && (
							<>
								<Icon name="check" className="text-green mr-1" />
								<span className="text-green">{t('Verify connection')}</span>
							</>
						)}
					</div>
					<Button className="mod-cta" onClick={loadModels} disabled={isLoading || !providerSettings.apiKey}>
						{t('Connectivity Check')}
					</Button>
				</SettingItem>

				<SettingItem name={t('Allow Stream')} description={t('Allow the model to stream responses.', {name: 'Groq'})}>
					<Toggle name="allowStream" checked={allowStream} onChange={handleAllowStreamChange} />
				</SettingItem>
			</div>
		</>
	);
};
