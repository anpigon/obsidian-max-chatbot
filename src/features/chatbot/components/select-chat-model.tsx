import {useMemo, type ChangeEventHandler} from 'react';
import {twMerge} from 'tailwind-merge';

import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {useCurrentModel} from '../hooks/use-current-model';
import {Dropdown} from '@/components/form/dropdown';
import {LLM_PROVIDERS} from '@/libs/constants';

interface SelectChatModelProps {
	disabled?: boolean;
	className?: string;
}

export const SelectChatModel = ({disabled, className}: SelectChatModelProps) => {
	const providers = useEnabledLLMModels();
	const [currentModel, setCurrentModel] = useCurrentModel();

	const handleModelChange: ChangeEventHandler<HTMLSelectElement> = e => {
		const value = e.target.value;
		if (!value) return;

		const [provider, ...modelName] = value.split('/');
		const newProvider = provider as LLM_PROVIDERS;
		const newModel = modelName.join('/');

		// 현재 모델 및 설정 업데이트
		setCurrentModel(newProvider, newModel);
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

	const selectedModel = useMemo<string>(() => currentModel && `${currentModel.provider}/${currentModel.model}`, [currentModel]);

	return (
		<Dropdown
			value={selectedModel}
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
