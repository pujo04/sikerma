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
  required?: boolean;
  onChange: (value: string | number) => void;
}

/* ================= COMPONENT ================= */

export function SearchableSelect({
  label,
  value,
  options,
  placeholder = "- Pilih -",
  disabled = false,
  size = "sm",
  required = true,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const labelClass = size === "xs" ? "text-xs" : "text-sm";
  const fieldClass = "text-sm";

  const getLabel = (opt: Option) =>
    typeof opt === "string" ? opt : opt.label;

  const getValue = (opt: Option) =>
    typeof opt === "string" ? opt : opt.value;

  const selectedOption = React.useMemo(
    () => options.find((opt) => getValue(opt) === value),
    [options, value]
  );

  const selectedLabel = selectedOption ? getLabel(selectedOption) : "";

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className={cn(labelClass, "font-medium block")}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full min-h-10 px-3 py-2 flex justify-between items-center gap-2 shrink-0",
              "text-left font-normal border-input whitespace-nowrap",
              "min-w-[180px]",
              fieldClass,
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate flex-1">
              {value ? selectedLabel : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        {/* POPUP WIDTH SYNC */}
        <PopoverContent
          align="start"
          sideOffset={4}
          className="p-0 z-[10000] shadow-md border bg-popover"
          style={{
            width: "var(--radix-popover-trigger-width)",
            minWidth: "180px",
            maxWidth: "300px",
          }}
          side="bottom"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Ketik untuk mencari..."
              className="h-9 px-3 text-sm"
              value={search}
              onValueChange={setSearch}
            />

            <CommandEmpty className="px-3 py-4 text-sm text-center text-muted-foreground">
              Data tidak ditemukan
            </CommandEmpty>

            <CommandGroup className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
              {options
                .filter((opt) =>
                  getLabel(opt)
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((opt, index) => {
                  const optValue = getValue(opt);
                  const optLabel = getLabel(opt);

                  return (
                    <CommandItem
                      key={`${index}-${String(optValue)}`}
                      value={String(optValue)}
                      onSelect={() => {
                        onChange(optValue);
                        setOpen(false);
                        setSearch("");
                      }}
                      className="
                        flex items-start gap-2
                        px-3 py-3 text-sm
                        cursor-pointer
                        rounded-sm
                        whitespace-normal
                        break-words
                        w-full
                      "
                    >
                      <Check
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0",
                          value === optValue ? "opacity-100" : "opacity-0"
                        )}
                      />

                      <span className="flex-1 leading-relaxed">
                        {optLabel}
                      </span>
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