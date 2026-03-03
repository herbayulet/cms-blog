import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {usePostsStore} from "@/store/postsStore"
import {useCategoriesStore} from "@/store/categoriesStore"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {LoadingState} from "@/components/ui/loading-state"
import {ErrorState} from "@/components/ui/error-state"
import {EmptyState} from "@/components/ui/empty-state"
import {Pagination} from "@/components/ui/pagination"
import {ConfirmDialog} from "@/components/ui/confirm-dialog"
import {Plus, Pencil, Trash2} from "lucide-react"
import {getCategoryColor, truncate, formatDate} from "@/utils/helpers"
import toast from "react-hot-toast"
import {useUser} from "@clerk/clerk-react"

export default function AdminPosts() {
    const navigate = useNavigate()
    const {user} = useUser()
    const {posts, loading, error, pagination, fetchPosts, deletePost} = usePostsStore()
    const {categories, fetchCategories} = useCategoriesStore()
    const [page, setPage] = useState(1)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (!user) return

        fetchPosts({
            page,
            userId: user.id,
        })
    }, [page, user])
    const getCategoryName = (catId: number | null) => categories.find((c) => c.id === catId)

    const handleDelete = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await deletePost(deleteId)
            toast.success("Post berhasil dihapus")
            setDeleteId(null)
        } catch {
            toast.error("Gagal menghapus post")
        } finally {
            setDeleting(false)
        }
    }

    if (loading && posts.length === 0) return <LoadingState text="Memuat posts…" />
    if (error) return <ErrorState message={error} onRetry={() => fetchPosts({page})} />

    return (
        <div>
            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-left text-2xl text-black/80">Posts</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">{pagination.total} artikel tersedia</p>
                </div>
                <Button onClick={() => navigate("/admin/posts/create")} size="sm" className="cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Buat Post
                </Button>
            </div>

            {posts.length === 0 ? (
                <EmptyState
                    title="Belum ada post"
                    description="Buat artikel pertama kamu."
                    action={
                        <Button onClick={() => navigate("/admin/posts/create")} size="sm" className="cursor-pointer">
                            <Plus className="w-3.5 h-3.5" /> Buat Post
                        </Button>
                    }
                />
            ) : (
                <>
                    {/* table */}
                    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/10 bg-black/5/50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-black/50 uppercase tracking-wider">
                                            Post
                                        </th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-black/50 uppercase tracking-wider hidden sm:table-cell">
                                            Kategori
                                        </th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-black/50 uppercase tracking-wider hidden md:table-cell">
                                            Tanggal
                                        </th>
                                        <th className="px-5 py-3 text-xs font-semibold text-black/50 uppercase tracking-wider w-24">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {posts.map((post, i) => {
                                        const cat = getCategoryName(post.categoryId)
                                        return (
                                            <tr key={post.id} className="hover:bg-black/5 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={post.thumbnail}
                                                            alt={`thumbnail ${i + 1}`}
                                                            className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-left text-black/90 truncate max-w-xs">
                                                                {post.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                                                                {truncate(post.excerpt, 60)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 hidden sm:table-cell">
                                                    {cat ? (
                                                        <Badge className={getCategoryColor(cat.id)}>{cat.name}</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Tanpa Kategori</Badge>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-xs text-muted-foreground hidden md:table-cell whitespace-nowrap">
                                                    {formatDate(post.createdAt)}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <button
                                                            onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                                                            className="p-1.5 cursor-pointer text-muted-foreground hover:text-black/70 hover:bg-black/10 rounded-lg transition-colors"
                                                            title="Edit">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(post.id)}
                                                            className="p-1.5 cursor-pointer text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hapus">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* pagination */}
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                </>
            )}

            {/* confirm delete */}
            <ConfirmDialog
                open={deleteId !== null}
                title="Hapus post ini?"
                description="gabisa dibatalin ya."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    )
}
