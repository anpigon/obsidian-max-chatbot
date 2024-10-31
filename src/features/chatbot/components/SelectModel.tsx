import {type ChangeEventHandler} from 'react';

import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {ANTHROPIC_MODELS, LLM_PROVIDERS} from '@/constants';
import {useCurrentModel} from '../hooks/use-current-model';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {Dropdown} from '@/components/form/dropdown';

function getModels(provider: LLM_PROVIDERS, models: string[]) {
	let currentModels = models.filter(model => model !== 'embed');
	if (provider === LLM_PROVIDERS.ANTHROPIC && !currentModels?.length) {
		currentModels = ANTHROPIC_MODELS;
	}
	return currentModels;
}

export const SelectModel = ({disabled}: {disabled: boolean}) => {
	const plugin = usePlugin();
	const settings = useSettings();
	const providers = useEnabledLLMModels();
	const [currentModel, setCurrentModel] = useCurrentModel(settings);

	const handleChangeModel: ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (value) {
			const [provider, ...modelName] = value.split('/');

			const newProvider = provider as LLM_PROVIDERS;
			const newModel = modelName.join('/');

			setCurrentModel(newProvider, newModel);

			settings.general.provider = newProvider;
			settings.general.model = newModel;
			void plugin.saveSettings();
		}
	};

	return (
		<Dropdown
			value={`${currentModel.provider}/${currentModel.model}`}
			onChange={handleChangeModel}
			disabled={disabled}
		>
			{providers
				?.filter(({models}) => models.length > 0)
				.map(({provider, models}) => {
					const currentModels = getModels(provider, models);
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
	);
};
