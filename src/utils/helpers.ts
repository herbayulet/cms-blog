import {clsx, type ClassValue} from "clsx"
import slugify from "react-slugify"
import {format} from "date-fns"
import {id} from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export const generateSlug = (text: string): string => slugify(text)

export const truncate = (text: string, length: number): string => {
    if (text.length <= length) return text
    return text.slice(0, length).trimEnd() + "…"
}

export const formatDate = (dateString?: string): string => {
    const date = dateString ? new Date(dateString) : new Date()
    return format(date, "d MMMM yyyy", {locale: id})
}

export const getPostImage = (id: number, seed?: string): string => {
    const s = seed || String(id)
    return `https://picsum.photos/seed/${s}/800/450`
}

export const getThumbImage = (id: number, seed?: string): string => {
    const s = seed || `thumb-${id}`
    return `https://picsum.photos/seed/${s}/400/225`
}

export const getCategoryColor = (id: number): string => {
    const colors = [
        "bg-rose-100 text-rose-700",
        "bg-sky-100 text-sky-700",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-violet-100 text-violet-700",
        "bg-pink-100 text-pink-700",
        "bg-teal-100 text-teal-700",
        "bg-orange-100 text-orange-700",
    ]
    return colors[id % colors.length]
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}
