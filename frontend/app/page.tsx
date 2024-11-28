import styles from './page.module.css'
import EditSVG from '@/assets/edit.svg'
import Menhera from '@/assets/menhera.png'
import { Typography } from '@mui/material'
import Image from 'next/image'

export default function Home() {
	return (
		<div className={styles.wrapper}>
			<main className={styles.main}>
				<div className={styles.container}>
					<Typography variant="h2" component="h1" className={styles.largeText}>
						Welcome to Our Venue App
					</Typography>
					<div className={styles.buttonContainer}>
						{/* <Button
							variant="contained"
							color="primary"
							size="large"
							className={styles.button}
							onClick={handleLoginClick}
						>
							Login
						</Button> */}
					</div>
				</div>
			</main>
		</div>
	)
}
