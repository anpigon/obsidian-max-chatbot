import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {StringOutputParser} from '@langchain/core/output_parsers';

import {getDefaultModelSetting} from '@/features/chatbot/hooks/use-current-model';
import {getChatModel} from '@/features/chatbot/hooks/use-llm';
import {MAXSettings} from '@/features/setting/types';

export default async function generateTitleFromContent(settings: MAXSettings, fileContent: string) {
	const {provider, model} = getDefaultModelSetting(settings);
	const llm = getChatModel(provider, model, settings.providers[provider]);
	const prompt = [
		new SystemMessage(
			'You are a title generator. You will give succinct titles that does not contain backslashes, forward slashes, or colons. Generate a title as your response.'
		),
		new HumanMessage(fileContent),
	];
	const chain = llm.pipe(new StringOutputParser());
	const response = await chain.invoke(prompt);
	return response;
}
