'use client'

import { GitHub } from '@mui/icons-material'
import { Button } from '@mui/joy'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
			variant="soft"
			color="neutral"
			fullWidth
			startDecorator={<GitHub />}
		>
			Logout
		</Button>
	)
}
