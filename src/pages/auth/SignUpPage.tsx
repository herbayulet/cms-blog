import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-4">
            <Link
                to="/"
                className="font-display text-3xl text-ink-900 mb-8 hover:text-accent-600 transition-colors"
            >
                ✦ Blog
            </Link>

            <SignUp
                appearance={{
                    elements: {
                        rootBox: 'w-full max-w-sm',
                        card: 'bg-white rounded-2xl shadow-sm border border-ink-100 p-6',
                        headerTitle: 'font-display text-xl text-ink-900',
                        headerSubtitle: 'text-sm text-ink-500',
                        socialButtonsBlockButton:
                            'border border-ink-200 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors',
                        formFieldInput:
                            'border-ink-200 rounded-lg text-sm focus:ring-ink-800',
                        formButtonPrimary:
                            'bg-ink-900 hover:bg-ink-700 rounded-lg text-sm font-medium transition-colors',
                        footerActionLink:
                            'text-accent-600 hover:text-accent-500',
                    },
                }}
                redirectUrl="/admin"
                signInUrl="/sign-in"
            />

            <p className="mt-6 text-xs text-ink-400">
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
