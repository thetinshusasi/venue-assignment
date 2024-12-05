import { NextPage } from 'next'
import { GitHub, Google } from '@mui/icons-material'
import {
	Container,
	Typography,
	Button,
	Stack,
	CssBaseline,
	Box,
} from '@mui/material'
import styles from './page.module.css'
import LoginButton from '../../components/login/login'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const LoginPage: NextPage = async () => {
	const session = await getServerSession()

	if (session) {
		redirect('/dashboard')
		return
	}

	return (
		<>
			<CssBaseline />
			<div className={styles.mainContainer}>
				<div className={styles.formContainer}>
					<Container className={styles.mainContent}>
						<Stack spacing={4}>
							<Stack spacing={1}>
								<Typography variant="h4" component="h1">
									Sign in
								</Typography>
								<Typography variant="body1">New to the company?</Typography>
							</Stack>
							<LoginButton />
						</Stack>
					</Container>
					<footer className={styles.footer}>
						<Typography variant="body2">
							© Your company {new Date().getFullYear()}
						</Typography>
					</footer>
				</div>
			</div>
			<div className={`${styles.background} ${styles.backgroundImageLight}`} />
		</>
	)
}

export default LoginPage
