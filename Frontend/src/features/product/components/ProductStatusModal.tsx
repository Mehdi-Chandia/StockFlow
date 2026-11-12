
interface ProductStatusModalProps {
  productName: string;
  status: "ACTIVE" | "INACTIVE";
  onConfirm: () => void;
  onCancel: () => void;
}

const ProductStatusModal = ({
  productName,
  status,
  onConfirm,
  onCancel,
}: ProductStatusModalProps) => {
  const isActivating = status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#2A3036] bg-[#111B25] p-6">
        <h2 className="text-xl font-semibold text-white">
          {isActivating ? "Activate product?" : "Deactivate product?"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Are you sure you want to{" "}
          {isActivating ? "activate" : "deactivate"}{" "}
          <span className="font-medium text-white">{productName}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#2A3036] px-4 py-2 text-sm text-slate-300 hover:bg-[#1A252F]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
              isActivating
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-amber-600 hover:bg-amber-500"
            }`}
          >
            {isActivating ? "Yes, Activate" : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductStatusModal;
