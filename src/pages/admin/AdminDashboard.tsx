import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { usePostsStore } from '@/store/postsStore';
import { useCategoriesStore } from '@/store/categoriesStore';
import { FileText, Tag, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const { user } = useUser();
    const navigate = useNavigate()
    const { posts, pagination, fetchPosts } = usePostsStore();
    const { categories, fetchCategories } = useCategoriesStore();

    useEffect(() => {
        if (user) {
            fetchPosts({
                page: 1,
                userId: user.id
            })
        }
        fetchCategories();
    }, []);

    const stats = [
        {
            label: 'Total Posts',
            value: pagination.total,
            icon: FileText,
            color: 'bg-sky-50 text-sky-600',
            href: '/admin/posts',
        },
        {
            label: 'Total Kategori',
            value: categories.length,
            icon: Tag,
            color: 'bg-emerald-50 text-emerald-600',
            href: '/admin/categories',
        },
    ];

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat pagi';
        if (hour < 17) return 'Selamat siang';
        return 'Selamat malam';
    };

    return (
        <div className="max-w-4xl">
            {/* header */}
            <div className="mb-8">
                <h1 className=" text-2xl text-black/80">
                    {greeting()}, {user?.firstName ?? 'Admin'}! 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Berikut ringkasan konten blog kamu saat ini.
                </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color, href }) => (
                    <Link
                        key={label}
                        to={href}
                        className="group bg-white rounded-2xl border border-black/10 p-5 flex items-center gap-4 hover:border-black/200 hover:shadow-sm transition-all"
                    >
                        <div
                            className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl  text-black/80">
                                {value}
                            </p>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-black/30 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Link>
                ))}
            </div>

            {/* quick actions */}
            <div className="bg-white rounded-2xl border border-black/10 p-5 mb-8">
                <h2 className=" text-sm text-black/80 mb-4">
                    Aksi Cepat
                </h2>
                <div className="flex items-center justify-center flex-wrap gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                            navigate("/admin/posts/create")
                            // (window.location.href = '/admin/posts/create')
                        }
                    >
                        <Plus className="w-3.5 h-3.5" /> Buat Post Baru
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            (window.location.href = '/admin/categories')
                        }
                    >
                        <Tag className="w-3.5 h-3.5" /> Kelola Kategori
                    </Button>
                </div>
            </div>

            {/* recent posts */}
            <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                    <h2 className=" text-sm text-black/80">
                        Post Terbaru
                    </h2>
                    <Link
                        to="/admin/posts"
                        className="text-xs text-accent-600 hover:underline"
                    >
                        Lihat semua →
                    </Link>
                </div>
                <div className="divide-y divide-black/5">
                    {posts.slice(0, 5).map((post) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-3 px-5 py-3"
                        >
                            <img
                                src={post.thumbnail}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-black/80 font-medium truncate">
                                    {post.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {post.excerpt}
                                </p>
                            </div>
                            <Link
                                to={`/admin/posts/edit/${post.id}`}
                                className="text-xs text-muted-foreground hover:text-black/70 shrink-0"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <p className="text-sm text-muted-foreground px-5 py-8 text-center">
                            Belum ada post.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
