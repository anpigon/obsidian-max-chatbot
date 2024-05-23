import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import {ChangeEventHandler} from 'react';
import {Trans, useTranslation} from 'react-i18next';

export const CommandsSetting = () => {
	const plugin = usePlugin();
	const settings = plugin!.settings!;
	const {t} = useTranslation('settings');

	const handleChangePromptSelectGenerateSystemRole: ChangeEventHandler<HTMLTextAreaElement> = async event => {
		const value = event.target.value;

		settings.editor.promptSelectGenerateSystemRole = value ?? DEFAULT_SETTINGS.editor.promptSelectGenerateSystemRole;

		await plugin!.saveSettings();
	};

	return (
		<>
			<SettingItem heading name={t('Commands')} />

			<SettingItem name={t('Prompt Select Generate System')} description={<Trans t={t} i18nKey="System role for Prompt Select Generate." />}>
				<textarea
					name="promptSelectGenerateSystemRole"
					placeholder="You are a helpful assistant."
					defaultValue={settings!.editor.promptSelectGenerateSystemRole}
					onChange={handleChangePromptSelectGenerateSystemRole}
					className="w-full"
				/>
			</SettingItem>
		</>
	);
};
