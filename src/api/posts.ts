import { supabase } from '@/lib/supabase';
import type { Post, PostFormData } from '@/types';

/**
 * mapping DB row → Frontend Post type
 * karena DB pakai snake_case
 */
function mapPost(row: any): Post {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        body: row.body,
        excerpt: row.excerpt,
        image: row.image,
        thumbnail: row.thumbnail,
        categoryId: row.category_id,
        userId: row.user_id,
        createdAt: row.created_at,
    };
}

export const postsApi = {
    // ─────────────────────────────────────────
    // get all (dengan pagination)
    // ─────────────────────────────────────────
    async getAll (
        options?: {
            page?: number
            limit?: number
            userId: string
        }
    ): Promise<{data: Post[]; total:number}> {
        const page = options?.page ?? 1
        const limit = options?.limit ?? 10
        const userId = options?.userId

        const from = (page - 1) * limit
        const to = from + limit - 1

        let query = supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        // 🔥 kalau ada userId → filter
        if (userId) {
            query = query.eq('user_id', userId)
        }

        const { data, count, error } = await query

        if (error) throw error

        return {
            data: (data ?? []).map(mapPost),
            total: count ?? 0,
        }
    },

    // ─────────────────────────────────────────
    // get by id
    // ─────────────────────────────────────────
    async getById(id: number): Promise<Post> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return mapPost(data);
    },

    // ─────────────────────────────────────────
    // get by user
    // ─────────────────────────────────────────
    async getByUser(userId: string): Promise<Post[]> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data ?? []).map(mapPost);
    },

    // ─────────────────────────────────────────
    // create
    // ─────────────────────────────────────────
    async create(data: PostFormData, userId: string): Promise<Post> {
        const { data: inserted, error } = await supabase
            .from('posts')
            .insert({
                title: data.title,
                slug: data.slug,
                body: data.body,
                excerpt: data.excerpt,
                image: data.image,
                thumbnail: data.thumbnail,
                category_id: data.categoryId,
                user_id: userId
            })
            .select()
            .single();

        if (error) throw error;

        return mapPost(inserted);
    },

    // ─────────────────────────────────────────
    // update
    // ─────────────────────────────────────────
    async update(id: number, data: Partial<PostFormData>): Promise<Post> {
        const { data: updated, error } = await supabase
            .from('posts')
            .update({
                title: data.title,
                slug: data.slug,
                body: data.body,
                excerpt: data.excerpt,
                image: data.image,
                thumbnail: data.thumbnail,
                category_id: data.categoryId,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return mapPost(updated);
    },

    // ─────────────────────────────────────────
    // delete
    // ─────────────────────────────────────────
    async delete(id: number): Promise<void> {
        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) throw error;
    },
};
