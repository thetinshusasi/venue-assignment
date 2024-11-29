import LoginButton from '@/components/login/login'
import styles from './page.module.css'

import { NextPage } from 'next'

interface Props {}

const Page: NextPage<Props> = ({}) => {
	return (
		<main>
			<div>Welcome to home page</div>
			<LoginButton />
		</main>
	)
}

export default Page
