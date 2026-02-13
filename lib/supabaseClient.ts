
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
        if (!url || !key) throw new Error('Missing credentials')
        return createBrowserClient(url, key)
    } catch (error) {
        // Return a dummy client to prevent crash during build or if credentials are invalid
        console.warn('Supabase client failed to initialize (likely missing or invalid env vars):', error)

        return {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                signInWithOAuth: () => Promise.resolve({ error: null }),
                signOut: () => Promise.resolve({ error: null }),
            },
            from: () => ({
                select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
                insert: () => Promise.resolve({ error: null }),
                delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
            }),
            channel: () => ({
                on: () => ({ subscribe: () => { } }),
            }),
            removeChannel: () => { },
        } as any
    }
}
