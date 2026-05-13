import { X } from "lucide-react";

interface CloseButtonProps {
    onClick: () => void;
    className?: string;
}

export function CloseButton({ onClick, className }: CloseButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        group
        rounded-sm
        p-1
        transition-colors
        hover:bg-[#0079C4]
        ${className || ""}
      `}
        >
            <X
                className="
          w-4 h-4
          text-muted-foreground
          transition-colors
          group-hover:text-white
        "
            />
        </button>
    );
}