import clsx from 'clsx';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import AgentSetting from './components/agents';
import {ChatHistorySetting} from './components/chat-history-setting';
import {CommandsSetting} from './components/commands-setting';
import {DeveloperSetting} from './components/developer-setting';
import {GeneralSetting} from './components/general-setting';
import LanguageModels from './components/language-models';
import {ProfileSetting} from './components/profile-setting';
import {PromptSetting} from './components/prompt-setting';
import {SettingProvider} from './context';

export const Setting = () => {
	const {t} = useTranslation('settings');
	const selectedTabCookie = Number(globalThis.localStorage.getItem('max-selected-tab'));
	const [selectedTab, setSelectedTab] = useState(selectedTabCookie || 0);

	const tabs = [
		{label: t('Language models'), component: <LanguageModels />},
		{label: t('Agents'), component: <AgentSetting />},
		{label: t('Developer options'), component: <DeveloperSetting />},
	];

	const handleTabChange = (index: number) => () => {
		setSelectedTab(index);
		window.localStorage.setItem('max-selected-tab', index.toString());
	};

	return (
		<SettingProvider>
			<div className="workspace-tabs">
				<div className="workspace-tab-header-container bg-transparent">
					{tabs.map((tab, index) => (
						<div key={index} className="workspace-tab-header-container-inner" onClick={handleTabChange(index)}>
							<div
								className={clsx('workspace-tab-header', {
									'is-active': selectedTab === index,
								})}
								aria-label={tab.label}
								data-tooltip-delay="300"
							>
								<div className="workspace-tab-header-inner">
									<div className="workspace-tab-header-inner-title">{tab.label}</div>
									<div className="workspace-tab-header-status-container" />
								</div>
							</div>
						</div>
					))}
					<div className="workspace-tab-header-spacer" />
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
