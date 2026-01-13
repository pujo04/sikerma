"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchableSelectProps {
  label?: string
  value: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  size?: "sm" | "xs"
  onChange: (value: string) => void
}

export function SearchableSelect({
  label,
  value,
  options,
  placeholder = "- Pilih -",
  disabled,
  size = "sm",
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)

  const labelClass = size === "xs" ? "text-xs" : "text-sm"
  const fieldClass = "text-sm"

  return (
    <div className="space-y-1 relative w-full max-w-full">
      {label && (
        <label className={cn(labelClass, "font-medium")}>
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full max-w-full px-3 py-2",
              "flex items-start justify-between",
              "text-left font-normal",
              "whitespace-normal break-words",
              fieldClass,
              !value && "text-muted-foreground"
            )}
          >
            <span className="flex-1 block break-words">
              {value || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        {/* ================= POPOVER ================= */}
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          className={cn(
            "z-[1000] p-1",
            "w-[--radix-popover-trigger-width]",
            "max-w-full",
            "overflow-hidden"
          )}
        >
          <Command className="w-full max-w-full overflow-hidden">
            <CommandInput
              placeholder="Ketik untuk mencari..."
              className="h-9 px-3 text-sm"
            />

            <CommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
              Data tidak ditemukan
            </CommandEmpty>

            <CommandGroup className="max-h-60 overflow-y-auto overflow-x-hidden">
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={cn(
                    "px-3 py-2 text-sm font-normal",
                    "flex items-start gap-2",
                    "max-w-full",
                    "whitespace-normal break-words",
                    "leading-snug",
                    "truncate-none"
                  )}
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      value === opt ? "opacity-100" : "opacity-0"
                    )}
                  />

                  <span
                    className="
                      block flex-1
                      max-w-full
                      break-words
                      overflow-hidden
                    "
                  >
                    {opt}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
