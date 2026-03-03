// post
export interface Post {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt: string;
    image: string;
    thumbnail: string;
    categoryId: number | null;
    userId: string;
    createdAt?: string;
}

//  post untuk form
export interface PostFormData {
    categoryId: number | null;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    image: string;
    thumbnail: string;
}

// categoryu
export interface Category {
    id: number;
    name: string;
    slug: string;
}

// form category
export interface CategoryFormData {
    name: string;
    slug: string;
}

// pagination
export interface PaginationState {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
}

export interface RawPost {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface RawUser {
    id: number;
    name: string;
    username: string;
    email: string;
}
