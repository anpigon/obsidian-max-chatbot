export const EMBEDDING_MODELS = {
	// local
	'nomic-embed-text': {dimension: 1_024, sequenceLength: 8_192},
	'mxbai-embed-large': {},
	'snowflake-arctic-embed': {},
	'bge-m3': {dimension: 1_024, sequenceLength: 8_192},
	'bge-m3-unsupervised': {dimension: 1_024, sequenceLength: 8_192},
	'bge-large-en-v1.5': {dimension: 1_024, sequenceLength: 512},
	'bge-base-en-v1.5': {dimension: 768, sequenceLength: 512},
	'bge-small-en-v1.5': {dimension: 384, sequenceLength: 512},
	// openai
	'text-embedding-3-small': {sequenceLength: 8_192},
	'text-embedding-3-large': {sequenceLength: 8_192},
	'text-embedding-ada-002': {sequenceLength: 8_192},
	// UPSTAGE
	// ANTHROPIC
	// GOOGLE_GEMINI
	// COHERE
};

export const embeddingModelKeys = Object.keys(EMBEDDING_MODELS);
