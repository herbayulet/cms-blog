import {useEffect} from "react"
import {useParams, Link} from "react-router-dom"
import {usePostsStore} from "@/store/postsStore"
import {useCategoriesStore} from "@/store/categoriesStore"
import {formatDate, getCategoryColor} from "@/utils/helpers"
import {ArrowLeft} from "lucide-react"
import {LoadingState} from "@/components/ui/loading-state"
import {ErrorState} from "@/components/ui/error-state"
import {Badge} from "@/components/ui/badge"

export default function PostDetailPage() {
    const {slug} = useParams<{slug: string}>()
    const {posts, currentPost, loading, error, fetchPosts, setCurrentPost} = usePostsStore()
    const {categories, fetchCategories} = useCategoriesStore()

    useEffect(() => {
        fetchCategories()
        if (posts.length === 0) {
            fetchPosts({page: 1})
        }
    }, [])

    useEffect(() => {
        if (posts.length > 0 && slug) {
            const found = posts.find((p) => p.slug === slug)
            if (found) setCurrentPost(found)
        }
    }, [posts, slug])

    const post = currentPost

    const getCategoryName = (categoryId: number | null) => {
        if (!categoryId) return null
        return categories.find((c) => c.id === categoryId)
    }

    if (loading) return <LoadingState text="Memuat artikel…" />

    if (error) return <ErrorState message={error} />

    if (!post) {
        return (
            <div className="text-center py-20">
                <p className="font-display text-4xl text-black/20 mb-4">404</p>
                <p className="text-black/50 text-sm mb-6">Artikel tidak ditemukan.</p>
                <Link to="/" className="text-accent-600 text-sm hover:underline">
                    ← Kembali ke beranda
                </Link>
            </div>
        )
    }

    const cat = getCategoryName(post.categoryId)

    return (
        <article className="max-w-2xl mx-auto">
            {/* back */}
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-black/40 text-sm hover:text-black/70 transition-colors mb-8">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </Link>

            {/* category */}
            {cat && (
                <div className="mb-4">
                    <Badge className={getCategoryColor(post.categoryId!)}>
                        <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                    </Badge>
                </div>
            )}

            {/* title */}
            <h1 className="font-display text-3xl sm:text-4xl text-black/90 leading-tight mb-4">{post.title}</h1>

            {/* meta */}
            <p className="text-xs text-black/40 mb-8">{formatDate(post.createdAt)}</p>

            {/* hero image */}
            <div className="rounded-2xl overflow-hidden mb-8 bg-black/10">
                <img src={post.image} alt={post.title} className="w-full aspect-video object-cover" />
            </div>

            {/* excerpt */}
            <p className="text-base text-black/60 leading-relaxed font-medium border-l-2 border-black/20 pl-4 mb-8 italic">
                {post.excerpt}
            </p>

            {/* body */}
            <div className="prose prose-sm max-w-none text-black/70 leading-relaxed space-y-4">
                {post.body.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>
        </article>
    )
}
