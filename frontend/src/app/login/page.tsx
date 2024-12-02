import { NextPage } from 'next'
import styles from './page.module.css'
import { GitHub, Google } from '@mui/icons-material'
import { CssVarsProvider } from '@mui/joy/styles'
import Button from '@mui/joy/Button'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import { CssBaseline } from '@mui/joy'
import LoginButton from '../../components/login/login'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface Props {}

const LoginPage: NextPage<Props> = async ({}) => {
	const session = await getServerSession()

	if (session) {
		redirect('/dashboard')
		return
	}

	return (
		<CssVarsProvider disableTransitionOnChange>
			<CssBaseline />
			<div className={styles.mainContainer}>
				<div className={styles.formContainer}>
					<main className={styles.mainContent}>
						<Stack gap={4} mb={2}>
							<Stack gap={1}>
								<Typography component="h1" level="h3">
									Sign in
								</Typography>
								<Typography>New to company?</Typography>
							</Stack>
							<LoginButton />
						</Stack>
					</main>
					<footer className={styles.footer}>
						<Typography level="body-xs">
							© Your company {new Date().getFullYear()}
						</Typography>
					</footer>
				</div>
			</div>
			<div className={`${styles.background} ${styles.backgroundImageLight}`} />
		</CssVarsProvider>
	)
}

export default LoginPage
