
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
    title: string;
    message: string;
    itemName?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: "danger" | "success" | "warning";
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmationModal = ({
    title,
    message,
    itemName,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    variant = "warning",
    onConfirm,
    onClose
}: ConfirmationModalProps) => {

    const styles = {
        danger: {
            icon: "bg-red-500/10 text-red-400",
            button: "bg-red-500 hover:bg-red-600"
        },
        success: {
            icon: "bg-emerald-500/10 text-emerald-400",
            button: "bg-emerald-500 hover:bg-emerald-600"
        },
        warning: {
            icon: "bg-amber-500/10 text-amber-400",
            button: "bg-amber-500 hover:bg-amber-600"
        }
    };

    const currentStyle = styles[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-xl border border-[#2A3036] bg-[#111B25] p-6 shadow-xl">

                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStyle.icon}`}>
                            <AlertTriangle size={20} />
                        </div>

                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-slate-400 transition hover:text-white disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-3 text-sm text-slate-300">
                    {message}
                </p>

                {itemName && (
                    <div className="mb-6 rounded-lg border border-[#25313D] bg-[#0B1118] p-4">
                        <p className="break-words text-sm font-medium text-white">
                            {itemName}
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-[#2A3036] px-4 py-2 text-sm text-slate-300 transition hover:bg-[#25313D] disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${currentStyle.button}`}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;
