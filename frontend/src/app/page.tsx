import styles from './page.module.css'
import EditSVG from '@/assets/edit.svg'
import Menhera from '@/assets/menhera.png'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'
import Button from '@mui/material/Button'
import { AuthSessionProvider } from '../providers/auth-session-provider'
import Landing from '../components/landing/landing'
export default function LandingPage() {
	return (
		<Box
			sx={{
				height: '100vh',
				overflowY: 'scroll',
				scrollSnapType: 'y mandatory',
				'& > div': {
					scrollSnapAlign: 'start',
				},
			}}
		>
			<Landing />
		</Box>
	)
}
