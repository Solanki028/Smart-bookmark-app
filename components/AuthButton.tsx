
'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AuthButton({ user }: { user: any }) {
    const supabase = createClient()
    const router = useRouter()

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return user ? (
        <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
        >
            <LogOut size={16} />
            Sign Out
        </button>
    ) : (
        <button
            onClick={handleSignIn}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
        >
            Sign in with Google
        </button>
    )
}
