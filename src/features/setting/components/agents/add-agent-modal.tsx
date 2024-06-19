import {SettingItem} from '@/components';
import Logger from '@/utils/logging';
import {t} from 'i18next';
import mergeRefs from 'merge-refs';
import {FormEventHandler, forwardRef, useRef} from 'react';

export interface AddAgentModalReturn {
	agentName: string;
}

export interface AddAgentModalProps {
	// eslint-disable-next-line no-unused-vars
	onConfirm: (data: AddAgentModalReturn) => void;
}

export const AddAgentModal = forwardRef<HTMLDialogElement, AddAgentModalProps>((props, forwardedRef) => {
	const ref = useRef<HTMLDialogElement>(null);
	const mergeRef = mergeRefs<HTMLDialogElement>(ref, forwardedRef);

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
					<SettingItem name={t('Agent Name')}>
						<input required type="text" name="agentName" />
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
