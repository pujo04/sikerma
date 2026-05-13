import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { CheckCircle, AlertCircle } from "lucide-react";

/* ================= MODAL ================= */
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className={cn("bg-white rounded-xl shadow-xl w-full max-h-[80vh] flex flex-col", className)}>
        <div className="flex justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          {showCloseButton && <CloseButton onClick={onClose} />}
        </div>
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ================= CONFIRM MODAL ================= */
type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: React.ReactNode;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmIcon,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">
        {confirmIcon && <div className="flex justify-center">{confirmIcon}</div>}
        <p className="text-base font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-center gap-2">
          <Button variant="destructive" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="default" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= SUCCESS MODAL ================= */
type SuccessModalProps = {
  open: boolean;
  onClose?: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
  autoClose?: number;
};

export function SuccessModal({
  open,
  onClose,
  title,
  message,
  icon,
  autoClose = 2000,
}: SuccessModalProps) {
  if (!open) return null;

  if (autoClose && onClose) {
    setTimeout(() => {
      onClose();
    }, autoClose);
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">
        {icon ?? <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />}
        <p className="text-base font-medium text-green-600">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/* ================= ERROR MODAL ================= */
type ErrorModalProps = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  autoClose?: number;
};

export function ErrorModal({
  open,
  onClose,
  title = "Gagal",
  message,
  icon,
  autoClose = 3000,
}: ErrorModalProps) {
  if (!open) return null;

  if (autoClose && onClose) {
    setTimeout(() => {
      onClose();
    }, autoClose);
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-lg">
        {icon ?? <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />}
        <p className="text-base font-medium text-red-600">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onClose && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={onClose}>Tutup</Button>
          </div>
        )}
      </div>
    </div>
  );
}
