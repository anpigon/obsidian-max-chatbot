 
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

	static debug(...args: unknown[]) {
		if (Logger.logLevel <= LogLvl.DEBUG) console.debug('[MAX Chatbot]', ...args);
	}

	static info(...args: unknown[]) {
		if (Logger.logLevel <= LogLvl.INFO) console.info('[MAX Chatbot]', ...args);
	}

	static error(...args: unknown[]) {
		if (Logger.logLevel <= LogLvl.ERROR) console.error('[MAX Chatbot]', ...args);
	}
}

export default Logger;
