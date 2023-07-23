import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider  from "next-auth/providers/google"

function getGoogleCredentials() {
    const clientId = '472085519913-p61l3m4nhsgkam8fg5a5n6ikaavcerum.apps.googleusercontent.com'
    const clientSecret = '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'

    if (!clientId) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    } 

    if (!clientSecret) {
        throw new Error('Missing GOOGLE_CLIENT_ISECRET')
    }

    return {clientId, clientSecret} 
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers:[
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret
        }),
    ],
    callbacks: {
        async jwt ({token, user}) {
            const dbUser = (await db.get(`user: ${token.id}`)) as User | null

            if (!dbUser){
                token.id = user!.id
                return token
            }

            return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                picture: dbUser.image
            }
        },

        async session({session, token}) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }

            return session
        },

        redirect() {
            return '/dashboard'
        }
    }
}