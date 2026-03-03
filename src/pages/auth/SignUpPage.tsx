import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Link
                to="/"
                className=" text-3xl text-black/80 mb-8 hover:text-accent-600 transition-colors"
            >
                ✦ Blog
            </Link>

            <SignUp
                appearance={{
                    elements: {
                        rootBox: 'w-full max-w-sm',
                        card: 'bg-white rounded-2xl shadow-sm border border-black/10 p-6',
                        headerTitle: ' text-xl text-black/80',
                        headerSubtitle: 'text-sm text-black/50',
                        socialButtonsBlockButton:
                            'border border-black/20 rounded-lg text-sm font-medium text-black/70 hover:bg-black/5 transition-colors',
                        formFieldInput:
                            'border-black/20 rounded-lg text-sm focus:ring-ink-800',
                        formButtonPrimary:
                            'bg-black/90 hover:bg-black/70 rounded-lg text-sm font-medium transition-colors',
                        footerActionLink:
                            'text-accent-600 hover:text-accent-500',
                    },
                }}
                forceRedirectUrl="/admin"
                signInUrl="/sign-in"
            />

            <p className="mt-6 text-xs text-muted-foreground">
                Sudah punya akun?{' '}
                <Link
                    to="/sign-in"
                    className="text-accent-600 hover:underline font-medium"
                >
                    Masuk di sini
                </Link>
            </p>
        </div>
    );
}
