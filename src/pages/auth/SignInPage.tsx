import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Link
                to="/"
                className=" text-3xl text-black/80 mb-8 hover:text-accent transition-colors"
            >
                ✦ BLOG CMS
            </Link>

            <SignIn
                appearance={{
                    elements: {
                        rootBox: 'w-full max-w-sm',
                        card: 'bg-white rounded-2xl shadow-sm border border-black/10 p-6',
                        headerTitle: ' text-xl text-black/80',
                        headerSubtitle: 'text-sm text-black/50',
                        socialButtonsBlockButton:
                            'border border-black/20 rounded-lg text-sm font-medium text-black-700 hover:bg-black/50 transition-colors',
                        formFieldInput:
                            'border-black/20 rounded-lg text-sm focus:ring-black/80',
                        formButtonPrimary:
                            'bg-black/90 hover:bg-black-700 rounded-lg text-sm font-medium transition-colors',
                        footerActionLblack:
                            'text-accent-600 hover:text-accent-500',
                        dividerLine: 'bg-black/10',
                        dividerText: 'text-black/40 text-xs',
                    },
                }}
                redirectUrl="/admin"
                signUpUrl="/sign-up"
            />

            <p className="mt-6 text-xs text-black/40">
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
