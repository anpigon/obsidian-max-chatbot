import {SettingItem} from '@/components';
import {useEnabledAIModels} from '@/hooks/useEnabledAIModels';
import Logger from '@/utils/logging';
import mergeRefs from 'merge-refs';
import {FormEventHandler, forwardRef, useRef} from 'react';
import {useTranslation} from 'react-i18next';

export interface AddAgentModalReturn {
	agentName: string;
}

export interface AddAgentModalProps {
	// eslint-disable-next-line no-unused-vars
	onConfirm: (data: AddAgentModalReturn) => void;
}

export const AddAgentModal = forwardRef<HTMLDialogElement, AddAgentModalProps>((props, forwardedRef) => {
	const {t} = useTranslation('add_agent');
	const ref = useRef<HTMLDialogElement>(null);
	const mergeRef = mergeRefs<HTMLDialogElement>(ref, forwardedRef);

	const enabledAIModels = useEnabledAIModels();
	console.log('enabledAIModels', enabledAIModels);

	const handleClose = () => {
		ref?.current?.close();
	};

	const handleConfirm: FormEventHandler<HTMLFormElement> = event => {
		Logger.info(event.target);
		const data = new FormData(event.currentTarget);
		props.onConfirm({
			agentName: data.get('agentName')?.toString() || '',
		});
	};

	return (
		<dialog className="dialog" {...props} ref={mergeRef}>
			<form method="dialog" onSubmit={handleConfirm}>
				<div className="modal-close-button" onClick={handleClose} />
				<div className="modal-content flex-col">
					<SettingItem name={t('Add Agent')} heading />
					<SettingItem name={t('Agent Name')} description={t('Enter the name of the agent you want to create.')}>
						<input required type="text" name="agentName" />
					</SettingItem>
					<SettingItem name={t('Embedding Model')} description={t('Select the embedding model the agent will use to understand and process text.')}>
						{/* 임베딩 모델을 선택한다. enabled된 언어모델에서 제공하는 모든 임베딩 모델을 가져온다. 임베딩 모델은 우선constans으로 관리하자. */}
					</SettingItem>
					<SettingItem name={t('Knowledge')} description={t('Provide custom knowledge for the bot to reference when responding.')}>
						{/* Knowledge를 추가한다. 디렉토리를 추가할지 파일을 추가할지 선택하게 하자. */}
					</SettingItem>
					<SettingItem name={t('System Prompt')} description={t('Describe how the bot should behave and respond to user messages.')}>
						{/* Knowledge를 추가한다. 디렉토리를 추가할지 파일을 추가할지 선택하게 하자. */}
					</SettingItem>
					<SettingItem name={t('Response Model')} description={t('Select the default response model for the bot.')}>
						{/* 기본 응답 모델을 선택하자. */}
					</SettingItem>
					<SettingItem name="">
						<button type="button" onClick={handleClose}>
							Cancel
						</button>
						<button type="submit" value="save" className="mod-cta">
							Save
						</button>
					</SettingItem>
				</div>
			</form>
		</dialog>
	);
});
