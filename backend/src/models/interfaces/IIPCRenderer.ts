export default interface IIPCRenderer {
	send(channel: string, data?: unknown): void
	on(channel: string, listener: (...args: unknown[]) => void): void
	invoke(channel: string, data?: unknown): Promise<unknown>
	gitClone(url: string): Promise<void>
}
