import {ChangeEventHandler, useCallback, useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import clsx from 'clsx';

import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {requestLMStudioModels} from '@/apis/fetch-model-list';
import {useSettingDispatch} from '../../context';
import {Toggle} from '@/components/form/toggle';
import {Icon} from '@/components/icons/icon';
import {usePlugin} from '@/hooks/useApp';
import Logger from '@/libs/logging';
import {Button} from '@/components';

export const LMStudioSetting = () => {
	const plugin = usePlugin();
	const {refreshChatbotView} = useSettingDispatch();
	const settings = plugin.settings!;
	const providerSettings = settings.providers.LM_STUDIO;
	const {t} = useTranslation('settings');

	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState('');
	const [enable, setEnable] = useState(providerSettings?.enable ?? false);
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream);

	const saveSettings = useCallback(async () => {
		try {
			await plugin.saveSettings();
			refreshChatbotView();
		} catch (error) {
			Logger.error(error);
		}
	}, [plugin]);

	const handleChangeAllowStream: ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setAllowStream(value);
		providerSettings.allowStream = value;
		saveSettings();
	};

	const loadModels = async () => {
		setError('');
		setIsLoading(true);

		try {
			const models = await requestLMStudioModels(providerSettings);
			setIsConnected(true);
			providerSettings.models = models;
			saveSettings();
			refreshChatbotView();
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
		if (enable) loadModels();
	}, [enable]);

	return (
		<>
			<SettingItem heading name={t('LM Studio')} className="bg-secondary rounded-lg !px-3 mt-1">
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
				<SettingItem
					name={t('LM Studio Base Url')}
					description={
						<>
							<Trans
								t={t}
								i18nKey="Enter your LM Studio Base Url using"
								components={{a: <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" />}}
							/>{' '}
							<Trans
								t={t}
								i18nKey="Run the local Ollama server by running this in your terminal"
								components={{
									a: (
										<a
											href="https://github.com/anpigon/obsidian-max-chatbot/wiki/How-to-setup-with-LM-Studio"
											target="_blank"
											rel="noopener noreferrer"
										/>
									),
								}}
							/>
						</>
					}
				>
					<input
						type="text"
						spellCheck={false}
						defaultValue={providerSettings?.baseUrl}
						placeholder={DEFAULT_SETTINGS.providers.LM_STUDIO.baseUrl}
						onChange={event => {
							const value = event.target.value;
							providerSettings.baseUrl = value;
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
					<Button className="mod-cta" onClick={loadModels} disabled={isLoading || !providerSettings.baseUrl}>
						{t('Connectivity Check')}
					</Button>
				</SettingItem>

				<SettingItem name={t('Allow Stream')} description={t('Allow the model to stream responses.', {name: 'LM Studio'})}>
					<Toggle name="allowStream" checked={allowStream} onChange={handleChangeAllowStream} />
				</SettingItem>
			</div>
		</>
	);
};
