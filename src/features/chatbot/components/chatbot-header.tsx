import {ReactNode, type ChangeEventHandler, type FC, type PropsWithChildren} from 'react';

import {ANTHROPIC_MODELS, LLM_PROVIDERS} from '@/constants';
import {ProviderModels} from '@/hooks/useEnabledModels';
import {Dropdown} from '@/components/form/dropdown';

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
	leftComponent?: ReactNode;
	rightComponent?: ReactNode;
}

export const ChatbotHeader: FC<ChatbotHeaderProps> = ({botName, providers, disabled, currentModel, onChangeModel, leftComponent, rightComponent, children}) => {
	const handleChangeModel: ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (value) {
			const [provider, ...modelName] = value.split('/');
			onChangeModel(provider as LLM_PROVIDERS, modelName.join('/'));
		}
	};

	return (
		<div className="py-4 px-0 text-center relative">
			<h2 className="mt-0 mb-0 p-0 text-xl w-full text-center">{botName}</h2>
			<Dropdown
				className="h-fit px-0 py-1 shadow-none hover:shadow-none text-center text-xs mr-1 pr-4"
				value={`${currentModel.provider}/${currentModel.model}`}
				onChange={handleChangeModel}
				disabled={disabled}
			>
				{providers
					?.filter(({models}) => models.length > 0)
					.map(({provider, models}) => {
						let currentModels = models.filter(model => model !== 'embed');
						if (!currentModels?.length) {
							if (provider === LLM_PROVIDERS.ANTHROPIC) {
								currentModels = ANTHROPIC_MODELS;
							}
						}
						return (
							<optgroup key={provider} label={provider}>
								{currentModels.map(model => {
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

			{leftComponent && <div className="absolute top-2 left-2">{leftComponent}</div>}

			{rightComponent && <div className="absolute top-2 right-2">{rightComponent}</div>}

			{children}
		</div>
	);
};
