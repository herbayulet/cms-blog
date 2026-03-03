import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-4">
            <Link
                to="/"
                className="font-display text-3xl text-ink-900 mb-8 hover:text-accent-600 transition-colors"
            >
                ✦ BLOG CMS
            </Link>

            <SignIn
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
                        dividerLine: 'bg-ink-100',
                        dividerText: 'text-ink-400 text-xs',
                    },
                }}
                redirectUrl="/admin"
                signUpUrl="/sign-up"
            />

            <p className="mt-6 text-xs text-ink-400">
                Belum punya akun?{' '}
                <Link
                    to="/sign-up"
                    className="text-accent-600 hover:underline font-medium"
                >
                    Daftar sekarang
                </Link>
            </p>
        </div>
    );
}
