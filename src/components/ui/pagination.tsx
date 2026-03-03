import { Button } from "./button";

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        if (totalPages <= 7) return i + 1;
        if (currentPage <= 4) return i + 1;
        if (currentPage >= totalPages - 3) return totalPages - 6 + i;
        return currentPage - 3 + i;
    });

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ←
            </Button>
            {pages.map((p) => (
                <Button
                    key={p}
                    variant={p === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(p)}
                    className="min-w-8"
                >
                    {p}
                </Button>
            ))}
            <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                →
            </Button>
        </div>
    );
}
