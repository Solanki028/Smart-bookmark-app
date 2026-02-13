
'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'
import { Bookmark, LayoutGrid } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
    const { user, loading } = useAuth()

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 hover:opacity-80 transition-opacity">
                    <div className="bg-gradient-to-tr from-gray-900 to-gray-700 text-white p-1.5 rounded-lg shadow-sm">
                        <Bookmark size={15} fill="currentColor" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold tracking-tight">SmartMarks</span>
                </Link>

                <div className="flex items-center gap-4">
                    {!loading && <AuthButton user={user} />}
                </div>
            </div>
        </nav>
    )
}
