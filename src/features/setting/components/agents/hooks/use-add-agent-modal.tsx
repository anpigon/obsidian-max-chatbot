import Logger from '@/utils/logging';
import {useEffect, useRef} from 'react';
import {AddAgentModal, AddAgentModalReturn} from '../add-agent-modal';

export const useAddAgentModal = () => {
	const addAgentModalRef = useRef<HTMLDialogElement>(null);

	// eslint-disable-next-line no-unused-vars
	let resolvePromise: (value: AddAgentModalReturn) => void;

	useEffect(() => {
		const onAddAgentModalClose = () => {
			Logger.info('onAddAgentModalClose', addAgentModalRef.current?.returnValue);
			const data = JSON.parse(addAgentModalRef.current?.returnValue || '{}') as AddAgentModalReturn;
			resolvePromise?.(data);
			resolvePromise = () => {};
		};

		addAgentModalRef.current?.addEventListener('close', onAddAgentModalClose);

		return () => {
			addAgentModalRef.current?.removeEventListener('close', onAddAgentModalClose);
		};
	}, []);

	const open = () => {
		return new Promise<AddAgentModalReturn>(resolve => {
			resolvePromise = resolve;
			addAgentModalRef.current?.showModal();
		});
	};

	const onConfirm = (data: AddAgentModalReturn) => {
		if (resolvePromise) {
			resolvePromise(data);
			resolvePromise = () => {};
		}
	};

	const Modal = <AddAgentModal ref={addAgentModalRef} onConfirm={onConfirm} />;

	return [Modal, open] as [typeof Modal, typeof open];
};
