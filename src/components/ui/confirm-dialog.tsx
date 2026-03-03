import {Button} from "./button"

export function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    loading,
}: {
    open: boolean
    title: string
    description?: string
    onConfirm: () => void
    onCancel: () => void
    loading?: boolean
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
                <h3 className="font-display text-lg text-ink-900">{title}</h3>
                {description && <p className="text-sm text-ink-500 mt-2">{description}</p>}
                <div className="flex gap-2 mt-6 justify-end">
                    <Button variant="secondary" size="sm" onClick={onCancel}>
                        Batal
                    </Button>
                    <Button variant="default" size="sm" onClick={onConfirm} loading={loading}>
                        Hapus
                    </Button>
                </div>
            </div>
        </div>
    )
}
