import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import styles from './two-sided-layout.module.css'

interface TwoSidedLayoutProps {
	children: React.ReactNode
	reversed?: boolean
}

export default function TwoSidedLayout({
	children,
	reversed,
}: TwoSidedLayoutProps) {
	return (
		<Container
			className={`${styles.container} ${reversed ? styles.containerReversed : ''}`}
		>
			<Box className={styles.box}>{children}</Box>
			<Box className={styles.aspectRatio}>
				<img
					src="https://images.unsplash.com/photo-1483791424735-e9ad0209eea2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
					alt=""
					className={styles.image}
				/>
			</Box>
		</Container>
	)
}
