import {Button} from "./button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "@/components/ui/dialog"

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
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" size="sm" onClick={onCancel}>
                        Batal
                    </Button>

                    <Button variant="destructive" className="text-white" size="sm" onClick={onConfirm} loading={loading}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
