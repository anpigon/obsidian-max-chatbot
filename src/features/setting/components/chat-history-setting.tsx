import {Toggle} from '@/components/form/toggle';
import {SettingItem} from '@/components/settings/setting-item';
import {SettingItemHeading} from '@/components/settings/setting-item-heading';
import {DEFAULT_SETTINGS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import {cleanFolderPath} from '@/utils/clean-folder-path';
import clsx from 'clsx';
import {TFolder} from 'obsidian';
import {ChangeEventHandler, useState} from 'react';
import {useTranslation} from 'react-i18next';

export const ChatHistorySetting = () => {
	const plugin = usePlugin();
	const settings = plugin!.settings!;
	const {t} = useTranslation('settings');
	const [error, setError] = useState({chatHistoryPath: false, templateFilePath: false});
	const [allowRenameNoteTitle, setAllowRenameNoteTitle] = useState(settings.chatHistory.allowRenameNoteTitle);

	const validateFolderPath = (folderPath: string) => {
		const folder = plugin?.app.vault.getAbstractFileByPath(folderPath);
		return folder instanceof TFolder;
	};

	const handleChangeChatHistoryPath: ChangeEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value.trim();
		if (value === settings.chatHistory.chatHistoryFolderPath) return;

		settings.chatHistory.chatHistoryFolderPath = value || DEFAULT_SETTINGS.chatHistory.chatHistoryFolderPath;

		if (value) {
			const folderPath = cleanFolderPath(settings.chatHistory.chatHistoryFolderPath);

			if (!validateFolderPath(folderPath)) {
				setError(prev => ({...prev, chatHistoryPath: true}));
				return;
			}
			setError(prev => ({...prev, chatHistoryPath: false}));

			settings.chatHistory.chatHistoryFolderPath = folderPath;
		}

		await plugin!.saveSettings();
	};

	const handleChangeTemplateFilePath: ChangeEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value.trim();
		if (value === settings.chatHistory.templateFilePath) return;

		settings.chatHistory.templateFilePath = value || DEFAULT_SETTINGS.chatHistory.templateFilePath;

		if (value) {
			const folderPath = cleanFolderPath(settings.chatHistory.templateFilePath);

			if (!validateFolderPath(folderPath)) {
				setError(prev => ({...prev, templateFilePath: true}));
				return;
			}
			setError(prev => ({...prev, templateFilePath: false}));

			settings.chatHistory.templateFilePath = folderPath;
		}

		await plugin!.saveSettings();
	};

	const handleChangeAllowRenameNoteTitle: ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setAllowRenameNoteTitle(value);

		settings.chatHistory.allowRenameNoteTitle = value;
		plugin!.saveSettings();
	};

	return (
		<>
			<SettingItemHeading name={t('Chat History')} />

			<SettingItem name={t('Chat History Folder Path')} description={t('Save your chat history in a specified folder.')}>
				<input
					type="text"
					name="chatHistoryPath"
					defaultValue={settings.chatHistory.chatHistoryFolderPath}
					placeholder={DEFAULT_SETTINGS.chatHistory.chatHistoryFolderPath}
					className={clsx({'input-error': error.chatHistoryPath})}
					onChange={handleChangeChatHistoryPath}
				/>
			</SettingItem>

			<SettingItem name={t('Template File Path')} description={t('Insert your template file path.')}>
				<input
					type="text"
					name="templateFilePath"
					defaultValue={settings.chatHistory.templateFilePath}
					placeholder={'templates/max.md'}
					className={clsx({'input-error': error.templateFilePath})}
					onChange={handleChangeTemplateFilePath}
				/>
			</SettingItem>

			<SettingItem name={t('Allow Rename Note Title')} description={t('Allow model to rename the note title when saving chat history.')}>
				<Toggle checked={allowRenameNoteTitle} onChange={handleChangeAllowRenameNoteTitle} />
			</SettingItem>
		</>
	);
};
