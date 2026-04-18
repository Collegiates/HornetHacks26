import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { cn } from "../lib/cn";

interface ModalProps extends PropsWithChildren {
  title: string;
  onClose: () => void;
  className?: string;
  disableClose?: boolean;
}

export function Modal({
  title,
  onClose,
  className,
  children,
  disableClose = false,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <div
        className={cn(
          "surface-card max-h-[92vh] w-full overflow-y-auto rounded-b-none p-5 sm:max-w-2xl sm:rounded-4xl sm:p-6",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-seafoam-500">
              PictureMe
            </p>
            <h2 className="text-2xl text-ink">{title}</h2>
          </div>
          <button
            type="button"
            className="ghost-button h-10 w-10 rounded-full"
            onClick={onClose}
            aria-label="Close modal"
            disabled={disableClose}
          >
            <X className="mx-auto h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
