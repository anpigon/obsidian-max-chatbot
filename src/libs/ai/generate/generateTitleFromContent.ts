import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {StringOutputParser} from '@langchain/core/output_parsers';

import getSelectedAIProviderAndModel from '@/libs/settings/getSelectedAIProviderAndModel';
import {stripIllegalFileNameCharactersInString} from '@/libs/utils/fileUtil';
import createChatModelInstance from '../createChatModelInstance';
import {MAXSettings} from '@/features/setting/types';
import Logger from '@/libs/logging';

export default async function generateTitleFromContent(settings: MAXSettings, fileContent: string) {
	const {provider, model} = getSelectedAIProviderAndModel(settings);
	const llm = createChatModelInstance(provider, model, settings);
	const prompt = [
		new SystemMessage(
			`You are a title generator. You will give succinct titles that do not contain backslashes, forward slashes, or colons. Generate a title as your response. Answer language is ${globalThis.moment().locale()}`
		),
		new HumanMessage(fileContent),
	];
	Logger.debug(prompt);
	const chain = llm.pipe(new StringOutputParser());
	const response = await chain.invoke(prompt);
	Logger.debug(response);
	return stripIllegalFileNameCharactersInString(response);
}
