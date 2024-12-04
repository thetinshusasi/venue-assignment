import { NextPage } from 'next'
import styles from './page.module.css'
import LogOutButton from '../../components/logout/logout'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Sidebar from '../../components/sidebar/sidebar'
import CloneRepoForm from '../../components/clone-repo-form/clone-repo-form'

interface Props {}

const Page: NextPage<Props> = async ({}) => {
	const session = await getServerSession()

	if (!session) {
		redirect('/login')
		return
	}

	return <CloneRepoForm />
}

export default Page
