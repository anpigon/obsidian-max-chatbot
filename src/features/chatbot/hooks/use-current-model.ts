import {SelectedModel, useChatbotDispatch, useChatbotState} from '../context';
import {usePlugin, useSettings} from '@/hooks/useApp';

export const useSelectedModel = () => {
	const plugin = usePlugin();
	const settings = useSettings();
	const {selectedModel} = useChatbotState();
	const {setSelectedModel} = useChatbotDispatch();

	const onChangeModel = (newModel: SelectedModel) => {
		setSelectedModel(newModel);

		settings.general.provider = newModel.provider;
		settings.general.model = newModel.model;
		void plugin.saveSettings();
	};

	return [selectedModel, onChangeModel] as [
		SelectedModel,
		// eslint-disable-next-line no-unused-vars
		(model: SelectedModel) => void,
	];
};
