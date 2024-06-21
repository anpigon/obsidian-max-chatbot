import {useContext} from 'react';
import {App} from 'obsidian';

import {AppContext} from '@/context';
import MAXPlugin from '@/main';

import type {MAXSettings} from '@/features/setting/types';

export const usePlugin = (): MAXPlugin => {
	const plugin = useContext(AppContext);
	if (!plugin) {
		throw new Error('Plugin context not found. Make sure the usePlugin hook is used within the AppContext.Provider component.');
	}
	return plugin;
};

export const useApp = (): App => {
	const plugin = usePlugin();
	return plugin.app;
};

export const useSettings = (): MAXSettings => {
	const plugin = usePlugin();
	const settings = plugin.settings;
	if (!settings) {
		throw new Error('Settings not found. Make sure the useSettings hook is used within a component that has access to the plugin settings.');
	}
	return settings;
};
