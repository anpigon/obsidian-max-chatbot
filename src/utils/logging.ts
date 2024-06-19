// Disable ESLint rule for no-undef
/* eslint-disable no-undef */

export enum LogLevel {
	DEBUG = 1,
	INFO = 2,
	ERROR = 3,
	DISABLED = 4,
}

class Logger {
	private static logLevel: LogLevel = LogLevel.DEBUG;

	static setLogLevel(logLevel: LogLevel): void {
		Logger.logLevel = logLevel;
	}

	static debug(...args: unknown[]): void {
		if (Logger.logLevel <= LogLevel.DEBUG) {
			console.debug('[MAX Chatbot]', ...args);
		}
	}

	static info(...args: unknown[]): void {
		if (Logger.logLevel <= LogLevel.INFO) {
			console.info('[MAX Chatbot]', ...args);
		}
	}

	static error(...args: unknown[]): void {
		if (Logger.logLevel <= LogLevel.ERROR) {
			console.error('[MAX Chatbot]', ...args);
		}
	}
}

export default Logger;
