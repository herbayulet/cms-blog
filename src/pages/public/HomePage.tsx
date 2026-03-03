import {useEffect, useState} from "react"
import {Link, useSearchParams} from "react-router-dom"
import {usePostsStore} from "@/store/postsStore"
import {useCategoriesStore} from "@/store/categoriesStore"
import {Badge} from "@/components/ui/badge"
import {LoadingState} from "@/components/ui/loading-state"
import {ErrorState} from "@/components/ui/error-state"
import {EmptyState} from "@/components/ui/empty-state"
import {Pagination} from "@/components/ui/pagination"
import {formatDate, getCategoryColor, truncate} from "@/utils/helpers"
import {cn} from "@/utils/helpers"
import type {Category} from "@/types"

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get("page") || 1)

    const {posts, loading, error, pagination, fetchPosts} = usePostsStore()
    const {categories, fetchCategories} = useCategoriesStore()

    const [activeCategory, setActiveCategory] = useState<Category | null>(null)

    useEffect(() => {
        fetchPosts({page})
    }, [page])

    useEffect(() => {
        fetchCategories()
    }, [])

    const getCategoryById = (id: number | null) => (id ? (categories.find((c) => c.id === id) ?? null) : null)

    const handlePageChange = (p: number) => {
        setSearchParams({page: String(p)})
        window.scrollTo({top: 0, behavior: "smooth"})
    }

    const handleCategoryClick = (cat: Category) => {
        setActiveCategory((prev) => (prev?.id === cat.id ? null : cat))
    }

    const filteredPosts = activeCategory ? posts.filter((p) => p.categoryId === activeCategory.id) : posts

    if (loading && posts.length === 0) return <LoadingState text="Memuat artikel…" />
    if (error) return <ErrorState message={error} onRetry={() => fetchPosts({page})} />

    return (
        <div className="space-y-10">
            <div className="pt-4 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-black mb-3">Blog & Insight</p>
                <h1 className="font-display text-4xl sm:text-5xl text-black/90 leading-tight mb-4">
                    Cerita & Insight
                    <br />
                    <span className="text-black/30">untuk pembaca penasaran</span>
                </h1>
                <p className="text-black/50 text-center text-base max-w-md leading-relaxed">
                    Kumpulan tulisan tentang teknologi, desain, dan hal-hal menarik lainnya.
                </p>
            </div>

            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2 border-b border-black/10">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            activeCategory === null
                                ? "bg-black/90 text-white shadow-sm"
                                : "bg-white text-black/50 border border-black/20 hover:border-black/40 hover:text-black/70",
                        )}>
                        Semua
                        <span
                            className={cn(
                                "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                                activeCategory === null ? "bg-white/20 text-white" : "bg-black/10 text-black/40",
                            )}>
                            {pagination.total}
                        </span>
                    </button>

                    {categories.map((cat) => {
                        const count = posts.filter((p) => p.categoryId === cat.id).length
                        const isActive = activeCategory?.id === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-black/90 text-white shadow-sm"
                                        : "bg-white text-black/50 border border-black/20 hover:border-black/40 hover:text-black/70",
                                )}>
                                {cat.name}
                                {count > 0 && (
                                    <span
                                        className={cn(
                                            "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                                            isActive ? "bg-white/20 text-white" : "bg-black/10 text-black/40",
                                        )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}

            {activeCategory && (
                <div className="flex items-center gap-2 -mt-4">
                    <span className="text-sm text-black/40">Menampilkan</span>
                    <Badge className={getCategoryColor(activeCategory.id)}>{activeCategory.name}</Badge>
                    <span className="text-xs text-black/30">— {filteredPosts.length} artikel</span>
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="ml-1 text-xs text-black/40 underline hover:text-black/60 transition-colors">
                        Reset
                    </button>
                </div>
            )}

            {filteredPosts.length === 0 ? (
                <EmptyState
                    title={activeCategory ? `Tidak ada artikel di "${activeCategory.name}"` : "Belum ada artikel"}
                    description={
                        activeCategory ? "Coba pilih kategori lain." : "Artikel pertama akan muncul di sini segera."
                    }
                />
            ) : (
                <div className="space-y-10">
                    {filteredPosts[0] && (
                        <article className="group bg-white rounded-2xl overflow-hidden border border-black/10 hover:border-black/20 hover:shadow-xl transition-all duration-300 sm:flex">
                            <Link
                                to={`/post/${filteredPosts[0].slug}`}
                                className="block sm:w-72 lg:w-96 shrink-0 overflow-hidden">
                                <img
                                    src={filteredPosts[0].image}
                                    alt={filteredPosts[0].title}
                                    className="w-full h-56 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>
                            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        {getCategoryById(filteredPosts[0].categoryId) && (
                                            <Badge className={getCategoryColor(filteredPosts[0].categoryId!)}>
                                                <Link
                                                    to={`/category/${getCategoryById(filteredPosts[0].categoryId)?.slug}`}
                                                    onClick={(e) => e.stopPropagation()}>
                                                    {getCategoryById(filteredPosts[0].categoryId)?.name}
                                                </Link>
                                            </Badge>
                                        )}
                                        <span className="text-xs text-black/30">Featured</span>
                                    </div>
                                    <h2 className="font-display text-2xl text-black/90 leading-snug group-hover:text-accent-600 transition-colors">
                                        <Link to={`/post/${filteredPosts[0].slug}`}>{filteredPosts[0].title}</Link>
                                    </h2>
                                    <p className="text-sm text-black/50 leading-relaxed">
                                        {truncate(filteredPosts[0].excerpt, 200)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
                                    <p className="text-xs text-black/40">{formatDate(filteredPosts[0].createdAt)}</p>
                                    <Link
                                        to={`/post/${filteredPosts[0].slug}`}
                                        className="text-xs font-medium text-accent-600 hover:text-accent-500 transition-colors">
                                        Baca selengkapnya →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )}

                    {/* post grid */}
                    {filteredPosts.length > 1 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.slice(1).map((post) => {
                                const cat = getCategoryById(post.categoryId)
                                return (
                                    <article
                                        key={post.id}
                                        className="group bg-white rounded-xl border border-black/10 overflow-hidden hover:border-black/20 hover:shadow-lg transition-all duration-300 flex flex-col">
                                        <Link to={`/post/${post.slug}`} className="block overflow-hidden shrink-0">
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>
                                        <div className="p-4 flex flex-col flex-1">
                                            {cat && (
                                                <Badge
                                                    className={cn(
                                                        getCategoryColor(post.categoryId!),
                                                        "mb-2 self-start",
                                                    )}>
                                                    <Link
                                                        to={`/category/${cat.slug}`}
                                                        onClick={(e) => e.stopPropagation()}>
                                                        {cat.name}
                                                    </Link>
                                                </Badge>
                                            )}
                                            <h3 className="font-display text-base text-black/90 leading-snug mb-2 group-hover:text-accent-600 transition-colors flex-1">
                                                <Link to={`/post/${post.slug}`}>{truncate(post.title, 70)}</Link>
                                            </h3>
                                            <p className="text-xs text-black/50 leading-relaxed mb-4">
                                                {truncate(post.excerpt, 100)}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
                                                <p className="text-xs text-black/40">{formatDate(post.createdAt)}</p>
                                                <Link
                                                    to={`/post/${post.slug}`}
                                                    className="text-xs text-accent-600 hover:text-accent-500 transition-colors font-medium">
                                                    Baca →
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}

                    {/* pagination — hanya muncul saat tidak filter */}
                    {!activeCategory && (
                        <div className="flex justify-center pt-4">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
