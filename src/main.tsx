import ReactDOM from "react-dom/client"
import {ClerkProvider} from "@clerk/clerk-react"
import App from "./App"
import "./index.css"
import { Toaster } from "react-hot-toast"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key — tambahkan VITE_CLERK_PUBLISHABLE_KEY di .env")
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/sign-in">
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3500,
                style: {
                    background: "#1a1916",
                    color: "#f9f6ee",
                    fontSize: "13px",
                    fontFamily: '"DM Sans", sans-serif',
                    borderRadius: "10px",
                    padding: "10px 14px",
                },
                success: {
                    iconTheme: {primary: "#a3c47c", secondary: "#1a1916"},
                },
                error: {
                    iconTheme: {primary: "#f87171", secondary: "#1a1916"},
                },
            }}
        />
    </ClerkProvider>,
)
