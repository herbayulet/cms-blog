import {forwardRef, type InputHTMLAttributes} from "react"
import {Input} from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helper?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
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
                <Input
                    ref={ref}
                    id={inputId}
                    className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
                    {...props}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
                {helper && !error && <p className="text-xs text-muted-foreground">{helper}</p>}
            </div>
        )
    },
)
FormInput.displayName = "FormInput"

export {FormInput}
