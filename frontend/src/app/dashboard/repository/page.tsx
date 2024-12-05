import { NextPage } from 'next'
import RepoList from '../../../components/git-repo-list/git-repo-list'

interface Props {}

const Page: NextPage<Props> = ({}) => {
	return (
		<div>
			{' '}
			<RepoList />
		</div>
	)
}

export default Page
