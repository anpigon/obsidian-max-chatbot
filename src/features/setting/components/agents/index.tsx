import {OllamaEmbeddings} from '@langchain/community/embeddings/ollama';
import {useTranslation} from 'react-i18next';

import {useState, useTransition} from 'react';

import {obsidianDocumentLoader} from '@/libs/utils/obsidian-document-loader';
import {SettingItem} from '@/components/settings/setting-item';
import {useAddAgentModal} from './hooks/useAddAgentModal';
import AddAgentModal from '@/features/add-agent-modal';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {OramaStore} from '@/libs/local-vector-store';
import {Button, IconButton} from '@/components';
import Logger from '@/libs/logging';
import {Agent} from '../../types';

export default function AgentSetting() {
	const plugin = usePlugin();
	const settings = useSettings();
	const {t} = useTranslation('settings');
	const [agents, setAgents] = useState<Agent[]>(settings.agents || []);

	const modal = useAddAgentModal();
	const [_, transition] = useTransition();

	const handleTest = async () => {
		const embeddings = new OllamaEmbeddings({
			model: 'nomic-embed-text',
			baseUrl: 'http://localhost:11434',
			maxRetries: 3,
			requestOptions: {
				useMMap: true,
				numThread: 6,
				numGpu: 1,
			},
		});

		const mdFiles = plugin.app.vault.getMarkdownFiles();
		const docs = await obsidianDocumentLoader(
			plugin.app,
			mdFiles
			// mdFiles.filter(f => f.path.startsWith('Chats/'))
		);
		Logger.info(docs);

		const vectorStore = new OramaStore(embeddings, {similarityThreshold: 0.1});
		await vectorStore.create('test');
		const ids = await vectorStore.addDocuments(docs);
		Logger.info('vectorSize', vectorStore.getData().vectorSize);
		Logger.info('ids', ids);

		Logger.info('vectorStoreData', vectorStore.getData());
		await plugin.saveVectorStoreData('vector_store', vectorStore.getData());
		Logger.info('Saved vector store data');

		const vectorStoreData = await plugin.loadVectorStoreData('vector_store');
		await vectorStore.restore(vectorStoreData);

		Logger.info('similaritySearch', await vectorStore.similaritySearchWithScore('private AI personal knowledge', 10));
		const retriever = vectorStore.asRetriever({k: 10});
		Logger.info('retriever', await retriever.invoke('private AI personal knowledge'));
	};

	const handleAddAgent = async () => {
		const data = await modal.open();
		Logger.info('Modal confirmed with data:', data);

		const newAgent: Agent = {
			id: Date.now().toString(36),
			agentName: data.agentName,
			description: data.description,
			systemPrompt: data.systemPrompt,
			llmProvider: data.model.provider,
			llmModel: data.model.modelName,
			embeddingProvider: data.embedding?.provider,
			embeddingModel: data.embedding?.modelName,
			knowledgeList: data.knowledgeList,
			vectorStore: 'Local',
			enable: true,
		};

		transition(() => {
			if (!settings.agents) settings.agents = [];
			settings.agents.push(newAgent);
			plugin
				.saveSettings()
				.then(() => {
					setAgents(settings.agents);
				})
				.catch(() => {
					globalThis.alert('An error occurred while saving the settings. Please try again.');
				});
		});
	};

	const handleDeleteAgent = (id: string) => {
		if (!globalThis.confirm(t('Are you sure you want to delete?'))) return;
		transition(() => {
			if (settings.agents.length) {
				const index = settings.agents.findIndex(agent => agent.id === id);
				if (index !== -1) {
					settings.agents.splice(index, 1);
					plugin
						.saveSettings()
						.then(() => {
							setAgents(settings.agents);
						})
						.catch(() => {
							globalThis.alert('An error occurred while saving the settings. Please try again.');
						});
				}
			}
		});
	};

	return (
		<>
			<SettingItem heading name={t('Agents')}>
				<Button onClick={handleAddAgent}>Add Agents</Button>
			</SettingItem>
			{/* <SettingItem name="">
				<Button onClick={handleTest}>Test</Button>
			</SettingItem> */}
			<>
				{agents.map(agent => {
					return (
						<SettingItem key={agent.id} name={agent.agentName} description={agent.description}>
							<IconButton icon="edit" label="edit" onClick={() => {}} />
							<IconButton icon="trash" label="delete" onClick={() => handleDeleteAgent(agent.id)} />
						</SettingItem>
					);
				})}
				{agents.length === 0 && <div className="setting-item-description">{t('No agents available. Click "Add Agents" to get started.')}</div>}
			</>

			{AddAgentModal}
		</>
	);
}
