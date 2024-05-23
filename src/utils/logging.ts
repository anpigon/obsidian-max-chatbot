/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LogLvl {
	DEBUG = 1,
	INFO = 2,
	ERROR = 3,
	DISABLED = 4,
}

class Logger {
	private static logLevel = LogLvl.DEBUG;

	static setLogLevel(logLevel: LogLvl) {
		Logger.logLevel = logLevel;
	}

	static debug(...args: any[]) {
		if (Logger.logLevel <= LogLvl.DEBUG) console.debug('[MAX Chatbot]', ...args);
	}

	static info(...args: any[]) {
		if (Logger.logLevel <= LogLvl.INFO) console.info('[MAX Chatbot]', ...args);
	}

	static error(...args: any[]) {
		if (Logger.logLevel <= LogLvl.ERROR) console.error('[MAX Chatbot]', ...args);
	}
}

export default Logger;
