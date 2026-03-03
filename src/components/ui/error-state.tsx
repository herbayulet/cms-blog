import {Button} from "./button"

export function ErrorState({message, onRetry}: {message: string; onRetry?: () => void}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 text-xl font-display">
                !
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-ink-800">Terjadi kesalahan</p>
                <p className="text-xs text-ink-400 mt-1">{message}</p>
            </div>
            {onRetry && (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    Coba lagi
                </Button>
            )}
        </div>
    )
}
