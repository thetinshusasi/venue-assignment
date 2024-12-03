import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Roboto } from 'next/font/google'

import { AuthSessionProvider } from '../providers/auth-session-provider'
import { getServerSession } from 'next-auth'
import '@fontsource/inter'
import ThemeRegistry from '../theme/theme-registry'
import './globals.css'

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
			<body>
				<AuthSessionProvider session={session}>
					<AppRouterCacheProvider>
						<ThemeRegistry options={{ key: 'joy' }}>{children} </ThemeRegistry>
					</AppRouterCacheProvider>
				</AuthSessionProvider>
			</body>
		</html>
	)
}
