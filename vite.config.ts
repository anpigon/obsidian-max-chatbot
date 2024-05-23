import react from '@vitejs/plugin-react-swc';
import builtins from 'builtin-modules';
import {defineConfig} from 'vite';
import {pathToFileURL} from 'url';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import path from 'path';

export default defineConfig(({mode}) => {
	return {
		plugins: [
			react(),
			copy({
				targets: [
					{
						src: './manifest.json',
						dest: 'build/',
					},
				],
				hook: 'writeBundle',
			}),
		],
		resolve: {
			alias: [{find: '@/', replacement: path.resolve(__dirname, 'src')}],
		},
		build: {
			lib: {
				entry: './src/main',
				formats: ['cjs'],
			},
			rollupOptions: {
				plugins: [typescript({tsconfig: './tsconfig.json'})],
				output: {
					entryFileNames: 'main.js',
					assetFileNames: 'styles.css',
					sourcemapBaseUrl: pathToFileURL(`${__dirname}/build/`).toString(),
				},
				external: [
					'obsidian',
					'electron',
					'@codemirror/autocomplete',
					'@codemirror/collab',
					'@codemirror/commands',
					'@codemirror/language',
					'@codemirror/lint',
					'@codemirror/search',
					'@codemirror/state',
					'@codemirror/view',
					'@lezer/common',
					'@lezer/highlight',
					'@lezer/lr',
					...builtins,
				],
			},
			outDir: './build',
			emptyOutDir: false,
			sourcemap: mode === 'development',
		},
		css: {
			devSourcemap: true,
		},
	};
});
