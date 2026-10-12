import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  UserRole,
  type createUserData,
} from "../schemas/createUserSchema";
import { Layers, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getWareHouses } from "../../warehouse/services/warehouseService";
import type { WarehouseI } from "../../warehouse/types/warehouse";
import axios from "axios";
import { createUser } from "../services/createUserService";

const CreateUserPage = () => {
  const [warehouses, setWarehouses] = useState<WarehouseI[]>([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: createUserData) => {
    setIsLoading(true);
    try {
      const response = await createUser(data);
      console.log(response);
      alert("new user created successfully!")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWareHouses();
        console.log("warehouse data ", data.data);

        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setIsLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111315] px-4">
      {/* Logo */}
      <div className="flex gap-2 items-center mb-8">
        <Layers size={22} className="text-[#22D3EE]" />

        <h3 className="text-[#22D3EE] text-2xl font-bold">
          <span className="text-white">Stock</span> Flow
        </h3>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1B1F23] border border-[#2A3036] rounded-xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h4 className="text-[#F3F4F6] text-2xl font-semibold">
            Hello Mr.Admin!
          </h4>

          <p className="text-[#71717A] text-sm mt-2">
            Add new EMPs to StockFlow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* firstName */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#CBD5E1] text-sm">FirstName</label>

            <input
              {...register("firstName")}
              type={"text"}
              placeholder="Enter the firstName"
              className="w-full relative bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />

            {errors.firstName && (
              <p className="text-red-400 text-xs">
                {" "}
                {errors.firstName.message}{" "}
              </p>
            )}
          </div>

          {/* lastName */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#CBD5E1] text-sm">lastName</label>

            <input
              {...register("lastName")}
              type={"text"}
              placeholder="Enter the lastName"
              className="w-full relative bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />

            {errors.lastName && (
              <p className="text-red-400 text-xs">
                {" "}
                {errors.lastName.message}{" "}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[#CBD5E1] text-sm">Email</label>

            <input
              {...register("email")}
              type="email"
              placeholder="Enter the email"
              className="w-full bg-[#16191C] border border-[#2A3036]
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none
              focus:border-[#22D3EE]
              focus:ring-2 focus:ring-[#22D3EE]/20
              transition"
            />
            {errors.email && (
              <p className="text-red-400 text-xs"> {errors.email.message} </p>
            )}
          </div>

          {/* role */}
          <div className="flex flex-col gap-2">
            <label className="text-[#CBD5E1] text-sm">Select a Role</label>

            <select
            {...register('role')}
              className="w-full bg-[#16191C] border border-[#2A3036] 
              text-[#F3F4F6] placeholder:text-[#71717A]
              rounded-lg px-4 py-3
              outline-none"
            >
              <option value="" disabled>
                Select a role
              </option>

              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>

            {errors.role && (
              <p className="text-red-400 text-xs">{errors.role.message}</p>
            )}
          </div>

          {/* warehouse */}
          <div className="flex flex-col gap-2">
            <label className="text-[#CBD5E1] text-sm">Select Warehouse</label>

            <select
              {...register("warehouse")}
              defaultValue=""
              disabled={isLoadingWarehouses}
              className="w-full bg-[#16191C] border border-[#2A3036]
    text-[#F3F4F6] rounded-lg px-4 py-3 outline-none"
            >
              <option value="" disabled>
                {isLoadingWarehouses
                  ? "Loading warehouses..."
                  : "Select a warehouse"}
              </option>

              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name} — {warehouse.code}
                </option>
              ))}
            </select>

            {errors.warehouse && (
              <p className="text-red-400 text-xs">{errors.warehouse.message}</p>
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0891B2] hover:bg-[#0E7490] disabled:cursor-not-allowed
            text-white font-medium py-3 rounded-lg
            transition-colors"
          >
            {isLoading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-[#52525B] text-xs mt-6">
        © 2026 StockFlow. All rights reserved.
      </p>
    </div>
  );
};

export default CreateUserPage;
