
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Bookmark } from '@/types/bookmark'

export function useBookmarks(userId: string | undefined) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!userId) {
            setBookmarks([])
            setLoading(false)
            return
        }

        const fetchBookmarks = async () => {
            // @ts-ignore
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) {
                setBookmarks(data as Bookmark[])
            }
            setLoading(false)
        }

        fetchBookmarks()

        // Realtime subscription
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        // Avoid duplicate insert if we already optimistically added it (not implemented here yet, but good practice)
                        // For now, just add it.
                        setBookmarks((prev) => {
                            if (prev.find(b => b.id === payload.new.id)) return prev
                            return [payload.new as Bookmark, ...prev]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) => prev.map((b) => b.id === payload.new.id ? payload.new as Bookmark : b))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    const addBookmark = async (title: string, url: string) => {
        if (!userId) return
        // @ts-ignore
        const { error } = await supabase.from('bookmarks').insert({ title, url, user_id: userId })
        if (error) {
            throw error
        }
    }

    const deleteBookmark = async (id: string) => {
        // Optimistic update
        const previousBookmarks = [...bookmarks]
        setBookmarks((prev) => prev.filter((b) => b.id !== id))

        // @ts-ignore
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            // Revert if failed
            setBookmarks(previousBookmarks)
            throw error
        }
    }

    return { bookmarks, loading, addBookmark, deleteBookmark }
}
