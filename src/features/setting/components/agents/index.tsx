import {Button} from '@/components';
import {SettingItem} from '@/components/settings/setting-item';
import {SystemMessage} from '@langchain/core/messages';
import {OllamaEmbeddings} from '@langchain/community/embeddings/ollama';

import {useTranslation} from 'react-i18next';
import {usePlugin} from '@/hooks/useApp';
import {normalizePath} from 'obsidian';
import {LanceDB} from '@langchain/community/vectorstores/lancedb';
import {connect} from 'vectordb';

export default function AgentSetting() {
	const plugin = usePlugin();
	const {t} = useTranslation('settings');

	const handleAddAgent = async () => {
		console.log(1);

		const embeddings = new OllamaEmbeddings({
			model: 'nomic-embed-text', // default value
			baseUrl: 'http://localhost:11434', // default value
			// requestOptions: {
			// 	useMMap: true, // use_mmap 1
			// 	numThread: 6, // num_thread 6
			// 	numGpu: 1, // num_gpu 1
			// },
		});

		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/chroma
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/faiss
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/opensearch
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/qdrant
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/pgvector
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase
		// https://js.langchain.com/v0.2/docs/integrations/vectorstores/lancedb
		const dir = normalizePath(plugin.manifest.dir + '/lancedb-');
		if (!(await plugin.app.vault.adapter.exists(dir))) {
			await plugin.app.vault.adapter.mkdir(dir);
		}
		const db = await connect(dir);
		const table = await db.createTable('vectors', []);
		const vectorStore = await LanceDB.fromDocuments([], embeddings, {
			table,
		});

		const resultOne = await vectorStore.similaritySearch('hello world', 1);
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
