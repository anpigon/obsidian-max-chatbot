/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Orama, TypedDocument, create, insertMultiple, removeMultiple, search} from '@orama/orama';

import {VectorStore} from '@langchain/core/vectorstores';
import {Embeddings} from '@langchain/core/embeddings';
import {Document} from '@langchain/core/documents';

import {hashString} from './utils/hash';
import Logger from './logging';

const vectorStoreSchema = {
	id: 'string',
	filepath: 'string',
	title: 'string',
	content: 'string',
} as const;

type VectorDocument = TypedDocument<Orama<typeof vectorStoreSchema>>;

export interface VectorStoreBackup {
	indexName: string;
	vectorSize: number;
	docs: VectorDocument[];
}

export class OramaStore extends VectorStore {
	private db?: Orama<typeof vectorStoreSchema>;
	private indexName?: string;
	private vectorSize?: number;
	private similarity: number;

	_vectorstoreType(): string {
		return 'OramaStore';
	}

	constructor(
		public embeddings: Embeddings,
		args: {similarityThreshold?: number}
	) {
		super(embeddings, args);
		this.similarity = args.similarityThreshold ?? 0.75;
	}

	async create(indexName: string, vectorSize?: number) {
		this.vectorSize = vectorSize ?? (await this.embeddings.embedQuery('test')).length;
		this.indexName = indexName;

		this.db = await create({
			schema: {...vectorStoreSchema, embedding: `vector[${this.vectorSize}]`} as const,
			id: indexName,
		});
	}

	async restore(vectorStoreBackup: VectorStoreBackup) {
		Logger.debug('Restoring vectorstore from backup');
		if (!this.db) {
			throw new Error('Database is not initialized');
		}

		// vectorStoreBackup is an object and not an array for some reason
		const docs: VectorDocument[] = Object.values(vectorStoreBackup.docs);
		await this.create(vectorStoreBackup.indexName, vectorStoreBackup.vectorSize);
		await insertMultiple(this.db, docs);
		Logger.info('Restored vectorstore from backup');
		Logger.debug(this.db.data.docs.docs);
	}

	async delete(filters: {ids: string[]}) {
		if (!this.db) {
			throw new Error('Database is not initialized');
		}
		await removeMultiple(this.db, filters.ids);
	}

	async addVectors(vectors: number[][], documents: Document[]) {
		if (!this.db) {
			throw new Error('Database is not initialized');
		}

		const vectorDocs: VectorDocument[] = [];
		for (let index = 0; index < documents.length; index++) {
			const docs = documents[index];
			const filepath = docs.metadata?.filepath || '';
			const title = docs.metadata?.title || '';
			const content = docs.pageContent || '';
			const id = await hashString(filepath + content);
			vectorDocs.push({
				id,
				filepath,
				title,
				content,
				embedding: vectors[index],
			});
		}

		const ids = await insertMultiple(this.db, vectorDocs);
		return ids;
	}

	async addDocuments(documents: Document[]): Promise<string[]> {
		const vectors: number[][] = await this.embeddings.embedDocuments(documents.map(document => document.pageContent));
		return await this.addVectors(vectors, documents);
	}

	async similaritySearchVectorWithScore(query: number[], k: number): Promise<[Document, number][]> {
		if (!this.db) {
			throw new Error('Database is not initialized');
		}

		const results = await search(this.db, {
			mode: 'vector',
			vector: {value: query, property: 'embedding'},
			limit: k,
			similarity: this.similarity,
		});
		return results.hits.map(result => {
			return [
				new Document({
					metadata: {filepath: result.document.filepath, order: result.document.order, header: result.document.header},
					pageContent: result.document.content,
				}),
				result.score,
			];
		});
	}

	getData(): VectorStoreBackup {
		if (!this.db || !this.indexName || !this.vectorSize) {
			throw new Error('Database is not initialized');
		}

		return {indexName: this.indexName, vectorSize: this.vectorSize, docs: this.db.data.docs.docs as VectorDocument[]};
	}

	setSimilarityThreshold(similarityThreshold: number) {
		this.similarity = similarityThreshold;
	}
}
