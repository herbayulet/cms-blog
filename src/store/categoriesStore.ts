import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoriesApi } from '@/api/categories';
import type { Category, CategoryFormData } from '@/types';

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    createCategory: (data: CategoryFormData) => Promise<Category>;
    updateCategory: (id: number, data: CategoryFormData) => Promise<Category>;
    deleteCategory: (id: number) => Promise<void>;
    clearError: () => void;
}

export const useCategoriesStore = create<CategoriesState>()(
    devtools(
        (set) => ({
            categories: [],
            loading: false,
            error: null,

            fetchCategories: async () => {
                set({ loading: true, error: null });

                try {
                    const data = await categoriesApi.getAll();
                    set({ categories: data, loading: false });
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                }
            },

            createCategory: async (data) => {
                set({ loading: true, error: null });

                try {
                    const newCat = await categoriesApi.create(data);

                    set((state) => ({
                        categories: [...state.categories, newCat],
                        loading: false,
                    }));

                    return newCat;
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            updateCategory: async (id, data) => {
                set({ loading: true, error: null });

                try {
                    const updated = await categoriesApi.update(id, data);

                    set((state) => ({
                        categories: state.categories.map((c) =>
                            c.id === id ? updated : c
                        ),
                        loading: false,
                    }));

                    return updated;
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            deleteCategory: async (id) => {
                set({ loading: true, error: null });

                try {
                    await categoriesApi.delete(id);

                    set((state) => ({
                        categories: state.categories.filter((c) => c.id !== id),
                        loading: false,
                    }));
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            clearError: () => set({ error: null }),
        }),
        { name: 'categories-store' }
    )
);
