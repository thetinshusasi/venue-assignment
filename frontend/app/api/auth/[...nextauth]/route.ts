import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
const handler = NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
})

export const GET = handler
export const POST = handler
