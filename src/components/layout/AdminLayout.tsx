import {useState} from "react"
import {Outlet, useNavigate} from "react-router-dom"
import {useClerk} from "@clerk/clerk-react"
import {LayoutGrid, FileText, Tag, KeyRound, Menu, X} from "lucide-react"
import Sidebar from "./Sidebar"

// eslint-disable-next-line react-refresh/only-export-components
export const navItems = [
    {to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true},
    {to: "/admin/posts", label: "Posts", icon: FileText, end: false},
    {to: "/admin/categories", label: "Categories", icon: Tag, end: false},
    {
        to: "/admin/change-password",
        label: "Change Password",
        icon: KeyRound,
        end: false,
    },
]

export default function AdminLayout() {
    const {signOut} = useClerk()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate("/sign-in")
    }
    
    return (
        <div className="flex min-h-screen bg-cream-100">
            {/* desktop sidebar */}
            <Sidebar signout={handleSignOut} setSidebar={setSidebarOpen}/>

            {/* mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-50">
                        <Sidebar signout={handleSignOut} setSidebar={setSidebarOpen} mobile />
                    </div>
                </div>
            )}

            {/* main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* mobile topbar */}
                <header className="lg:hidden h-14 bg-white border-b border-ink-100 flex items-center px-4 gap-3 sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="text-ink-600 p-1">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-display text-ink-900">✦ Tulis Admin</span>
                    {sidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto text-ink-600 p-1">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
