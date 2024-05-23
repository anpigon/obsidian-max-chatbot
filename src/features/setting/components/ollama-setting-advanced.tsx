import {SettingItem} from '@/components/settings/setting-item';
import {DEFAULT_SETTINGS} from '@/constants';
import {usePlugin} from '@/hooks/useApp';
import {useTranslation} from 'react-i18next';

export const OllamaSettingAdvanced = () => {
	const plugin = usePlugin()!;
	const settings = plugin.settings!;
	const {t} = useTranslation('settings');

	return (
		<details className="pl-1">
			<summary className="setting-item-heading py-3">{t('Ollama Advanced Settings')}</summary>

			<SettingItem
				name="mirostat"
				description="Enable Mirostat sampling for controlling perplexity. (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)"
			>
				<input
					type="text"
					name="mirostat"
					placeholder="0"
					defaultValue={settings.providers.OLLAMA.options.mirostat || DEFAULT_SETTINGS.providers.OLLAMA.options.mirostat}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.mirostat = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostat;
						} else {
							settings.providers.OLLAMA.options.mirostat = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="mirostat_eta"
				description="Influences how quickly the algorithm responds to feedback from the generated text. A lower learning rate will result in slower adjustments, while a higher learning rate will make the algorithm more responsive. (Default: 0.1)"
			>
				<input
					type="text"
					name="mirostat_eta"
					placeholder="0.1"
					defaultValue={settings.providers.OLLAMA.options.mirostatEta || DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatEta}
					onChange={async event => {
						const floatValue = parseFloat(event.target.value);
						if (isNaN(floatValue)) {
							settings.providers.OLLAMA.options.mirostatEta = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatEta;
						} else {
							settings.providers.OLLAMA.options.mirostatEta = parseFloat(floatValue.toFixed(2));
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="mirostat_tau"
				description="Controls the balance between coherence and diversity of the output. A lower value will result in more focused and coherent text. (Default: 5.0)"
			>
				<input
					type="text"
					name="mirostat_tau"
					placeholder="5.00"
					defaultValue={settings.providers.OLLAMA.options.mirostatTau || DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatTau}
					onChange={async event => {
						const floatValue = parseFloat(event.target.value);
						if (isNaN(floatValue)) {
							settings.providers.OLLAMA.options.mirostatTau = DEFAULT_SETTINGS.providers.OLLAMA.options.mirostatTau;
						} else {
							settings.providers.OLLAMA.options.mirostatTau = parseFloat(floatValue.toFixed(2));
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem name="num_ctx" description="Sets the size of the context window used to generate the next token. (Default: 2048)">
				<input
					type="text"
					name="num_ctx"
					placeholder="2048"
					defaultValue={settings.providers.OLLAMA.options.numCtx || DEFAULT_SETTINGS.providers.OLLAMA.options.numCtx}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.numCtx = DEFAULT_SETTINGS.providers.OLLAMA.options.numCtx;
						} else {
							settings.providers.OLLAMA.options.numCtx = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="num_gqa"
				description="The number of GQA groups in the transformer layer. Required for some models, for example it is 8 for llama2:70b."
			>
				<input
					type="text"
					name="num_gqa"
					placeholder="0"
					defaultValue={settings.providers.OLLAMA.options.numGqa || DEFAULT_SETTINGS.providers.OLLAMA.options.numGqa}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.numGqa = DEFAULT_SETTINGS.providers.OLLAMA.options.numGqa;
						} else {
							settings.providers.OLLAMA.options.numGqa = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="num_thread"
				description="Sets the number of threads to use during computation. By default, Ollama will detect this for optimal performance. It is recommended to set this value to the number of physical CPU cores your system has (as opposed to the logical number of cores)."
			>
				<input
					type="text"
					name="num_thread"
					placeholder="0"
					defaultValue={settings.providers.OLLAMA.options.numThread || DEFAULT_SETTINGS.providers.OLLAMA.options.numThread}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.numThread = DEFAULT_SETTINGS.providers.OLLAMA.options.numThread;
						} else {
							settings.providers.OLLAMA.options.numThread = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="repeat_last_n"
				description="Sets how far back for the model to look back to prevent repetition. (Default: 64, 0 = disabled, -1 = num_ctx)"
			>
				<input
					type="text"
					name="repeat_last_n"
					placeholder="64"
					defaultValue={settings.providers.OLLAMA.options.repeatLastN || DEFAULT_SETTINGS.providers.OLLAMA.options.repeatLastN}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.repeatLastN = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatLastN;
						} else {
							settings.providers.OLLAMA.options.repeatLastN = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="repeat_penalty"
				description="Sets how strongly to penalize repetitions. A higher value (e.g., 1.5) will penalize repetitions more strongly, while a lower value (e.g., 0.9) will be more lenient. (Default: 1.1)"
			>
				<input
					type="text"
					name="repeat_penalty"
					placeholder="1.10"
					defaultValue={settings.providers.OLLAMA.options.repeatPenalty || DEFAULT_SETTINGS.providers.OLLAMA.options.repeatPenalty}
					onChange={async event => {
						const floatValue = parseFloat(event.target.value);
						if (isNaN(floatValue)) {
							settings.providers.OLLAMA.options.repeatPenalty = DEFAULT_SETTINGS.providers.OLLAMA.options.repeatPenalty;
						} else {
							settings.providers.OLLAMA.options.repeatPenalty = parseFloat(floatValue.toFixed(2));
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			{/* <SettingItem
            name="seed"
            description="Sets the random number seed to use for generation. Setting this to a specific number will make the model generate the same text for the same prompt."
        >
            <input
                type="text"
                name="seed"
                placeholder="0"
                defaultValue={settings.providers.OLLAMA.options.seed || DEFAULT_SETTINGS.providers.OLLAMA.options.seed}
                onChange={async event => {
                    const intValue = parseInt(event.target.value, 10);
                    if (isNaN(intValue)) {
                        settings.providers.OLLAMA.options.seed = DEFAULT_SETTINGS.providers.OLLAMA.options.seed;
                    } else {
                        settings.providers.OLLAMA.options.seed = intValue.toString();
                    }
                    await plugin.saveSettings();
                }}
            />
        </SettingItem> */}

			<SettingItem
				name="stop"
				description="Sets the stop sequences to use. When this pattern is encountered, the LLM will stop generating text and return. Multiple stop patterns may be set by specifying them as a comma-separated list in the input field."
			>
				<input
					type="text"
					name="stop, \\n, user:"
					placeholder="0"
					defaultValue={
						settings!.providers.OLLAMA.options.stop && Array.isArray(settings!.providers.OLLAMA.options.stop)
							? settings!.providers.OLLAMA.options.stop.join(', ')
							: DEFAULT_SETTINGS.providers.OLLAMA.options.stop.join(', ')
					}
					onChange={async event => {
						const value = event.target.value;
						const stopsArray = value ? value.split(',').map(s => s.trim()) : [...DEFAULT_SETTINGS.providers.OLLAMA.options.stop];
						settings.providers.OLLAMA.options.stop = stopsArray;
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="tfs_z"
				description="Tail free sampling is used to reduce the impact of less probable tokens from the output. A higher value (e.g., 2.0) will reduce the impact more, while a value of 1.0 disables this setting. (default: 1)"
			>
				<input
					type="text"
					name="tfs_z"
					placeholder="1.00"
					defaultValue={settings.providers.OLLAMA.options.tfsZ || DEFAULT_SETTINGS.providers.OLLAMA.options.tfsZ}
					onChange={async event => {
						const floatValue = parseFloat(event.target.value);
						if (isNaN(floatValue)) {
							settings.providers.OLLAMA.options.tfsZ = DEFAULT_SETTINGS.providers.OLLAMA.options.tfsZ;
						} else {
							settings.providers.OLLAMA.options.tfsZ = parseFloat(floatValue.toFixed(2));
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="top_k"
				description="Reduces the probability of generating nonsense. A higher value (e.g. 100) will give more diverse answers, while a lower value (e.g. 10) will be more conservative. (Default: 40)"
			>
				<input
					type="text"
					name="top_k"
					placeholder="40"
					defaultValue={settings.providers.OLLAMA.options.topK || DEFAULT_SETTINGS.providers.OLLAMA.options.topK}
					onChange={async event => {
						const intValue = parseInt(event.target.value, 10);
						if (isNaN(intValue)) {
							settings.providers.OLLAMA.options.topK = DEFAULT_SETTINGS.providers.OLLAMA.options.topK;
						} else {
							settings.providers.OLLAMA.options.topK = intValue;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="top_p"
				description="Works together with top-k. A higher value (e.g., 0.95) will lead to more diverse text, while a lower value (e.g., 0.5) will generate more focused and conservative text. (Default: 0.9)"
			>
				<input
					type="text"
					name="top_p"
					placeholder="1.00"
					defaultValue={settings.providers.OLLAMA.options.topP || DEFAULT_SETTINGS.providers.OLLAMA.options.topP}
					onChange={async event => {
						const floatValue = parseFloat(event.target.value);
						if (isNaN(floatValue)) {
							settings.providers.OLLAMA.options.topP = DEFAULT_SETTINGS.providers.OLLAMA.options.topP;
						} else {
							settings.providers.OLLAMA.options.topP = parseFloat(floatValue.toFixed(2));
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>

			<SettingItem
				name="keep_alive"
				description="If set to a positive duration (e.g. 20m, 1hr or 30), the model will stay loaded for the provided duration in seconds. If set to a negative duration (e.g. -1), the model will stay loaded indefinitely. If set to 0, the model will be unloaded immediately once finished. If not set, the model will stay loaded for 5 minutes by default."
			>
				<input
					type="text"
					name="keep_alive"
					placeholder="30s"
					defaultValue={settings.providers.OLLAMA.options.keepAlive || DEFAULT_SETTINGS.providers.OLLAMA.options.keepAlive}
					onChange={async event => {
						const value = event.target.value;
						const match = value.match(/^(-?\d+)(m|hr|h)?$/);
						if (match) {
							const num = parseInt(match[1]);
							const unit = match[2];

							// Convert to seconds based on the unit
							let seconds;
							if (unit === 'm') {
								seconds = num * 60; // Convert minutes to seconds
							} else if (unit === 'hr' || unit === 'h') {
								seconds = num * 3600; // Convert hours to seconds
							} else {
								seconds = num; // Assume it's already in seconds if no unit
							}

							// Store the value in seconds
							settings.providers.OLLAMA.options.keepAlive = seconds.toString();
						} else {
							// If the input is invalid, revert to the default setting
							settings.providers.OLLAMA.options.keepAlive = DEFAULT_SETTINGS.providers.OLLAMA.options.keepAlive;
						}
						await plugin.saveSettings();
					}}
				/>
			</SettingItem>
		</details>
	);
};
