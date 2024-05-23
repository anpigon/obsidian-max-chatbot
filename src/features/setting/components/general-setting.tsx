import {
	fetchGoogleGeminiModels,
	fetchMistralModels,
	fetchOllamaModelsLegacy,
	fetchOpenAIBaseModels,
	fetchOpenRouterModels,
	fetchRestApiModels,
} from '@/apis/fetch-model-list';
import {Dropdown} from '@/components/form/dropdown';
import {Toggle} from '@/components/form/toggle';
import {SettingItem} from '@/components/settings/setting-item';
import {ANTHROPIC_MODELS, DEFAULT_MODEL, DEFAULT_SETTINGS, LLM_PROVIDERS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import {ChangeEventHandler, useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';

// Helper function to fetch models based on the source type

export const GeneralSetting = () => {
	const plugin = usePlugin()!;
	const settings = plugin.settings!;
	const {t} = useTranslation('settings');
	const [temperature, setTemperature] = useState(settings.general.temperature);
	const [maxTokens, setMaxTokens] = useState(settings.general.maxTokens);
	const [allowReferenceCurrentNote, setAllowReferenceCurrentNote] = useState(settings.general.allowReferenceCurrentNote);
	const [modelList, setModelList] = useState([DEFAULT_MODEL]);

	async function fetchModels(sourceType: LLM_PROVIDERS) {
		switch (sourceType) {
			case LLM_PROVIDERS.OLLAMA:
				return await fetchOllamaModelsLegacy(plugin);
			case LLM_PROVIDERS.REST_API:
				return await fetchRestApiModels(plugin);
			case LLM_PROVIDERS.ANTHROPIC:
				return ANTHROPIC_MODELS;
			case LLM_PROVIDERS.GOOGLE_GEMINI:
				return await fetchGoogleGeminiModels(plugin);
			case LLM_PROVIDERS.MISTRAL:
				return await fetchMistralModels(plugin);
			case LLM_PROVIDERS.OPEN_AI:
				return await fetchOpenAIBaseModels(plugin);
			case LLM_PROVIDERS.OPEN_ROUTER:
				return await fetchOpenRouterModels(plugin);
			default:
				return [];
		}
	}

	useEffect(() => {
		console.log(settings.providers.OLLAMA.enable);
	}, [settings.providers.OLLAMA.enable]);

	const modelSources = [
		{type: LLM_PROVIDERS.OLLAMA, condition: settings.providers.OLLAMA?.enable},
		{
			type: LLM_PROVIDERS.REST_API,
			condition: settings.providers.REST_API?.enable,
		},
		{
			type: LLM_PROVIDERS.ANTHROPIC,
			condition: settings.providers.ANTHROPIC?.enable,
		},
		{
			type: LLM_PROVIDERS.GOOGLE_GEMINI,
			condition: settings.providers.GOOGLE_GEMINI?.enable,
		},
		{
			type: LLM_PROVIDERS.MISTRAL,
			condition: settings.providers.MISTRAL?.enable,
		},
		{type: LLM_PROVIDERS.OPEN_AI, condition: settings.providers.OPEN_AI?.enable},
		{
			type: LLM_PROVIDERS.OPEN_ROUTER,
			condition: settings.providers.OPEN_ROUTER?.enable,
		},
	];

	const loadModels = async () => {
		const promises = modelSources.filter(({condition}) => condition).map(({type}) => fetchModels(type));
		const settledResult = await Promise.allSettled(promises);
		console.log('settledResult:', settledResult);
		const fulfilledResult = settledResult.filter(({status}) => status === 'fulfilled') as PromiseFulfilledResult<string[]>[];
		console.log('fulfilledResult', fulfilledResult);
		const loadedModels = fulfilledResult.map(({value}) => value).flat();
		console.log('load models', loadedModels);
		setModelList(prev => Array.from(new Set([...prev, ...loadedModels])));
	};

	useEffect(() => {
		loadModels();
	}, []);

	const handleChangeModel: ChangeEventHandler<HTMLSelectElement> = async event => {
		if (plugin?.settings) {
			plugin.settings.general.model = event.target.value;
			await plugin.saveSettings();
		}
	};

	const handleChangeMaxTokens: ChangeEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value;
		setMaxTokens(value);

		settings.general.maxTokens = value;
		await plugin.saveSettings();
	};

	const handleChangeTemplate: ChangeEventHandler<HTMLInputElement> = async event => {
		const value = event.target.value;
		const floatValue = parseFloat(value);

		// 부동 소수점 값이 정수인지 확인합니다.
		if (!isNaN(floatValue)) {
			if (!isNaN(floatValue)) {
				if (floatValue < 0) {
					settings.general.temperature = '0.00';
				} else if (floatValue > 2) {
					settings.general.temperature = '2.00';
				} else {
					settings.general.temperature = floatValue.toFixed(2);
				}
			} else {
				settings.general.temperature = DEFAULT_SETTINGS.general.temperature;
			}
		} else {
			// Fallback to the default value if input is not a valid number
			settings.general.temperature = DEFAULT_SETTINGS.general.temperature;
		}

		setTemperature(settings.general.temperature);
		await plugin.saveSettings();
	};

	const handleChangeAllowReferenceCurrentNote: ChangeEventHandler<HTMLInputElement> = event => {
		const value = event.target.checked;
		setAllowReferenceCurrentNote(value);

		settings.general.allowReferenceCurrentNote = value;
		plugin.saveSettings();
	};

	return (
		<>
			<SettingItem heading name={t('General')} />

			<SettingItem name={t('Model')} description={t('Choose a model.')}>
				<Dropdown value={plugin.settings!.general.model} onChange={handleChangeModel}>
					{modelList.map(model => (
						<option key={model} value={model}>
							{model}
						</option>
					))}
				</Dropdown>
			</SettingItem>

			<SettingItem
				name={t('Max Tokens')}
				description={<Trans t={t} i18nKey="The maximum number of tokens, or words, that the model is allowed to generate in its output." />}
			>
				<input type="text" name="maxTokens" placeholder="4096" value={maxTokens} onChange={handleChangeMaxTokens} step={1} />
			</SettingItem>

			<SettingItem
				name={t('Temperature')}
				description={t(
					'Temperature controls how random the generated output is. Lower values make the text more predictable, while higher values make it more creative and unpredictable.'
				)}
			>
				<input type="text" name="template" placeholder="1.00" value={temperature} onChange={handleChangeTemplate} min={0} max={2} step={0.01} />
			</SettingItem>

			<SettingItem name={t('Allow Reference Current Note')} description={t('Allow chatbot to reference current active note during conversation.')}>
				<Toggle name="allowReferenceCurrentNote" checked={allowReferenceCurrentNote} onChange={handleChangeAllowReferenceCurrentNote} />
			</SettingItem>
		</>
	);
};
