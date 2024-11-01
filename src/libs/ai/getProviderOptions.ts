import { LLMProviderSettings, MAXSettings } from "@/features/setting/types";
import { LLM_PROVIDERS } from "../constants";

export default function getProviderOptions(provider: LLM_PROVIDERS, settings: MAXSettings) {
	const isValidProvider = (provider: LLM_PROVIDERS): provider is keyof LLMProviderSettings => {
		return provider in settings.providers;
	};
	if (!isValidProvider(provider)) {
		throw new Error(`Invalid provider: ${provider}`);
	}
	const options = settings.providers[provider];
	return options;
}
