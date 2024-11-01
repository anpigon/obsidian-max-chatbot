import {useTranslation} from 'react-i18next';
import {useState} from 'react';

import type {ChangeEventHandler, FC} from 'react';

import {SettingItem} from '@/components/settings/setting-item';
import {Toggle} from '@/components/form/toggle';
import {usePlugin} from '@/hooks/useApp';

export const DeveloperSetting: FC = () => {
	const plugin = usePlugin();
	const settings = plugin.settings!;
	const {t} = useTranslation('settings');

	const [isVerbose, setIsVerbose] = useState(settings.isVerbose);

	const handleChangeIsVerbose: ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setIsVerbose(value);
		settings.isVerbose = value;
		void plugin.saveSettings();
	};

	return (
		<>
			<SettingItem heading name={t('Developer options')} />

			<SettingItem name={t('verbose')} description={t('verbose_desc')}>
				<Toggle name="enableOllama" checked={isVerbose} onChange={handleChangeIsVerbose} />
			</SettingItem>

			<SettingItem name={t('langsmith_key')} description={t('langsmith_key_desc')} className="hidden">
				<input
					type="password"
					spellCheck={false}
					name="ollamaBaseUrl"
					defaultValue={settings.langSmithKey}
					placeholder="lsv2_sk_5...a1e5"
					onChange={event => {
						settings.langSmithKey = event.target.value?.trim();
						void plugin.saveSettings();
					}}
				/>
			</SettingItem>
		</>
	);
};
