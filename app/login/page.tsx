
'use client'

import AuthButton from '@/components/AuthButton'
import { Bookmark } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center space-y-6">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bookmark size={32} className="text-blue-600" fill="currentColor" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage your bookmarks across all your devices.</p>
                </div>

                <div className="pt-2">
                    <AuthButton user={null} />
                </div>
            </div>
        </div>
    )
}
