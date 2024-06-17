import {requestOllamaModels} from '@/apis/fetch-model-list';
import {Toggle} from '@/components/form/toggle';
import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {usePlugin} from '@/hooks/useApp';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import {OllamaSettingAdvanced} from './ollama-setting-advanced';
import {Icon} from '@/components/icons/icon';
import Logger from '@/utils/logging';
import {Button} from '@/components';

export const OllamaSetting = () => {
	const plugin = usePlugin();
	const settings = plugin.settings!;
	const providerSettings = settings.providers.OLLAMA;
	const {t} = useTranslation('settings');

	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState('');
	const [enable, setEnable] = useState(providerSettings?.enable);
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream);
	const handleChangeAllowStream: React.ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setAllowStream(value);
		providerSettings.allowStream = value;
		plugin.saveSettings();
	};

	const loadOllamaModels = async () => {
		setError('');
		setIsLoading(true);

		try {
			const models = await requestOllamaModels(providerSettings?.baseUrl);
			console.log('models', models);
			setIsConnected(true);

			providerSettings.models = models;
			plugin.saveSettings();
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
		if (enable) loadOllamaModels();
	}, [enable]);

	return (
		<>
			<SettingItem heading name={t('Ollama')} className="bg-secondary rounded-lg px-3">
				<Toggle
					name="enableOllama"
					checked={enable}
					onChange={event => {
						const value = event.target.checked;
						setEnable(value);
						providerSettings.enable = value;
						plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<div className={twMerge(clsx('p-3 hidden', {block: enable}))}>
				<SettingItem
					name={t('Ollama Base Url')}
					description={
						<>
							<Trans
								t={t}
								i18nKey="Enter your Ollama Base Url using"
								components={{a: <a href="https://ollama.ai/" target="_blank" rel="noopener noreferrer" />}}
							/>{' '}
							<Trans
								t={t}
								i18nKey="Run the local Ollama server by running this in your terminal"
								components={{
									a: (
										<a
											href="https://github.com/anpigon/obsidian-max-chatbot/wiki/How-to-setup-with-Ollama"
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
						name="ollamaBaseUrl"
						defaultValue={providerSettings?.baseUrl}
						placeholder={DEFAULT_SETTINGS.providers.OLLAMA.baseUrl}
						onChange={event => {
							const value = event.target.value;
							providerSettings.baseUrl = value;
							plugin.saveSettings();
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
					<Button className="mod-cta" onClick={loadOllamaModels} disabled={isLoading || !providerSettings.baseUrl}>
						{t('Connectivity Check')}
					</Button>
				</SettingItem>

				<SettingItem name={t('Allow Stream')} description={t('Allow the model to stream responses.', {name: 'Ollama'})}>
					<Toggle name="allowStream" checked={allowStream} onChange={handleChangeAllowStream} />
				</SettingItem>

				<OllamaSettingAdvanced />
			</div>
		</>
	);
};