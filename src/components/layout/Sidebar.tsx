import {cn} from "@/lib/utils"
import {Link, NavLink, useNavigate} from "react-router-dom"
import {navItems} from "./AdminLayout"
import {Globe, LogOut} from "lucide-react"
import {useUser} from "@clerk/clerk-react"

interface SidebarProps {
    signout: () => void
    setSidebar: (open: boolean) => void
    mobile?: boolean
}

const Sidebar = ({signout, setSidebar, mobile = false}: SidebarProps) => {
    const {user} = useUser()
    const navigate = useNavigate()

    return (
        <aside
            className={cn(
                "flex flex-col bg-ink-900 text-cream-100",
                mobile ? "w-72 min-h-screen" : "w-60 min-h-screen hidden lg:flex",
            )}>
            {/* logo */}
            <div className="h-16 flex items-center px-6 border-b border-ink-700">
                <Link to="/admin" className="font-display text-xl text-cream-50 tracking-tight">
                    ✦ Blog <span className="text-xs font-sans text-ink-400 ml-1">admin</span>
                </Link>
            </div>

            {/* user info */}
            <div className="px-4 py-4 border-b border-ink-700">
                <div className="flex items-center gap-3">
                    {user?.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-ink-600"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-ink-700 flex items-center justify-center text-sm font-medium">
                            {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "A"}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-cream-50 truncate">{user?.fullName ?? "Admin"}</p>
                        <p className="text-xs text-ink-400 truncate">{user?.emailAddresses?.[0]?.emailAddress ?? ""}</p>
                    </div>
                </div>
            </div>

            {/* nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map(({to, label, icon: Icon, end}) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={() => setSidebar(false)}
                        className={({isActive}) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                isActive
                                    ? "bg-cream-50 text-ink-900"
                                    : "text-ink-300 hover:bg-ink-800 hover:text-cream-50",
                            )
                        }>
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* bottom actions */}
            <div className="px-3 pb-4 space-y-0.5">
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-cream-50 transition-all duration-150">
                    <Globe className="w-4 h-4 shrink-0" />
                    Lihat Situs
                </button>
                <button
                    onClick={signout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:bg-red-900/50 hover:text-red-300 transition-all duration-150">
                    <LogOut className="w-4 h-4 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
