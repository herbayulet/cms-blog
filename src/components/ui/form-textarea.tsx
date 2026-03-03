import {forwardRef, type TextareaHTMLAttributes} from "react"
import {Textarea} from "@/components/ui/textarea"
import {cn} from "@/lib/utils"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    helper?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({label, error, helper, className, id, ...props}, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                    </label>
                )}
                <Textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "resize-none",
                        error && "border-destructive focus-visible:ring-destructive",
                        className,
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
                {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
            </div>
        )
    },
)
FormTextarea.displayName = "FormTextarea"

export {FormTextarea}
