import {DeveloperSetting} from './components/developer-setting';
import LanguageModels from './components/language-models';
import {SettingProvider} from './context';

export const Setting = () => {
	return (
		<SettingProvider>
			<LanguageModels />
			<DeveloperSetting />
		</SettingProvider>
	);
};
