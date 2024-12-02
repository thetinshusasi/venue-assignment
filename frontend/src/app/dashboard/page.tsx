import { NextPage } from 'next'
import styles from './page.module.css'
import LogOutButton from '../../components/logout/logout'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Header from '../../components/header/header'

interface Props {}

const Page: NextPage<Props> = async ({}) => {
	const session = await getServerSession()

	if (!session) {
		redirect('/login')
		return
	}

	return (
		<div className={styles.container}>
			<Header />
			<LogOutButton />
		</div>
	)
}

export default Page
