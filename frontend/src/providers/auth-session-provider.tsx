'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
export function AuthSessionProvider({
	children,
	session,
}: {
	children: React.ReactNode
	session: Session | null
}) {
	return <SessionProvider>{children}</SessionProvider>
}
