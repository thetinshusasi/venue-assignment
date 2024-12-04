import Store from 'electron-store'
import { GITHUB_PAT_KEY } from '../common/constants'

type StoreType = {
	[GITHUB_PAT_KEY]: string
}

const store = new Store<StoreType>() as Store<StoreType> & {
	set: (key: string, value: unknown) => void
	get: (key: string) => unknown
}

// this should be fetched from th server  and should not be hardcoded
store.set(GITHUB_PAT_KEY, process.env.GITHUB_PAT || '')

export const getGitHubPAT = (): string | undefined => {
	return store.get(GITHUB_PAT_KEY) as string | undefined
}
