'use client'

import * as React from 'react'
import Button from '@mui/joy/Button'
import Typography from '@mui/joy/Typography'
import ArrowForward from '@mui/icons-material/ArrowForward'
import TwoSidedLayout from '../two-sideed-layout/two-sided-layout'
import styles from './landing.module.css'
import Link from 'next/link'

export default function Landing() {
	return (
		<TwoSidedLayout>
			<Typography className={styles.title}>The power to do more</Typography>
			<Typography className={styles.headline} level="h1">
				A large headlinerer about our product features & services
			</Typography>
			<Typography className={styles.secondaryText}>
				A descriptive secondary text placeholder. Use it to explain your
				business offer better.
			</Typography>
			<Link href="/login" passHref>
				<Button
					className={styles.button}
					size="lg"
					endDecorator={<ArrowForward fontSize="large" />}
				>
					Get Started
				</Button>
			</Link>
		</TwoSidedLayout>
	)
}
