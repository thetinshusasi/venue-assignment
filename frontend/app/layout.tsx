import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Roboto } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { Button, Link } from '@mui/material'
import { AuthSessionProvider } from './providers/AuthSessionProvider'

export const metadata = {
	title: 'NextJS  Electron Boilerplate',
	description:
		'A neat boilerplate for building Electron apps, with NextJS at the frontend and pre-configured with a bunch of handy development tools.',
}

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
})

export default function RootLayout(props) {
	const { children } = props
	return (
		<html lang="en">
			<body className={roboto.variable}>
				<Link href="/">
					<Button variant="contained" color="primary">
						Go to Home
					</Button>
				</Link>
				<AuthSessionProvider>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>{children}</ThemeProvider>
					</AppRouterCacheProvider>
				</AuthSessionProvider>
			</body>
		</html>
	)
}
