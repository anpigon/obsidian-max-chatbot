import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import clsx from 'clsx';

import {ChatHistorySetting} from './components/chat-history-setting';
import {DeveloperSetting} from './components/developer-setting';
import {CommandsSetting} from './components/commands-setting';
import {GeneralSetting} from './components/general-setting';
import {ProfileSetting} from './components/profile-setting';
import LanguageModels from './components/language-models';
import {PromptSetting} from './components/prompt-setting';
import AgentSetting from './components/agents';
import {SettingProvider} from './context';

export const Setting = () => {
	const {t} = useTranslation('settings');
	const selectedTabCookie = Number(globalThis.localStorage.getItem('max-selected-tab'));
	const [selectedTab, setSelectedTab] = useState(selectedTabCookie || 0);

	const tabs = [
		{label: t('Language models'), component: <LanguageModels />},
		// {label: t('Prompts'), component: <PromptsSetting />},
		// {label: t('Commands'), component: <CommandsSetting />},
		{label: t('Agents'), component: <AgentSetting />},
		// {label: t('Knowledge'), component: <KnowledgeSetting />},
		{label: t('Developer options'), component: <DeveloperSetting />},
	];

	const handleTabChange = (index: number) => () => {
		setSelectedTab(index);
		globalThis.localStorage.setItem('max-selected-tab', index.toString());
	};

	return (
		<SettingProvider>
			<div className="max-tabs">
				<div className="max-tab-header-container">
					{tabs.map((tab, index) => (
						<div key={index} className="max-tab-header-container-inner" onClick={handleTabChange(index)}>
							<div
								aria-label={tab.label}
								className={clsx('max-tab-header', {
									'is-active': selectedTab === index,
								})}
							>
								<div className="max-tab-header-inner">
									<div className="max-tab-header-inner-title">{tab.label}</div>
								</div>
							</div>
						</div>
					))}
					<div className="flex flex-grow" />
				</div>
			</div>
			<div className="workspace-tab-container flex-col py-4">
				<div className="hidden">
					<ProfileSetting />
					<GeneralSetting />
					<PromptSetting />
					<ChatHistorySetting />
					<CommandsSetting />
				</div>

				{tabs[selectedTab].component}
			</div>
		</SettingProvider>
	);
};
