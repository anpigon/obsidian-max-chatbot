import {type ChangeEventHandler} from 'react';
import {twMerge} from 'tailwind-merge';

import {useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {ANTHROPIC_MODELS, LLM_PROVIDERS} from '@/constants';
import {useCurrentModel} from '../hooks/use-current-model';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {Dropdown} from '@/components/form/dropdown';

interface SelectModelProps {
	disabled?: boolean;
	className?: string;
}

// 모델 목록 필터링 함수
const filterModels = (provider: LLM_PROVIDERS, models: string[]): string[] => {
	const filteredModels = models.filter(model => model !== 'embed');

	// Anthropic 프로바이더이고 모델이 없는 경우 기본 모델 사용
	if (provider === LLM_PROVIDERS.ANTHROPIC && !filteredModels.length) {
		return ANTHROPIC_MODELS;
	}

	return filteredModels;
};

export const SelectModel = ({disabled, className}: SelectModelProps) => {
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
		return providers
			?.filter(({models}) => models.length > 0)
			.map(({provider, models}) => {
				const availableModels = filterModels(provider, models);

				return (
					<optgroup key={provider} label={provider}>
						{availableModels.map(model => (
							<option key={`${provider}/${model}`} value={`${provider}/${model}`}>
								{model}
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
				'bg-transparent hover:bg-transparent',
				'focus:outline-none shadow-none focus:shadow-none hover:shadow-none',
				'cursor-pointer',
				'text-xs',
				'h-4',
				'w-40 min-w-[10rem]',
				className
			)}
		>
			{renderModelOptions()}
		</Dropdown>
	);
};
