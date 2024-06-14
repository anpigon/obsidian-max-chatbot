import {Dropdown} from '@/components/form/dropdown';
import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/features/setting/constants';
import {usePlugin} from '@/hooks/useApp';
import {cleanFolderPath} from '@/utils/clean-folder-path';
import clsx from 'clsx';
import {TFolder} from 'obsidian';
import {ChangeEventHandler, FocusEventHandler, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export const PromptSetting = () => {
	const {t} = useTranslation('settings');
	const plugin = usePlugin();
	const settings = plugin.settings!;

	const [error, setError] = useState({promptFolderPath: false});
	const [promptList, setPromptList] = useState<string[]>([]);
	const [prompt, setPrompt] = useState('');

	const loadPromptList = () => {
		const path = settings.prompts.promptFolderPath || DEFAULT_SETTINGS.prompts.promptFolderPath;
		const promptFiles = plugin.app.vault.getFiles().filter(file => file.parent?.path === path);
		promptFiles.sort((a, b) => a.name.localeCompare(b.name));
		console.log('prompt files', promptFiles);

		setPromptList(promptFiles.map(f => f.basename));
	};

	useEffect(() => {
		loadPromptList();
	}, []);

	const handleChangePrompt: ChangeEventHandler<HTMLSelectElement> = event => {
		const value = event.target.value;
		setPrompt(value);
	};

	const validateFolderPath = (folderPath: string) => {
		const folder = plugin?.app.vault.getAbstractFileByPath(folderPath);
		return folder instanceof TFolder;
	};

	const handleChangePromptFolderPath: FocusEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value.trim();
		if (value === settings.prompts.promptFolderPath) return;

		settings.prompts.promptFolderPath = value ?? DEFAULT_SETTINGS.prompts.promptFolderPath;

		if (value) {
			const folderPath = cleanFolderPath(settings.prompts.promptFolderPath);

			if (!validateFolderPath(folderPath)) {
				setError({promptFolderPath: true});
				return;
			}
			setError({promptFolderPath: false});

			settings.prompts.promptFolderPath = folderPath;
			loadPromptList();
		}

		await plugin.saveSettings();
	};

	return (
		<>
			<SettingItem heading name={t('Prompts')} />
			<SettingItem name={t('Prompt')} description={t('Select a prompt to provide additional context to the system role.')}>
				<Dropdown name="prompt" value={prompt} onChange={handleChangePrompt}>
					<option value="">--EMPTY--</option>
					{promptList?.map(prompt => (
						<option key={prompt} value={prompt}>
							{prompt}
						</option>
					))}
				</Dropdown>
			</SettingItem>
			<SettingItem name={t('Prompt Folder Path')} description={t('Select a prompt from a specified folder.')}>
				<input
					type="text"
					spellCheck={false}
					name="promptFolderPath"
					className={clsx({'input-error': error.promptFolderPath})}
					defaultValue={settings.prompts.promptFolderPath}
					placeholder={DEFAULT_SETTINGS.prompts.promptFolderPath}
					onBlur={handleChangePromptFolderPath}
				/>
			</SettingItem>
		</>
	);
};
