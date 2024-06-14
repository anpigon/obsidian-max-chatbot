import {Platform} from 'obsidian';

declare global {
	interface Window {
		process: any;
	}
}

if (Platform.isMobile || Platform.isMobileApp) {
	(window as any)['process'] = {env: {NODE_ENV: 'production'}};
}
