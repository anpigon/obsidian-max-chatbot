import AddAgentModal, {AddAgentFormData} from '@/features/add-agent-modal';
import {usePlugin} from '@/hooks/useApp';

export const useAddAgentModal = () => {
	const plugin = usePlugin();

	// eslint-disable-next-line no-unused-vars
	let resolvePromise: (value: AddAgentFormData) => void;

	const onConfirm = (data: AddAgentFormData) => {
		if (resolvePromise) {
			resolvePromise(data);
			resolvePromise = () => {};
		}
	};

	const modal = new AddAgentModal(plugin, onConfirm);

	const open = () => {
		return new Promise<AddAgentFormData>(resolve => {
			resolvePromise = resolve;
			modal.open();
		});
	};

	const close = () => {
		modal.close();
	};

	return {
		open,
		close,
	};
};
