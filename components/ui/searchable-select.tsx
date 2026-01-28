"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ================= TYPES ================= */

type Option =
  | string
  | {
      label: string;
      value: string | number;
    };

interface SearchableSelectProps {
  label?: string;
  value: string | number;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "xs";
  onChange: (value: string | number) => void;
}

/* ================= COMPONENT ================= */

export function SearchableSelect({
  label,
  value,
  options,
  placeholder = "- Pilih -",
  disabled,
  size = "sm",
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const labelClass = size === "xs" ? "text-xs" : "text-sm";
  const fieldClass = "text-sm";

  const getLabel = (opt: Option) =>
    typeof opt === "string" ? opt : opt.label;

  const getValue = (opt: Option) =>
    typeof opt === "string" ? opt : opt.value;

  const selectedLabel =
    options.find((opt) => getValue(opt) === value)?.label ??
    String(value || "");

  return (
    <div className="space-y-1 relative w-full">
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
              "w-full px-3 py-2",
              "flex justify-between items-center",
              "text-left font-normal",
              fieldClass,
              !value && "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {value ? selectedLabel : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          className="z-[1000] p-1 w-[--radix-popover-trigger-width]"
        >
          <Command>
            <CommandInput
              placeholder="Ketik untuk mencari..."
              className="h-9 px-3 text-sm"
            />

            <CommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
              Data tidak ditemukan
            </CommandEmpty>

            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((opt) => {
                const optValue = getValue(opt);
                const optLabel = getLabel(opt);

                return (
                  <CommandItem
                    key={String(optValue)} // ✅ KEY UNIK
                    value={String(optLabel)}
                    onSelect={() => {
                      onChange(optValue);
                      setOpen(false);
                    }}
                    className="flex items-start gap-2 px-3 py-2 text-sm"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        value === optValue ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="break-words">{optLabel}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
