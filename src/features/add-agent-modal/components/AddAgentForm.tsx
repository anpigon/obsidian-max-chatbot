import {FC, FormEventHandler, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';
import clsx from 'clsx';

import {useEnabledEmbeddingModel, useEnabledLLMModels} from '@/hooks/useEnabledModels';
import {Button, Dropdown, IconButton, Search, SettingItem, Toggle} from '@/components';
import {FolderSuggest} from '@/utils/suggesters/FolderSuggester';
import {LLM_PROVIDERS} from '@/constants';
import {useApp} from '@/hooks/useApp';
import Logger from '@/utils/logging';

export interface AddAgentFormData {
	agentName: string;
	description: string;
	systemPrompt: string;
	model: {
		provider: LLM_PROVIDERS;
		modelName: string;
	};
	embedding?: {
		provider: LLM_PROVIDERS;
		modelName: string;
	};
	knowledgeList?: string[];
}

export interface AddAgentFormProps {
	// eslint-disable-next-line no-unused-vars
	onConfirm: (data: AddAgentFormData) => void;
	onClose: () => void;
}

export const AddAgentForm: FC<AddAgentFormProps> = ({onConfirm, onClose}) => {
	const app = useApp();
	const {t} = useTranslation('add_agent');

	const [knowledge, setKnowledge] = useState('');
	const [knowledgeList, setKnowledgeList] = useState<string[]>([]);
	const [enableKnowledge, setEnableKnowledge] = useState(true);
	const [enabledAddKnowledgeButton, setEnabledAddKnowledgeButton] = useState(false);

	const enabledLLMModels = useEnabledLLMModels();
	const enabledEmbeddingModels = useEnabledEmbeddingModel();
	// Logger.debug('enabledLLMModels', enabledLLMModels);
	// Logger.debug('enabledEmbeddingModels', enabledEmbeddingModels);

	const handleConfirm: FormEventHandler<HTMLFormElement> = event => {
		Logger.info(event.target);
		const data = new FormData(event.currentTarget);
		const [modelProvider, ...modelNames] = (data.get('llm')?.toString() || '')?.split('/') ?? [];
		const [embeddingProvider, ...embeddingNames] = (data.get('embedding')?.toString() || '')?.split('/') ?? [];
		onConfirm({
			agentName: data.get('agentName')?.toString() || '',
			description: data.get('description')?.toString() || '',
			systemPrompt: data.get('systemPrompt')?.toString() || '',
			model: {
				provider: modelProvider as LLM_PROVIDERS,
				modelName: modelNames.join('/'),
			},
			...(enableKnowledge && {
				embedding: {
					provider: embeddingProvider as LLM_PROVIDERS,
					modelName: embeddingNames.join('/'),
				},
				knowledgeList,
			}),
		});
	};

	useEffect(() => {
		const checkKnowledgeExists = async () => {
			const trimmedKnowledge = knowledge?.trim();
			if (trimmedKnowledge && !knowledgeList.includes(trimmedKnowledge)) {
				const exists = await app.vault.adapter.exists(trimmedKnowledge);
				setEnabledAddKnowledgeButton(exists);
			} else {
				setEnabledAddKnowledgeButton(false);
			}
		};

		checkKnowledgeExists();
	}, [knowledge]);

	return (
		<form onSubmit={handleConfirm}>
			{/* <div className="modal-content flex-col"> */}
			<SettingItem name={t('Add Agent')} heading />

			<SettingItem heading name={t('Agent Info')} className="bg-secondary rounded-lg px-3" />
			<div className={twMerge(clsx('p-3'))}>
				<SettingItem name={t('Agent Name')} description={t('Enter the name of the agent you want to create.')}>
					<input required type="text" name="agentName" placeholder={t('your agent name')} />
				</SettingItem>
				<SettingItem name={t('Description')} description={t('Write a short description that identifies the  agent.')}>
					<textarea name="description" placeholder={t('A QA chatbot that answers questions based on Obsidian notes.')} rows={2} className="w-72" />
				</SettingItem>
			</div>

			<SettingItem heading name={t('AI Model')} className="bg-secondary rounded-lg px-3" />
			<div className={twMerge(clsx('p-3'))}>
				<SettingItem name={t('Response Model')} description={t('Select the default response model for the agent.')}>
					<Dropdown required name="llm">
						{enabledLLMModels.map(({provider, models}) => {
							return (
								<optgroup key={provider} label={provider}>
									{models.map(model => {
										const value = `${provider}/${model}`;
										return (
											<option key={value} value={value}>
												{model}
											</option>
										);
									})}
								</optgroup>
							);
						})}
					</Dropdown>
				</SettingItem>
				<SettingItem name={t('System Prompt')} description={t('Describe how the bot should behave and respond to user messages.')}>
					<textarea name="systemPrompt" placeholder={t('system_prompt_placeholder')} rows={3} className="w-72" />
				</SettingItem>
			</div>

			<SettingItem heading name={t('Use Knowledge')} className="bg-secondary rounded-lg px-3">
				<Toggle
					name="enableKnowledge"
					checked={enableKnowledge}
					onChange={event => {
						const value = event.target.checked;
						setEnableKnowledge(value);
					}}
				/>
			</SettingItem>
			<div className={twMerge(clsx('p-3 hidden', {block: enableKnowledge}))}>
				<SettingItem name={t('Embedding Model')} description={t('Select the embedding model the agent will use to understand and process text.')}>
					<Dropdown required name="embedding" aria-placeholder={t('Embedding model service providers')}>
						{enabledEmbeddingModels.map(({provider, models}) => {
							return (
								<optgroup key={provider} label={provider}>
									{models.map(model => {
										const value = `${provider}/${model}`;
										return (
											<option key={value} value={value}>
												{model}
											</option>
										);
									})}
								</optgroup>
							);
						})}
					</Dropdown>
				</SettingItem>

				<SettingItem
					name={t('Knowledge')}
					description={t('Provide custom knowledge for the bot to reference when responding.')}
					className="flex-col items-start gap-3 *:w-full"
				>
					<div className="flex justify-between gap-2 w-full">
						<Search
							name="Knowledge"
							placeholder={t('Enter knowledge notes folder path')}
							className="w-full"
							value={knowledge}
							onInput={e => setKnowledge(e.currentTarget.value)}
							onSearch={e => {
								try {
									new FolderSuggest(app, e);
								} catch {
									// eslint-disable
								}
							}}
						/>
						<Button
							disabled={!enabledAddKnowledgeButton}
							onClick={() => {
								setKnowledgeList(prev => [...prev, knowledge]);
								setKnowledge('');
							}}
						>
							Add Knowledge
						</Button>
					</div>
				</SettingItem>

				<div className="mt-2">
					<SettingItem heading name={t('Knowledge List')} />
					{knowledgeList.map(knowledge => (
						<SettingItem name={knowledge} key={knowledge}>
							<IconButton
								label="delete"
								icon="trash"
								onClick={() => {
									setKnowledgeList(prev => prev.filter(item => item !== knowledge));
								}}
							/>
						</SettingItem>
					))}
					{knowledgeList.length === 0 && <span className="setting-item-description">Try adding a folder containing notes to Knowledge.</span>}
				</div>
			</div>

			<SettingItem name="">
				<button type="button" onClick={onClose}>
					Cancel
				</button>
				<button type="submit" value="save" className="mod-cta">
					Save
				</button>
			</SettingItem>
			{/* </div> */}
		</form>
	);
};
