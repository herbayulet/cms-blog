import { useUser } from '@clerk/clerk-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    changePasswordSchema,
    type ChangePasswordSchema,
} from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminChangePassword() {
    const { user } = useUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            await user?.updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Password berhasil diperbarui!');
            reset();
        } catch (err: unknown) {
            const msg =
                (err as { errors?: { message: string }[] })?.errors?.[0]
                    ?.message ??
                'Gagal memperbarui password. Periksa password lama kamu.';
            toast.error(msg);
        }
    };

    const isOAuthUser =
        user?.externalAccounts?.some((a) => a.provider === 'google') &&
        !user?.passwordEnabled;

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-md">
                <div className="mb-8">
                    <h1 className=" text-2xl text-black/80">
                        Ganti Password
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Perbarui password akun kamu.
                    </p>
                </div>

                {isOAuthUser ? (
                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 flex gap-4">
                        <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-sky-800">
                                Login via Google
                            </p>
                            <p className="text-xs text-sky-600 mt-1">
                                Akun kamu menggunakan Google OAuth. Penggantian
                                password dikelola melalui akun Google kamu.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border p-6">
                        <div className="flex items-center gap-3 mb-6 pb-5 border-b">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <KeyRound className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Keamanan Akun</p>
                                <p className="text-xs text-muted-foreground">
                                    Gunakan password yang kuat dan unik.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormInput
                                label="Password Lama"
                                type="password"
                                placeholder="••••••••"
                                error={errors.currentPassword?.message}
                                {...register('currentPassword')}
                            />
                            <FormInput
                                label="Password Baru"
                                type="password"
                                placeholder="••••••••"
                                helper="Minimal 8 karakter, 1 huruf kapital, 1 angka."
                                error={errors.newPassword?.message}
                                {...register('newPassword')}
                            />
                            <FormInput
                                label="Konfirmasi Password Baru"
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting && (
                                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                    )}
                                    Perbarui Password
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
