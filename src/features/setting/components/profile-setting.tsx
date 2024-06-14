import {Dropdown} from '@/components/form/dropdown';
import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import {cleanFolderPath} from '@/utils/clean-folder-path';
import clsx from 'clsx';
import {TFolder} from 'obsidian';
import {ChangeEventHandler, useEffect, useState, useTransition} from 'react';
import {useTranslation} from 'react-i18next';

export const ProfileSetting: React.FC = () => {
	const plugin = usePlugin();
	const settings = plugin.settings!;
	const {t} = useTranslation('settings');
	const [, startTransition] = useTransition();

	const [selectedProfile, setSelectedProfile] = useState<string>(plugin?.settings!.profiles.profile || DEFAULT_SETTINGS.profiles.profile);
	const [error, setError] = useState({profileFolderPath: false});
	const [profileList, setProfileList] = useState<string[]>();

	const loadProfileList = () => {
		const path = settings.profiles.profileFolderPath || DEFAULT_SETTINGS.profiles.profileFolderPath;
		const profileFiles = plugin.app.vault.getFiles().filter(file => file.parent?.path === path);
		profileFiles?.sort((a, b) => a.name.localeCompare(b.name));

		const optionValues = profileFiles.map(f => f.basename);
		setProfileList(optionValues);
	};

	useEffect(() => {
		loadProfileList();
	}, []);

	const setProfile = async (profileName: string) => {
		startTransition(() => {
			setSelectedProfile(profileName);
		});

		if (plugin?.settings) {
			plugin.settings.profiles.profile = profileName ?? DEFAULT_SETTINGS.profiles.profile;
			plugin.activateView();
			await plugin.saveSettings();
		}
	};

	const handleChangeProfile: ChangeEventHandler<HTMLSelectElement> = event => {
		const value = event.target.value;
		setProfile(value);
	};

	// 폴더 유효성 검사 및 오류 설정 함수
	const validateFolderPath = (folderPath: string) => {
		const folder = plugin?.app.vault.getAbstractFileByPath(folderPath);
		return folder instanceof TFolder;
	};

	const handleChangeProfileFolderPath: ChangeEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value.trim();
		if (value === settings.profiles.profileFolderPath) return;

		settings.profiles.profileFolderPath = value || DEFAULT_SETTINGS.profiles.profileFolderPath;

		if (value) {
			const folderPath = cleanFolderPath(settings.profiles.profileFolderPath);

			if (!validateFolderPath(folderPath)) {
				setError({profileFolderPath: true});
				return;
			}
			setError({profileFolderPath: false});

			settings.profiles.profileFolderPath = folderPath;
			loadProfileList();
		}

		await plugin.saveSettings();
	};

	return (
		<>
			<SettingItem heading name={t('Profiles')} />
			<SettingItem name={t('Profile')} description={t('Select a profile.')}>
				<Dropdown value={selectedProfile} onChange={handleChangeProfile}>
					{profileList?.map(profile => (
						<option key={profile} value={profile}>
							{profile}
						</option>
					))}
				</Dropdown>
			</SettingItem>
			<SettingItem name={t('Profile Folder Path')} description={t('Select a profile from a specified folder.')}>
				<input
					type="text"
					spellCheck={false}
					name="profileFolderPath"
					placeholder={DEFAULT_SETTINGS.profiles.profileFolderPath}
					className={clsx({'input-error': error.profileFolderPath})}
					defaultValue={settings.profiles.profileFolderPath}
					onBlur={handleChangeProfileFolderPath}
				/>
			</SettingItem>
		</>
	);
};
