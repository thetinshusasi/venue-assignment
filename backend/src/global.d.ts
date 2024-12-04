declare global {
	interface Window {
		electron: {
			ipcAPI: {
				send(channel: string, data?: unknown): void
				on(channel: string, listener: (...args: unknown[]) => void): void
				invoke<T = unknown>(channel: string, data?: unknown): Promise<T>
				gitClone(url: string): Promise<void>
			}
		}
	}
}
