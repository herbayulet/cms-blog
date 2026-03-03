import {Link, Outlet, useNavigate} from "react-router-dom"
import {useClerk, useUser} from "@clerk/clerk-react"
import {LayoutDashboard} from "lucide-react"
import {Button} from "../ui/button"

const PublicLayout = () => {
    const {user, isSignedIn} = useUser()
    const {signOut} = useClerk()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col">
            {/* header */}
            <header className="sticky top-0 z-30 backdrop-blur-md border-b border-black/10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link
                        to="/"
                        className=" text-2xl text-black/80 tracking-tight hover:text-accent-600 transition-colors">
                        ✦ BLOG CMS
                    </Link>
                    <nav className="flex items-center gap-4">
                        {isSignedIn ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate("/admin")}
                                    className="gap-1.5">
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    Admin
                                </Button>
                                <div className="flex items-center gap-2">
                                    {user?.imageUrl && (
                                        <img
                                            src={user.imageUrl}
                                            alt=""
                                            className="w-7 h-7 rounded-full object-cover ring-2 ring-ink-200"
                                        />
                                    )}
                                    <Button variant="secondary" size="sm" onClick={() => signOut()}>
                                        Keluar
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button variant="default" size="sm" onClick={() => navigate("/sign-in")}>
                                Masuk
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            {/* main */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
                <Outlet />
            </main>

            {/* footer */}
            <footer className="border-t border-black/10 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className=" text-muted">✦ Blog</span>
                    <span>© {new Date().getFullYear()} Blog CMS.</span>
                </div>
            </footer>
        </div>
    )
}

export default PublicLayout
