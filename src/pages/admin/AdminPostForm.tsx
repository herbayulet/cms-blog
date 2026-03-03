import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useForm, Controller} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {usePostsStore} from "@/store/postsStore"
import {useCategoriesStore} from "@/store/categoriesStore"
import {postSchema, type PostSchema} from "@/lib/validations"
import {generateSlug} from "@/utils/helpers"
import {ArrowLeft, RefreshCw, Loader2} from "lucide-react"
import toast from "react-hot-toast"
import {Button} from "@/components/ui/button"
import {LoadingState} from "@/components/ui/loading-state"
import {FormInput} from "@/components/ui/form-input"
import {FormTextarea} from "@/components/ui/form-textarea"
import {FormSelect} from "@/components/ui/form-select"
import {useUser} from "@clerk/clerk-react"

export default function AdminPostForm() {
    const navigate = useNavigate()
    const {id} = useParams<{id: string}>()
    const {user} = useUser()
    const isEdit = Boolean(id)
    const [imagePreview, setImagePreview] = useState<string>("")

    const {posts, loading, createPost, updatePost, fetchPosts} = usePostsStore()
    const {categories, fetchCategories} = useCategoriesStore()

    const existing = isEdit ? posts.find((p) => p.id === Number(id)) : null

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<PostSchema>({
        resolver: zodResolver(postSchema),
        mode: "onBlur",
        defaultValues: existing
            ? {
                  categoryId: existing.categoryId ?? 1,
                  title: existing.title,
                  slug: existing.slug,
                  excerpt: existing.excerpt,
                  body: existing.body,
                  image: undefined,
                  thumbnail: existing.thumbnail || "",
              }
            : {
                  categoryId: 1,
                  title: "",
                  slug: "",
                  excerpt: "",
                  body: "",
                  image: undefined,
                  thumbnail: "",
              },
    })

    const title = watch("title")
    const imageFile = watch("image")

    useEffect(() => {
        fetchCategories()
        if (posts.length === 0) fetchPosts({page: 1})
    }, [])

    useEffect(() => {
        if (!isEdit && title) {
            setValue("slug", generateSlug(title), {shouldValidate: true})
        }
    }, [title, isEdit])

    // Handle image preview
    useEffect(() => {
        if (imageFile instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(imageFile)
        } else if (existing?.image && !imageFile) {
            setImagePreview(existing.image)
        }
    }, [imageFile, existing])

    const onSubmit = async (data: PostSchema) => {
        if (!user) {
            toast.error("User tidak ditemukan")
            return
        }
        try {
            if (isEdit && existing) {
                await updatePost(existing.id, {
                    ...data,
                    image: data.image || undefined,
                })
                toast.success("Post berhasil diperbarui")
            } else {
                await createPost(
                    {
                        ...data,
                        image: data.image || undefined,
                        thumbnail: data.thumbnail || "",
                    },
                    user.id,
                )
                toast.success("Post berhasil dibuat")
            }
            navigate("/admin/posts")
        } catch {
            toast.error("Gagal menyimpan post")
        }
    }

    if (loading && categories.length === 0) return <LoadingState />

    return (
        <div className="max-w-2xl">
            {/* header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" type="button" onClick={() => navigate("/admin/posts")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl text-left text-black/80">{isEdit ? "Edit Post" : "Buat Post Baru"}</h1>
                    <p className="text-sm text-muted-foreground">
                        {isEdit ? "Perbarui konten artikel." : "Isi form berikut untuk membuat artikel baru."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* category */}
                <Controller
                    name="categoryId"
                    control={control}
                    render={({field}) => (
                        <FormSelect
                            label="Kategori"
                            placeholder="Pilih kategori…"
                            options={categories.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
                            value={field.value ?? ""}
                            onChange={(val) => field.onChange(Number(val))}
                            error={errors.categoryId?.message}
                        />
                    )}
                />

                {/* title */}
                <FormInput
                    label="Judul"
                    placeholder="Masukkan judul artikel…"
                    error={errors.title?.message}
                    {...register("title")}
                />

                {/* slug */}
                <div className="relative">
                    <FormInput
                        label="Slug"
                        placeholder="judul-artikel-anda"
                        helper="Auto-generate dari judul. Bisa diedit manual."
                        error={errors.slug?.message}
                        {...register("slug")}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setValue("slug", generateSlug(title), {
                                shouldValidate: true,
                            })
                        }
                        className="absolute right-1 top-6 h-7 w-7"
                        title="Generate ulang slug">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {/* excerpt */}
                <FormTextarea
                    label="Deskripsi Singkat"
                    placeholder="Ringkasan singkat artikel…"
                    rows={3}
                    error={errors.excerpt?.message}
                    {...register("excerpt")}
                />

                {/* body */}
                <FormTextarea
                    label="Konten"
                    placeholder="Tulis isi artikel di sini…"
                    rows={10}
                    error={errors.body?.message}
                    {...register("body")}
                />

                {/* image upload */}
                <Controller
                    name="image"
                    control={control}
                    render={({field}) => (
                        <FormInput
                            label="Gambar"
                            type="file"
                            accept="image/*"
                            error={errors.image?.message}
                            helper="Pilih file gambar (PNG, JPG, WebP). Max 5MB"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    field.onChange(files[0]);
                                } else {
                                    field.onChange(null);
                                }
                            }}
                            onBlur={field.onBlur}
                        />
                    )}
                />

                {/* image preview */}
                {imagePreview && (
                    <div className="rounded-lg overflow-hidden border bg-muted">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-40 object-cover"
                        />
                    </div>
                )}

                {/* actions */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={() => navigate("/admin/posts")}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                        {isEdit ? "Simpan Perubahan" : "Buat Post"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
