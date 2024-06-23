import {OllamaEmbeddings} from '@langchain/community/embeddings/ollama';
import {useTranslation} from 'react-i18next';

import {useState} from 'react';

import {obsidianDocumentLoader} from '@/utils/obsidian-document-loader';
import {SettingItem} from '@/components/settings/setting-item';
import {useAddAgentModal} from './hooks/useAddAgentModal';
import AddAgentModal from '@/features/add-agent-modal';
import {OramaStore} from '@/utils/local-vector-store';
import {usePlugin, useSettings} from '@/hooks/useApp';
import {Button, IconButton} from '@/components';
import Logger from '@/utils/logging';
import {Agent} from '../../types';

export default function AgentSetting() {
	const plugin = usePlugin();
	const settings = useSettings();
	const {t} = useTranslation('settings');
	const [agents, setAgents] = useState<Agent[]>(settings.agents || []);

	const modal = useAddAgentModal();

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

		plugin.settings?.agents.push(newAgent);
		await plugin.saveSettings();

		setAgents(prev => [...prev, newAgent]);
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
							<IconButton icon="trash" label="delete" onClick={() => {}} />
						</SettingItem>
					);
				})}
			</>

			{AddAgentModal}
		</>
	);
}
