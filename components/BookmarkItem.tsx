
import { Bookmark } from '@/types/bookmark'
import { Trash2, ExternalLink, Globe, Calendar, Copy, Check, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface BookmarkItemProps {
    bookmark: Bookmark
    onDelete: (id: string) => void
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
    const [copied, setCopied] = useState(false)

    const formattedUrl = bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`
    const domain = tryGetDomain(formattedUrl)
    const timeAgo = tryGetTimeAgo(bookmark.created_at)

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-xl shrink-0 border border-blue-100/50 font-bold text-lg select-none">
                        {domain.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate leading-snug text-[15px]" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate font-medium">{domain}</p>
                    </div>
                </div>
            </div>

            <a
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg truncate hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100"
            >
                {bookmark.url}
            </a>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Calendar size={12} />
                    {timeAgo}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Copy URL"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <div className="w-px h-3 bg-gray-200 mx-1"></div>
                    <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Open Link"
                    >
                        <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={() => onDelete(bookmark.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function tryGetDomain(url: string) {
    try {
        return new URL(url).hostname.replace('www.', '')
    } catch {
        return 'link'
    }
}

function tryGetTimeAgo(dateString: string) {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
        return 'recently'
    }
}
