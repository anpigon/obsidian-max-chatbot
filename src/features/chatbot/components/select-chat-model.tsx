import {type ChangeEventHandler} from 'react';
import {twMerge} from 'tailwind-merge';

import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {useCurrentModel} from '../hooks/use-current-model';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {Dropdown} from '@/components/form/dropdown';
import {LLM_PROVIDERS} from '@/libs/constants';

interface SelectChatModelProps {
	disabled?: boolean;
	className?: string;
}

export const SelectChatModel = ({disabled, className}: SelectChatModelProps) => {
	const plugin = usePlugin();
	const settings = useSettings();
	const providers = useEnabledLLMModels();
	const [currentModel, setCurrentModel] = useCurrentModel(settings);

	const handleModelChange: ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (!value) return;

		const [provider, ...modelName] = value.split('/');
		const newProvider = provider as LLM_PROVIDERS;
		const newModel = modelName.join('/');

		// 현재 모델 및 설정 업데이트
		setCurrentModel(newProvider, newModel);
		settings.general.provider = newProvider;
		settings.general.model = newModel;

		void plugin.saveSettings();
	};

	// 모델 옵션 렌더링
	const renderModelOptions = () => {
		return providers.map(({provider, models}) => {
			return (
				<optgroup key={provider} label={provider}>
					{models.map(model => (
						<option key={`${provider}/${model.id}`} value={`${provider}/${model.id}`}>
							{model.name}
						</option>
					))}
				</optgroup>
			);
		});
	};

	return (
		<Dropdown
			value={`${currentModel.provider}/${currentModel.model}`}
			onChange={handleModelChange}
			disabled={disabled}
			className={twMerge(
				'bg-none bg-transparent hover:bg-transparent',
				'focus:outline-none shadow-none focus:shadow-none hover:shadow-none',
				'text-xs text-[var(--text-faint)]',
				'h-4 w-40 min-w-[10rem]',
				'cursor-pointer',
				className
			)}
		>
			{renderModelOptions()}
		</Dropdown>
	);
};
