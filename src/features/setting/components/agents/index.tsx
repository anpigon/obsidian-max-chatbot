import {Button} from '@/components';
import {SettingItem} from '@/components/settings/setting-item';
import {useTranslation} from 'react-i18next';

export default function AgentSetting() {
	const {t} = useTranslation('settings');

	const handleAddAgent = () => {
		console.log(1);
	};

	return (
		<>
			<SettingItem heading name={t('Agents')} />
			<SettingItem name="">
				<Button onClick={handleAddAgent}>Add Agents</Button>
			</SettingItem>
		</>
	);
}
