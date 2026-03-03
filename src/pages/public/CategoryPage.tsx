import {useEffect, useState} from "react"
import {useParams, Link} from "react-router-dom"
import {useCategoriesStore} from "@/store/categoriesStore"
import {usePostsStore} from "@/store/postsStore"
import {formatDate, getCategoryColor, truncate} from "@/utils/helpers"
import {ArrowLeft} from "lucide-react"
import type {Post} from "@/types"
import {LoadingState} from "@/components/ui/loading-state"
import {ErrorState} from "@/components/ui/error-state"
import {EmptyState} from "@/components/ui/empty-state"
import {Badge} from "@/components/ui/badge"

export default function CategoryPage() {
    const {slug} = useParams<{slug: string}>()
    const {categories, fetchCategories} = useCategoriesStore()
    const {posts, loading, error, fetchPosts} = usePostsStore()
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

    const category = categories.find((c) => c.slug === slug)

    useEffect(() => {
        fetchCategories()
        fetchPosts({page: 1})
    }, [])

    useEffect(() => {
        if (category && posts.length > 0) {
            setFilteredPosts(posts.filter((p) => p.categoryId === category.id))
        }
    }, [category, posts])

    if (loading) return <LoadingState text="Memuat kategori…" />
    if (error) return <ErrorState message={error} />

    if (!category) {
        return (
            <div className="text-center py-20">
                <p className="font-display text-4xl text-black/20 mb-4">404</p>
                <p className="text-black/50 text-sm mb-6">Kategori tidak ditemukan.</p>
                <Link to="/" className="text-accent-600 text-sm hover:underline">
                    ← Kembali ke beranda
                </Link>
            </div>
        )
    }

    return (
        <div>
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-black/40 text-sm hover:text-black/70 transition-colors mb-8">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </Link>

            <div className="mb-8">
                <Badge className={getCategoryColor(category.id)}>Kategori</Badge>
                <h1 className="font-display text-3xl text-black/90 mt-3 mb-2">{category.name}</h1>
                <p className="text-sm text-black/40">{filteredPosts.length} artikel dalam kategori ini</p>
            </div>

            {filteredPosts.length === 0 ? (
                <EmptyState title="Belum ada artikel" description="Belum ada artikel dalam kategori ini." />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white rounded-xl border border-black/10 overflow-hidden hover:border-black/20 hover:shadow-md transition-all duration-300">
                            <Link to={`/post/${post.slug}`} className="block overflow-hidden">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>
                            <div className="p-4">
                                <h3 className="font-display text-base text-black/90 leading-snug mb-2 group-hover:text-accent-600 transition-colors">
                                    <Link to={`/post/${post.slug}`}>{truncate(post.title, 70)}</Link>
                                </h3>
                                <p className="text-xs text-black/50 leading-relaxed mb-3">
                                    {truncate(post.excerpt, 100)}
                                </p>
                                <p className="text-xs text-black/40">{formatDate(post.createdAt)}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
