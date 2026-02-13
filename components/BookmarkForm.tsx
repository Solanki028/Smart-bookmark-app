
'use client'

import { useState } from 'react'
import { Plus, Link as LinkIcon, Type, Loader2 } from 'lucide-react'

interface BookmarkFormProps {
    onAdd: (title: string, url: string) => Promise<void>
}

export default function BookmarkForm({ onAdd }: BookmarkFormProps) {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !url.trim()) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            await onAdd(title, url)
            setTitle('')
            setUrl('')
        } catch (err) {
            console.error(err)
            setError('Failed to add bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 mb-10 transition-all hover:shadow-xl hover:shadow-gray-100/60">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                    <Plus size={18} />
                </div>
                Add New Bookmark
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 relative group">
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Bookmark Title (e.g. My Portfolio)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="md:col-span-5 relative group">
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-full min-h-[46px] bg-gray-900 text-white hover:bg-black rounded-xl text-sm font-semibold transition-all shadow-lg shadow-gray-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Add</span>
                                    <Plus size={18} className="hidden md:block" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded-lg inline-block border border-red-100">{error}</p>}
            </form>
        </div>
    )
}
