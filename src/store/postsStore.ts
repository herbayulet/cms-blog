import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { postsApi } from '@/api/posts';
import type { Post, PostFormData, PaginationState } from '@/types';

interface PostsState {
    posts: Post[];
    currentPost: Post | null;
    loading: boolean;
    error: string | null;
    pagination: PaginationState;

    fetchPosts: (options?: {page?: number, userId?: string}) => Promise<void>;
    fetchPost: (id: number) => Promise<void>;
    createPost: (data: PostFormData, userId: string) => Promise<Post>;
    updatePost: (id: number, data: Partial<PostFormData>) => Promise<Post>;
    deletePost: (id: number) => Promise<void>;
    setCurrentPost: (post: Post | null) => void;
    clearError: () => void;
}

const PER_PAGE = 10;

export const usePostsStore = create<PostsState>()(
    devtools(
        (set) => ({
            posts: [],
            currentPost: null,
            loading: false,
            error: null,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                total: 0,
                perPage: PER_PAGE,
            },

            // ─────────────────────────────
            // fetch posts
            // ─────────────────────────────
            fetchPosts: async (options) => {
                const page = options?.page ?? 1
                const userId = options?.userId

                set({ loading: true, error: null })

                try {
                    const { data, total } = await postsApi.getAll({
                    page,
                    limit: PER_PAGE,
                    userId: userId ?? '',
                    })

                    set({
                    posts: data,
                    loading: false,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / PER_PAGE),
                        total,
                        perPage: PER_PAGE,
                    },
                    })
                } catch (e) {
                    set({ error: (e as Error).message, loading: false })
                }
            },

            // ─────────────────────────────
            // fetch single post
            // ─────────────────────────────
            fetchPost: async (id) => {
                set({ loading: true, error: null, currentPost: null });

                try {
                    const post = await postsApi.getById(id);
                    set({ currentPost: post, loading: false });
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                }
            },

            // ─────────────────────────────
            // create
            // ─────────────────────────────
            createPost: async (data, userId) => {
                set({ loading: true, error: null });

                try {
                    const newPost = await postsApi.create(data, userId);

                    set((state) => ({
                        posts: [newPost, ...state.posts],
                        loading: false,
                    }));

                    return newPost;
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            // ─────────────────────────────
            // update
            // ─────────────────────────────
            updatePost: async (id, data) => {
                set({ loading: true, error: null });

                try {
                    const updated = await postsApi.update(id, data);

                    set((state) => ({
                        posts: state.posts.map((p) =>
                            p.id === id ? updated : p
                        ),
                        currentPost:
                            state.currentPost?.id === id
                                ? updated
                                : state.currentPost,
                        loading: false,
                    }));

                    return updated;
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            // ─────────────────────────────
            // delete
            // ─────────────────────────────
            deletePost: async (id) => {
                set({ loading: true, error: null });

                try {
                    await postsApi.delete(id);

                    set((state) => ({
                        posts: state.posts.filter((p) => p.id !== id),
                        loading: false,
                    }));
                } catch (e) {
                    set({ error: (e as Error).message, loading: false });
                    throw e;
                }
            },

            setCurrentPost: (post) => set({ currentPost: post }),
            clearError: () => set({ error: null }),
        }),
        { name: 'posts-store' }
    )
);
