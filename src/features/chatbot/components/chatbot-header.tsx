import {t} from 'i18next';

import {useState, type ChangeEventHandler, type FC, type PropsWithChildren} from 'react';

import {IconButton} from '@/components/buttons/icon-button';
import {ProviderModels} from '@/hooks/useEnabledModels';
import {Dropdown} from '@/components/form/dropdown';
import {LLM_PROVIDERS} from '@/constants';
import {Drawer} from './drawer';

interface ChatbotHeaderProps extends PropsWithChildren {
	botName: string;
	providers: ProviderModels[];
	disabled: boolean;
	currentModel: {
		provider: LLM_PROVIDERS;
		model: string;
	};
	// eslint-disable-next-line no-unused-vars
	onChangeModel: (provider: LLM_PROVIDERS, modelName: string) => void;
	onStartNewChat: () => void;
}

export const ChatbotHeader: FC<ChatbotHeaderProps> = ({botName, providers, disabled, currentModel, onChangeModel, onStartNewChat}) => {
	const handleChangeModel: ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (value) {
			const [provider, ...modelName] = value.split('/');
			onChangeModel(provider as LLM_PROVIDERS, modelName.join('/'));
		}
	};

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const handleViewHistory = () => {
		setIsDrawerOpen(true);
	};
	const handleCloseDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<>
			<div className="py-4 px-0 text-center relative">
				<h2 className="mt-0 mb-0 p-0 text-xl w-full text-center">{botName}</h2>
				<Dropdown
					className="h-fit px-0 py-1 shadow-none hover:shadow-none text-center text-xs mr-1 pr-4"
					value={`${currentModel.provider}/${currentModel.model}`}
					onChange={handleChangeModel}
					disabled={disabled}
				>
					{providers
						?.filter(({provider, models}) => models.length > 0)
						.map(({provider, models}) => {
							return (
								<optgroup key={provider} label={provider}>
									{models.map(model => {
										const value = `${provider}/${model}`;
										return (
											<option key={value} value={value}>
												{model}
											</option>
										);
									})}
								</optgroup>
							);
						})}
				</Dropdown>
				<IconButton className="absolute top-2 right-2" label={t('Start new chat')} icon="plus" onClick={onStartNewChat} />
				<IconButton className="absolute top-2 left-2" label={t('view history')} icon="history" onClick={handleViewHistory} />
				<Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} side="left">
					<div className="p-4 relative">
						<h3 className="text-lg font-semibold mb-4">{t('Chat History')}</h3>
						<IconButton className="absolute top-4 right-4" label={t('Close')} icon="x" onClick={handleCloseDrawer} />
						{/* 여기에 챗 이력 목록을 추가하세요 */}
					</div>
				</Drawer>
			</div>
		</>
	);
};
