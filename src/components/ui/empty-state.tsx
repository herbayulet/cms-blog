export function EmptyState({
    title,
    description,
    action,
}: {
    title: string
    description?: string
    action?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center">
                <span className="text-3xl">✦</span>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-black/80">{title}</p>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            </div>
            {action}
        </div>
    )
}
