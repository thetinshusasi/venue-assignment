'use client'

import { GitHub } from '@mui/icons-material'
import { Button } from '@mui/joy'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginButton() {
	return (
		<Button
			onClick={() => signIn('github')}
			variant="soft"
			color="neutral"
			fullWidth
			startDecorator={<GitHub />}
		>
			Continue with Github
		</Button>
	)
}
