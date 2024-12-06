import { gitClone } from './../../backend/src/ipc/event-api/git'
export interface IpcRenderer {
	/**
	 * Sends an asynchronous message to the main process.
	 */
	send(channel: string, data?: unknown): void

	/**
	 * Listens for messages from the main process.
	 */
	on(channel: string, listener: (...args: unknown[]) => void): void

	/**
	 * Sends a message to the main process and awaits a response.
	 */
	invoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T>

	gitClone(url: string): Promise<void>
}

declare global {
	interface Window {
		electron: {
			ipcAPI: IpcRenderer
		}
	}
}
