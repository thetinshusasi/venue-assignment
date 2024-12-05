import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { Roboto } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'

import { AuthSessionProvider } from '../providers/auth-session-provider'
import { getServerSession } from 'next-auth'
import './globals.css'
import theme from '../theme/theme'

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

export default async function RootLayout({ children }) {
	const session = await getServerSession()
	return (
		<html lang="en">
			<body className={roboto.variable}>
				<AuthSessionProvider session={session}>
					<AppRouterCacheProvider options={{ enableCssLayer: true }}>
						<ThemeProvider theme={theme}>{children}+ </ThemeProvider>
					</AppRouterCacheProvider>
				</AuthSessionProvider>
			</body>
		</html>
	)
}
