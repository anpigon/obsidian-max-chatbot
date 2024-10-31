import {ReactNode, type FC, type PropsWithChildren} from 'react';

import {ProviderModels} from '@/hooks/useEnabledModels';
import {LLM_PROVIDERS} from '@/constants';

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

export const ChatbotHeader: FC<ChatbotHeaderProps> = ({leftComponent, rightComponent}) => {
	return (
		<div className="py-4 px-0 text-center relative">
			{leftComponent && <div className="absolute top-2 left-2">{leftComponent}</div>}
			{rightComponent && <div className="absolute top-2 right-2">{rightComponent}</div>}
		</div>
	);
};
