
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createWarehouse } from "../services/warehouseService";
import {
  createWHSchema,
  type CreateWareHouseFormData,
} from "../schemas/wareHouseSchema";

const CreateWareHousePage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWareHouseFormData>({
    resolver: zodResolver(createWHSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      manager: "",
    },
  });

  const handleCreateWarehouse = async (
    data: CreateWareHouseFormData
  ) => {
    try {
        
      const response = await createWarehouse(data);


      toast.success(
        response.message || "Warehouse created successfully"
      );

      reset();
      navigate("/warehouse");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to create warehouse"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const inputClass =
    "w-full bg-[#0B1118] border border-[#2A3036] rounded-lg px-4 py-3 text-white outline-none focus:border-[#22D3EE] transition-colors";

  const labelClass = "block text-sm text-[#CBD5E1] mb-2";

  const errorClass = "text-xs text-red-400 mt-1";

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-[#94A3B8] hover:text-[#22D3EE] mb-3"
        >
          ← Back to Warehouses
        </button>

        <h1 className="text-2xl font-semibold text-white">
          Create Warehouse
        </h1>

        <p className="text-sm text-[#94A3B8] mt-1">
          Add a new warehouse to your inventory system.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleCreateWarehouse)}
        className="bg-[#111B25] border border-[#25313D] rounded-xl p-5 sm:p-7 space-y-6"
      >
        <div className="pb-5 border-b border-[#25313D]">
          <h2 className="text-lg font-semibold text-white">
            Warehouse Information
          </h2>

          <p className="text-sm text-[#94A3B8] mt-1">
            Enter the warehouse details below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className={labelClass}>Warehouse Name</label>
            <input
              type="text"
              placeholder="Enter warehouse name"
              {...register("name")}
              className={inputClass}
            />
            {errors.name && (
              <p className={errorClass}>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="text"
              placeholder="Enter phone number"
              {...register("phone")}
              className={inputClass}
            />
            {errors.phone && (
              <p className={errorClass}>{errors.phone.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              placeholder="Enter city"
              {...register("city")}
              className={inputClass}
            />
            {errors.city && (
              <p className={errorClass}>{errors.city.message}</p>
            )}
          </div>

          {/* Manager */}
          <div>
            <label className={labelClass}>Manager</label>
            <input
              type="text"
              placeholder="Enter manager name"
              {...register("manager")}
              className={inputClass}
            />
            {errors.manager && (
              <p className={errorClass}>{errors.manager.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Address</label>
            <textarea
              rows={4}
              placeholder="Enter warehouse address"
              {...register("address")}
              className={`${inputClass} resize-none`}
            />
            {errors.address && (
              <p className={errorClass}>{errors.address.message}</p>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-[#25313D]">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-[#2A3036] text-[#CBD5E1] hover:bg-[#25313D] transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-[#22D3EE] text-[#111315] font-semibold hover:bg-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Warehouse"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default CreateWareHousePage;
