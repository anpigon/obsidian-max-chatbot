import { SettingItem } from "@/components/settings/setting-item";
import { useTranslation } from "react-i18next";

export default function AgentSetting()  {
	const {t} = useTranslation('settings');
	
	return <><SettingItem heading name={t('Agents')} /></>
}
