import { NextPage } from 'next'
import RepoList from '../../../components/git-repo-list/git-repo-list'
import styles from './page.module.css'
interface Props {}

const Page: NextPage<Props> = ({}) => {
	return (
		<div className={styles.container}>
			<RepoList />
		</div>
	)
}

export default Page
