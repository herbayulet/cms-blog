import {z} from "zod"

export const postSchema = z.object({
    categoryId: z.number({message: "Pilih category terlebih dahulu"}).min(1, "Category wajib dipilih"),
    title: z.string().min(3, "Judul minimal 3 karakter").max(150, "Judul maksimal 150 karakter"),
    slug: z
        .string()
        .min(3, "Slug minimal 3 karakter")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
    excerpt: z
        .string()
        .min(10, "Deskripsi singkat minimal 10 karakter")
        .max(300, "Deskripsi singkat maksimal 300 karakter"),
    body: z.string().min(20, "Konten minimal 20 karakter"),
    image: z.instanceof(File).refine((file) => file.type.startsWith("image/"), "File harus berupa gambar").refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran gambar maksimal 5MB").optional().or(z.null()),
    thumbnail: z.string(),
})

export type PostSchema = z.infer<typeof postSchema>

export const categorySchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
    slug: z
        .string()
        .min(2, "Slug minimal 2 karakter")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
})

export type CategorySchema = z.infer<typeof categorySchema>

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Password lama wajib diisi"),
        newPassword: z
            .string()
            .min(8, "Password baru minimal 8 karakter")
            .regex(/[A-Z]/, "Harus mengandung minimal 1 huruf kapital")
            .regex(/[0-9]/, "Harus mengandung minimal 1 angka"),
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
