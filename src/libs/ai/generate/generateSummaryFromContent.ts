import {StringOutputParser, JsonOutputParser} from '@langchain/core/output_parsers';
import {HumanMessage, SystemMessage} from '@langchain/core/messages';

import getSelectedAIProviderAndModel from '@/libs/settings/getSelectedAIProviderAndModel';
import createChatModelInstance from '../createChatModelInstance';
import {MAXSettings} from '@/features/setting/types';
import Logger from '@/libs/logging';

interface Summary {
	Missing_Entities: string;
	Denser_Summary: string;
}

export default async function generateSummaryFromContent(settings: MAXSettings, fileContent: string) {
	const {provider, model} = getSelectedAIProviderAndModel(settings);
	const llm = createChatModelInstance(provider, model, settings);
	// TODO: model의 performance와 max context length에 따라서 prompt를 수정해야 함
	try {
		const prompt = [
			new SystemMessage(
				`You will generate increasingly concise, entity-dense summaries of the above article.

Repeat the following 2 steps 5 times:

Step 1: Identify 1-3 important entities or pieces of information (";" delimited) from the article that are missing from the previous summary.
Step 2: Write a new, denser summary of identical length that covers every entity and detail from the previous summary plus the newly identified information.

Criteria for important information:
- Relevant to the main story
- Specific yet concise (100 characters or fewer)
- Novel (not in the previous summary)
- Faithful (present in the article)
- Can be located anywhere in the article

Guidelines:
- The first summary should be long (8-10 sentences, ~200 words) but non-specific, using verbose language and fillers (e.g., "This article discusses") to reach the word count.
- Make every word count: refine the previous summary to improve flow and make room for additional information.
- Create space through sentence fusion, compression, and removal of uninformative phrases.
- Summaries should become increasingly dense and concise while remaining self-contained and easily understood without the original article.
- New information can be placed anywhere in the summary.
- Never remove information from the previous summary. If space is limited, add fewer new pieces of information.

Ensure that each summary has exactly the same number of words.
Respond in JSON format. The JSON should be a list (length 5) of dictionaries with keys "Missing_Entities" and "Denser_Summary".
!IMPORTANT: Answer language is ${globalThis.moment().locale()}`
			),
			new HumanMessage(`#Article:\n\n${fileContent}`),
		];
		Logger.debug(prompt);
		const chain = llm.pipe<Summary[]>(new JsonOutputParser());
		const response = await chain.invoke(prompt);
		Logger.debug(response);
		return response.last()?.Denser_Summary;
	} catch (e) {
		Logger.error(e);
		const prompt = [
			new SystemMessage(
				`Please summarize the following notes in a concise and clear manner:

1. Include only the main concepts and ideas.
2. Exclude unnecessary details, focusing on the core content.
3. Maintain the original structure and logical flow.
4. Preserve technical terms or important keywords.
5. Ensure the summary is approximately 20% of the original length.
6. Use bullet points to list the key points.
7. Answer language is ${globalThis.moment().locale()}`
			),
			new HumanMessage(`#Notes content:\n\n${fileContent}`),
		];
		Logger.debug(prompt);
		const chain = llm.pipe<string>(new StringOutputParser());
		const response = await chain.invoke(prompt);
		Logger.debug(response);
		return response;
	}
}
