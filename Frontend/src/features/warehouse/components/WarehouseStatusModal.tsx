
import {
  Warehouse,
  Power,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { WareHouseStatus } from "../types/warehouse";

interface WarehouseStatusModalProps {
  warehouseName: string;
  status: WareHouseStatus;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarehouseStatusModal = ({
  warehouseName,
  status,
  onConfirm,
  onCancel,
}: WarehouseStatusModalProps) => {
  const isActivating = status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-md bg-[#111B25] border border-[#2A3947] rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent */}
        <div
          className={`h-1 w-full ${
            isActivating ? "bg-[#22D3EE]" : "bg-amber-500"
          }`}
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={19} />
        </button>

        <div className="p-6 sm:p-7">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className={`relative flex items-center justify-center h-20 w-20 rounded-2xl border ${
                isActivating
                  ? "bg-[#22D3EE]/10 border-[#22D3EE]/20"
                  : "bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <Warehouse
                size={34}
                className={
                  isActivating ? "text-[#22D3EE]" : "text-amber-400"
                }
              />

              <span
                className={`absolute -right-2 -bottom-2 rounded-full p-1.5 border-4 border-[#111B25] ${
                  isActivating ? "bg-[#22D3EE]" : "bg-amber-500"
                }`}
              >
                <Power size={13} className="text-[#0B1118]" />
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#F1F5F9]">
              {isActivating ? "Activate Warehouse?" : "Deactivate Warehouse?"}
            </h2>

            <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
              Are you sure you want to{" "}
              <span
                className={
                  isActivating ? "text-[#22D3EE]" : "text-amber-400"
                }
              >
                {isActivating ? "activate" : "deactivate"}
              </span>{" "}
              this warehouse?
            </p>
          </div>

          {/* Warehouse details */}
          <div className="mt-6 bg-[#0B1118] border border-[#25313D] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#1B2935]">
                <Warehouse size={19} className="text-[#94A3B8]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-[#64748B]">
                  Selected Warehouse
                </p>
                <p className="text-sm font-medium text-[#F1F5F9] truncate mt-1">
                  {warehouseName}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  isActivating
                    ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 mt-5 text-xs text-[#94A3B8] leading-relaxed">
            {isActivating ? (
              <CheckCircle2
                size={17}
                className="text-[#22D3EE] shrink-0 mt-0.5"
              />
            ) : (
              <AlertTriangle
                size={17}
                className="text-amber-400 shrink-0 mt-0.5"
              />
            )}

            <p>
              {isActivating
                ? "This warehouse will become active and available for operations."
                : "This warehouse will be marked inactive. Make sure no ongoing operations depend on it."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-7">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-[#334155] text-[#CBD5E1] text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActivating
                  ? "bg-[#22D3EE] text-[#0B1118] hover:bg-[#06B6D4]"
                  : "bg-amber-500 text-[#111315] hover:bg-amber-400"
              }`}
            >
              {isActivating ? "Yes, Activate" : "Yes, Deactivate"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WarehouseStatusModal;
