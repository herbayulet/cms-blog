import type { ReactNode } from "react"
import {createBrowserRouter, Navigate} from "react-router-dom"
import {useAuth} from "@clerk/clerk-react"
import PublicLayout from "@/components/layout/PublicLayout"
import AdminLayout from "@/components/layout/AdminLayout"

// public pages
import HomePage from "@/pages/public/HomePage"
import PostDetailPage from "@/pages/public/PostDetailPage"
import CategoryPage from "@/pages/public/CategoryPage"

// auth pages
import SignInPage from "@/pages/auth/SignInPage"
import SignUpPage from "@/pages/auth/SignUpPage"

// admin pages
import AdminPosts from "@/pages/admin/AdminPosts"
import AdminPostForm from "@/pages/admin/AdminPostForm"
import AdminCategories from "@/pages/admin/AdminCategories"
import AdminChangePassword from "@/pages/admin/AdminChangePassword"
import AdminDashboard from "@/pages/admin/AdminDashboard"

// ─── auth guard ───────────────────────────────────────────────────────────────
function RequireAuth({children}: {children: ReactNode}) {
    const {isSignedIn, isLoaded} = useAuth()

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-black/90 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />
    }

    return <>{children}</>
}

export const router = createBrowserRouter([
    // public routes
    {
        element: <PublicLayout />,
        children: [
            {path: "/", element: <HomePage />},
            {path: "/post/:slug", element: <PostDetailPage />},
            {path: "/category/:slug", element: <CategoryPage />},
        ],
    },

    // auth routes (standalone pages)
    {path: "/sign-in", element: <SignInPage />},
    {path: "/sign-up", element: <SignUpPage />},

    // admin routes (protected)
    {
        path: "/admin",
        element: (
            <RequireAuth>
                <AdminLayout />
            </RequireAuth>
        ),
        children: [
            {index: true, element: <AdminDashboard />},
            {path: "posts", element: <AdminPosts />},
            {path: "posts/create", element: <AdminPostForm />},
            {path: "posts/edit/:id", element: <AdminPostForm />},
            {path: "categories", element: <AdminCategories />},
            {path: "change-password", element: <AdminChangePassword />},
        ],
    },

    // fallback
    {path: "*", element: <Navigate to="/" replace />},
])
