'use client'

import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Link from 'next/link'
import styles from './landing.module.css'
import TwoSidedLayout from '../two-sideed-layout/two-sided-layout'

export default function Landing() {
	return (
		<TwoSidedLayout>
			<Typography variant="h6" className={styles.title}>
				The power to do more
			</Typography>
			<Typography variant="h1" className={styles.headline}>
				A large headlinerer about our product features & services
			</Typography>
			<Typography variant="body1" className={styles.secondaryText}>
				A descriptive secondary text placeholder. Use it to explain your
				business offer better.
			</Typography>
			<Link href="/login" passHref>
				<Button
					variant="contained"
					color="primary"
					className={styles.button}
					size="large"
					endIcon={<ArrowForward fontSize="large" />}
				>
					Get Started
				</Button>
			</Link>
		</TwoSidedLayout>
	)
}
