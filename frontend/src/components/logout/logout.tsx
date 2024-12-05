'use client'

import { GitHub } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './logout-button.module.css'

export default function LogOutButton() {
	const { data: session } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/login')
		}
	}, [session, router])

	return (
		<Button
			onClick={() => signOut()}
			variant="contained"
			color="primary"
			fullWidth
			startIcon={<GitHub />}
			className={styles.button}
		>
			Logout
		</Button>
	)
}
