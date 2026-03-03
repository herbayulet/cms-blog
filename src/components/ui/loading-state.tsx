import { Spinner } from "./spinner";

export function LoadingState({ text = 'Memuat data…' }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner className="w-7 h-7" />
            <p className="text-sm text-muted-foreground font-sans">{text}</p>
        </div>
    );
}