import {Dropdown} from '@/components/form/dropdown';
import {LLM_PROVIDERS} from '@/constants';
import {PropsWithChildren} from 'react';
import {ProviderModels} from '../hooks/use-get-ai-models';

interface ChatbotHeaderProps extends PropsWithChildren {
	botName: string;
	providers: ProviderModels[];
	currentModel: {
		provider: LLM_PROVIDERS;
		model: string;
	};
	onChangeModel: (provider: LLM_PROVIDERS, modelName: string) => void;
}

export const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({botName, providers, currentModel, onChangeModel}) => {
	const handleChangeModel: React.ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (value) {
			const [provider, ...modelName] = value.split('/');
			onChangeModel(provider as LLM_PROVIDERS, modelName.join('/'));
		}
	};


	return (
		<div className="py-4 px-0 text-center *:text-interactive-accent">
			<h2 className="mt-0 mb-0 p-0 text-xl w-full">{botName}</h2>
			<Dropdown
				className="h-fit px-0 py-1 shadow-none hover:shadow-none text-center text-xs mr-1 pr-4"
				value={`${currentModel.provider}/${currentModel.model}`}
				onChange={handleChangeModel}
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
						return null;
					})}
			</Dropdown>
		</div>
	);
};
