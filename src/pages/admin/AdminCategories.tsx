import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategoriesStore } from '@/store/categoriesStore';
import { categorySchema, type CategorySchema } from '@/lib/validations';
import { generateSlug } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FormInput } from '@/components/ui/form-input';
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Check,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

export default function AdminCategories() {
    const {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategoriesStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategorySchema>({ resolver: zodResolver(categorySchema) });

    const nameValue = watch('name');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!editingId && nameValue) {
            setValue('slug', generateSlug(nameValue), { shouldValidate: true });
        }
    }, [nameValue, editingId]);

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setShowForm(true);
        reset({ name: cat.name, slug: cat.slug });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        reset({ name: '', slug: '' });
    };

    const onSubmit = async (data: CategorySchema) => {
        try {
            if (editingId) {
                await updateCategory(editingId, data);
                toast.success('Kategori diperbarui');
            } else {
                await createCategory(data);
                toast.success('Kategori dibuat');
            }
            cancelForm();
        } catch {
            toast.error('Gagal menyimpan kategori');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await deleteCategory(deleteId);
            toast.success('Kategori dihapus');
            setDeleteId(null);
        } catch {
            toast.error('Gagal menghapus kategori');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && categories.length === 0)
        return <LoadingState text="Memuat kategori…" />;
    if (error) return <ErrorState message={error} onRetry={fetchCategories} />;

    return (
        <div className="max-w-2xl">
            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-left text-2xl text-black/80">
                        Kategori
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {categories.length} kategori tersedia
                    </p>
                </div>
                {!showForm && (
                    <Button size="sm" onClick={() => setShowForm(true)}>
                        <Plus className="w-3.5 h-3.5" /> Tambah
                    </Button>
                )}
            </div>

            {/* form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white border rounded-2xl p-5 mb-6 space-y-4"
                >
                    <h2 className=" text-base text-black/80">
                        {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                    </h2>

                    <FormInput
                        label="Nama"
                        placeholder="Nama kategori…"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <div className="relative">
                        <FormInput
                            label="Slug"
                            placeholder="nama-kategori"
                            helper="Auto-generate dari nama."
                            error={errors.slug?.message}
                            {...register('slug')}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setValue('slug', generateSlug(nameValue), {
                                    shouldValidate: true,
                                })
                            }
                            className="absolute right-1 top-6 h-7 w-7"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelForm}
                        >
                            <X className="w-3.5 h-3.5" /> Batal
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Check className="w-3.5 h-3.5" />
                            )}
                            {editingId ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            )}

            {/* list */}
            {categories.length === 0 ? (
                <EmptyState
                    title="Belum ada kategori"
                    description="Tambah kategori pertama untuk mengorganisir artikel."
                    action={
                        <Button size="sm" onClick={() => setShowForm(true)}>
                            <Plus className="w-3.5 h-3.5" /> Tambah Kategori
                        </Button>
                    }
                />
            ) : (
                <div className="bg-card rounded-2xl border overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-150 text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        No.
                                    </th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {categories.map((cat, i) => (
                                    <tr
                                        key={cat.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-5 py-3 text-xs text-muted-foreground">
                                            {i + 1}
                                        </td>
                                        <td className="px-5 py-3 font-medium">
                                            {cat.name}
                                        </td>
                                        <td className="px-5 py-3">
                                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                                                {cat.slug}
                                            </code>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => startEdit(cat)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        setDeleteId(cat.id)
                                                    }
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={deleteId !== null}
                title="Hapus kategori ini?"
                description="Post yang berkaitan ga berpengaruh."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                loading={deleting}
            />
        </div>
    );
}
