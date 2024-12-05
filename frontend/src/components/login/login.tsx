'use client'

import { GitHub } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { signIn } from 'next-auth/react'
import styles from './login-button.module.css'

export default function LoginButton() {
	return (
		<Button
			onClick={() => signIn('github')}
			variant="contained"
			color="primary"
			fullWidth
			startIcon={<GitHub />}
			className={styles.button}
		>
			Continue with GitHub
		</Button>
	)
}
