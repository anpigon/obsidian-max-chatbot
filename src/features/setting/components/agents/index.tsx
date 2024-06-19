import {Button} from '@/components';
import {SettingItem} from '@/components/settings/setting-item';
import {SystemMessage} from '@langchain/core/messages';
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory';
import {OllamaEmbeddings} from '@langchain/community/embeddings/ollama';
import {useTranslation} from 'react-i18next';
import {usePlugin} from '@/hooks/useApp';
import {TFile, normalizePath} from 'obsidian';
// import {LanceDB} from '@langchain/community/vectorstores/lancedb';
import {obsidianDocumentLoader} from '@/utils/obsidian-document-loader';
import {OramaStore} from '@/utils/local-vector-store';
import {encode} from '@msgpack/msgpack';
import Logger from '@/utils/logging';

export default function AgentSetting() {
	const plugin = usePlugin();
	const {t} = useTranslation('settings');

	const handleAddAgent = async () => {
		const embeddings = new OllamaEmbeddings({
			model: 'nomic-embed-text', // default value
			baseUrl: 'http://localhost:11434', // default value
			// requestOptions: {
			// 	useMMap: true, // use_mmap 1
			// 	numThread: 6, // num_thread 6
			// 	numGpu: 1, // num_gpu 1
			// },
			maxRetries: 0,
		});

		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/chroma
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/faiss
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/opensearch
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/qdrant
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/pgvector
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/lancedb
		/* 		const dir = normalizePath(plugin.manifest.dir + '/lancedb-');
		if (!(await plugin.app.vault.adapter.exists(dir))) {
			await plugin.app.vault.adapter.mkdir(dir);
		}
		const db = await connect(dir);
		const table = await db.createTable('vectors', []);
		const vectorStore = await LanceDB.fromDocuments([], embeddings, {
			table,
		});
		const resultOne = await vectorStore.similaritySearch('hello world', 1); */

		// const files = plugin.app.vault.getFileByPath('/');
		// console.log(files);
		const mdFiles = plugin.app.vault.getMarkdownFiles();
		// console.log('configDir', plugin.app.vault.configDir);
		// console.log('getRoot', plugin.app.vault.getRoot());
		// console.log(mdFiles);
		const docs = await obsidianDocumentLoader(
			plugin.app,
			mdFiles
			// mdFiles.filter(f => f.path.startsWith('Chats/'))
		);
		Logger.info(docs);

		const vectorStore = new OramaStore(embeddings, {
			similarityThreshold: 0.75,
		});
		await vectorStore.create('test');
		await vectorStore.addDocuments(docs);
		Logger.info('vectorSize', vectorStore.getData().vectorSize);

		Logger.info('vectorStoreData', vectorStore.getData());
		await plugin.saveVectorStoreData('vector_store', vectorStore.getData());
		Logger.info('Saved vector store data');

		const vectorStoreData = await plugin.loadVectorStoreData('vector_store');
		await vectorStore.restore(vectorStoreData);

		Logger.info('similaritySearch', await vectorStore.similaritySearch('reor'));
		const retriever = vectorStore.asRetriever({k: 10});
		Logger.info('retriever', await retriever.invoke('reor'));
	};

	return (
		<>
			<SettingItem heading name={t('Agents')} />
			<SettingItem name="">
				<Button onClick={handleAddAgent}>Add Agents</Button>
			</SettingItem>
		</>
	);
}
