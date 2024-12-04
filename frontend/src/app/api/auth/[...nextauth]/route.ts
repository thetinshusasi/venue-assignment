import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
declare module 'next-auth' {
	interface Session {
		accessToken?: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
	}
}

const handler = NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, account }: { token: JWT; account?: any }) {
			if (account?.access_token) {
				token.accessToken = account.access_token
			}
			return token
		},
		async session({
			session,
			token,
		}: {
			session: DefaultSession & { accessToken?: string }
			token: JWT
		}) {
			if (token.accessToken) {
				session.accessToken = token.accessToken
			}
			return session
		},
	},
})

export const GET = handler
export const POST = handler
