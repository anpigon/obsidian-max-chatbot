import {Button, Dropdown, Search, SettingItem, Toggle} from '@/components';
import {useEnabledEmbeddingModel, useEnabledLLMModels} from '@/hooks/useEnabledModels';
import Logger from '@/utils/logging';
import clsx from 'clsx';
import mergeRefs from 'merge-refs';
import {FormEventHandler, forwardRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {twMerge} from 'tailwind-merge';

export interface AddAgentModalReturn {
	agentName: string;
}

export interface AddAgentModalProps {
	// eslint-disable-next-line no-unused-vars
	onConfirm: (data: AddAgentModalReturn) => void;
}

export const AddAgentModal = forwardRef<HTMLDialogElement, AddAgentModalProps>((props, forwardedRef) => {
	const {t} = useTranslation('add_agent');
	const ref = useRef<HTMLDialogElement>(null);
	const mergeRef = mergeRefs<HTMLDialogElement>(ref, forwardedRef);

	const enabledLLMModels = useEnabledLLMModels();
	const enabledEmbeddingModels = useEnabledEmbeddingModel();
	Logger.debug('enabledLLMModels', enabledLLMModels);
	Logger.debug('enabledEmbeddingModels', enabledEmbeddingModels);

	const [enableKnowledge, setEnableKnowledge] = useState(false);

	const handleClose = () => {
		ref?.current?.close();
	};

	const handleConfirm: FormEventHandler<HTMLFormElement> = event => {
		Logger.info(event.target);
		const data = new FormData(event.currentTarget);
		props.onConfirm({
			agentName: data.get('agentName')?.toString() || '',
		});
	};

	return (
		<dialog className="dialog" {...props} ref={mergeRef}>
			<form method="dialog" onSubmit={handleConfirm}>
				<div className="modal-close-button" onClick={handleClose} />
				<div className="modal-content flex-col">
					<SettingItem name={t('Add Agent')} heading />

					<SettingItem name={t('Agent Name')} description={t('Enter the name of the agent you want to create.')}>
						<input required type="text" name="agentName" placeholder={t('your agent name')} />
					</SettingItem>

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

					<SettingItem heading name={t('Use Knowledge')} className="bg-secondary rounded-lg px-3">
						<Toggle
							name="enableOllama"
							checked={enableKnowledge}
							onChange={event => {
								const value = event.target.checked;
								setEnableKnowledge(value);
							}}
						/>
					</SettingItem>
					<div className={twMerge(clsx('p-3 hidden', {block: enableKnowledge}))}>
						<SettingItem
							name={t('Embedding Model')}
							description={t('Select the embedding model the agent will use to understand and process text.')}
						>
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
									onInput={() => {
										/* try {
										new FileSuggest(this.app, cb.inputEl);
									} catch {
										// eslint-disable
									} */
									}}
								/>
								<Button>Add Knowledge</Button>
							</div>
						</SettingItem>
					</div>

					<SettingItem name="">
						<button type="button" onClick={handleClose}>
							Cancel
						</button>
						<button type="submit" value="save" className="mod-cta">
							Save
						</button>
					</SettingItem>
				</div>
			</form>
		</dialog>
	);
});
