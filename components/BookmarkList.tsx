
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks/useBookmarks'
import BookmarkItem from './BookmarkItem'
import BookmarkForm from './BookmarkForm'
import { Loader2, Bookmark, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function BookmarkList() {
    const { user } = useAuth()
    const { bookmarks, loading, addBookmark, deleteBookmark } = useBookmarks(user?.id)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300) // 300ms debounce

        return () => {
            clearTimeout(handler)
        }
    }, [search])

    const filteredBookmarks = bookmarks.filter(b =>
        b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.url.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-gray-900" size={32} />
                    <p className="text-sm text-gray-500 font-medium">Loading bookmarks...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your collection.</p>
                </div>

                {bookmarks.length > 0 && (
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all font-medium"
                        />
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-gray-200/70 mb-8 mt-6"></div>

            <BookmarkForm onAdd={addBookmark} />

            {bookmarks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <Bookmark className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No bookmarks yet</h3>
                    <p className="text-gray-500 mt-1 max-w-sm text-sm">Add your first bookmark using the form above to get started.</p>
                </div>
            ) : (
                <>
                    {filteredBookmarks.length === 0 && debouncedSearch ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No bookmarks found matching "{debouncedSearch}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBookmarks.map((bookmark) => (
                                <BookmarkItem key={bookmark.id} bookmark={bookmark} onDelete={deleteBookmark} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
