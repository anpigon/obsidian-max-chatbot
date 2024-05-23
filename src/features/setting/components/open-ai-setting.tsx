import {requestOpenAIModels} from '@/apis/fetch-model-list';
import {Toggle} from '@/components/form/toggle';
import {Icon} from '@/components/icons/icon';
import {SettingItem} from '@/components/settings/setting-item';
import {usePlugin} from '@/hooks/useApp';
import Logger from '@/utils/logging';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';

export const OpenAiSetting = () => {
	const plugin = usePlugin()!;
	const settings = plugin.settings!;
	const providerSettings = settings.providers.OPEN_AI;
	const {t} = useTranslation('settings');

	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState('');
	const [enable, setEnable] = useState(providerSettings?.enable ?? false);
	const [allowStream, setAllowStream] = useState(providerSettings?.allowStream);

	const handleChangeAllowStream: React.ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setAllowStream(value);
		providerSettings.allowStream = value;
		plugin!.saveSettings();
	};

	const loadModels = async () => {
		if (!providerSettings.baseUrl) {
			setError('Please enter a valid URL');
			setIsConnected(false);
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			const models = await requestOpenAIModels(providerSettings);
			Logger.info(models);
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
		if (enable && providerSettings.baseUrl) loadModels();
	}, [enable]);

	return (
		<>
			<SettingItem heading name={t('OpenAI')} className="bg-secondary rounded-lg px-3  mt-1">
				<Toggle
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
				<SettingItem name={t('OpenAI API Key')} description={t('Insert your OpenAI API Key')}>
					<input
						type="password"
						spellCheck={false}
						placeholder="sk-aOO-...Cvll"
						defaultValue={providerSettings?.apiKey}
						onChange={event => {
							const value = event.target.value?.trim();
							providerSettings.apiKey = value;
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
					<button className="mod-cta" onClick={loadModels} disabled={isLoading}>
						{t('Connectivity Check')}
					</button>
				</SettingItem>

				<SettingItem
					name={t('Allow Stream')}
					description={t('Allow the model to stream responses.', {name: 'OpenAI'})}
				>
					<Toggle name="allowStream" checked={allowStream} onChange={handleChangeAllowStream} />
				</SettingItem>
			</div>
		</>
	);
};
