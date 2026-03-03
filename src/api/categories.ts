import { supabase } from '@/lib/supabase';
import type { Category, CategoryFormData } from '@/types';

export const categoriesApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Category[];
    },

    async create(data: CategoryFormData) {
        const { data: inserted, error } = await supabase
            .from('categories')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return inserted as Category;
    },

    async update(id: number, data: CategoryFormData) {
        const { data: updated, error } = await supabase
            .from('categories')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated as Category;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
