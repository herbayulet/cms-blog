import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface FormSelectProps {
    label?: string
    error?: string
    placeholder?: string
    options: {value: string | number; label: string}[]
    value?: string | number
    onChange?: (value: string) => void
    disabled?: boolean
    id?: string
}

const FormSelect = ({label, error, placeholder, options, value, onChange, disabled, id}: FormSelectProps) => {
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
            <Select value={value !== undefined ? String(value) : ""} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id={inputId} className={error ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder={placeholder ?? "Pilih opsi…"} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={String(o.value)}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

export {FormSelect}
