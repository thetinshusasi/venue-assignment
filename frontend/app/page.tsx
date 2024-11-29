import styles from './page.module.css'
import EditSVG from '@/assets/edit.svg'
import Menhera from '@/assets/menhera.png'
import { Typography } from '@mui/material'
import Link from 'next/link'
import Button from '@mui/material/Button'
import { AuthSessionProvider } from './providers/AuthSessionProvider'
export default function LandingPage() {
	return (
		<div className={styles.wrapper}>
			<main className={styles.main}>
				<AuthSessionProvider>
					<div className={styles.container}>
						<Typography
							variant="h2"
							component="h1"
							className={styles.largeText}
						>
							Welcome to Our Venue App
						</Typography>
						<Link href="/pages/home">
							<Button variant="contained" color="primary">
								Go to Login Page
							</Button>
						</Link>
					</div>
				</AuthSessionProvider>
			</main>
		</div>
	)
}
