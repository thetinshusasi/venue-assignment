import * as os from 'os'
import * as path from 'path'

export const LOCAL_GIT_REPO_PATH = path.join(
	os.homedir(),
	'AppData',
	'GitRepos'
)

export const GITHUB_PAT_KEY = 'GITHUB_PAT_KEY'
