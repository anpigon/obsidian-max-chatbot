import {useCallback, useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import clsx from 'clsx';

import {SettingItem} from '@/components/settings/setting-item';
import {fetchRestApiModels} from '@/apis/fetch-model-list';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {useSettingDispatch} from '../../context';
import {Toggle} from '@/components/form/toggle';
import {Icon} from '@/components/icons/icon';
import Logger from '@/libs/logging';
import {Button} from '@/components';

export const RestApiSetting = () => {
	const {t} = useTranslation('settings');

	const plugin = usePlugin();
	const settings = useSettings();
	const {refreshChatbotView} = useSettingDispatch();
	const providerSettings = settings.providers.REST_API;

	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [enable, setEnable] = useState(providerSettings?.enable ?? false);
	const [baseUrl, setBaseUrl] = useState(providerSettings?.baseUrl ?? '');
	const [apiKey, setApiKey] = useState(providerSettings?.apiKey ?? '');
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream);

	const saveSettings = useCallback(async () => {
		await plugin.saveSettings();
		refreshChatbotView();
	}, [plugin]);

	const loadModels = async () => {
		if (!baseUrl) {
			setError('Please enter a valid URL');
			setIsConnected(false);
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			const models = await fetchRestApiModels({
				...providerSettings,
				baseUrl,
				apiKey,
				allowStream,
			});
			Logger.info(models);
			setIsConnected(true);
			providerSettings.models = models;
			saveSettings();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			Logger.error(err);
			setError(err.message);
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (enable && baseUrl) {
			loadModels();
		}
	}, [enable]);

	return (
		<>
			<SettingItem heading name={t('REST API Connection')} className="bg-secondary rounded-lg !px-3  mt-1">
				<Toggle
					checked={enable}
					onChange={event => {
						const value = event.target.checked;
						setEnable(value);
						providerSettings.enable = value;
						saveSettings();
					}}
				/>
			</SettingItem>

			<div className={twMerge(clsx('p-3 hidden', {block: enable}))}>
				<SettingItem name={t('REST API URL')} description={t('Enter your REST API URL')}>
					<input
						type="text"
						spellCheck={false}
						defaultValue={baseUrl}
						placeholder="http://localhost:8000/v1"
						onChange={event => {
							const value = event.target.value?.trim();
							setBaseUrl(value);
							providerSettings.baseUrl = value;
							saveSettings();
						}}
					/>
				</SettingItem>

				<SettingItem name={t('API Key (Optional)')} description={t('Insert API Key (Optional)')}>
					<input
						type="password"
						spellCheck={false}
						placeholder="insert-api-key-here"
						defaultValue={apiKey}
						onChange={event => {
							const value = event.target.value?.trim();
							setApiKey(value);
							providerSettings.apiKey = value;
							saveSettings();
						}}
					/>
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
					<Button className="mod-cta !max-w-[50%]" onClick={loadModels} disabled={isLoading || !providerSettings.baseUrl}>
						{t('Connectivity Check')}
					</Button>
				</SettingItem>

				<SettingItem name={t('Allow Stream')} description={t('Allow the model to stream responses.', {name: 'REST API'})}>
					<Toggle
						name="allowStream"
						checked={allowStream}
						onChange={event => {
							const value = event.target.checked;
							setAllowStream(value);
							providerSettings.allowStream = value;
							saveSettings();
						}}
					/>
				</SettingItem>
			</div>
		</>
	);
};
