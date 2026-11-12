
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductFormData,
} from "../schemas/productSchema";
import { useState } from "react";
import { createProduct } from "../services/productService";
import axios from "axios";
import { toast } from "react-toastify";

const categories = [
  "ELECTRONICS",
  "FURNITURE",
  "TOOLS",
  "HARDWARE",
  "ELECTRICAL",
];

const CreateProductPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      purchasePrice: 0,
      sellPrice: 0,
      minQty: 0,
      maxQty: 0,
      description: "",
    },
  });

  // Add your API call here.
  const onSubmit = async (data: CreateProductFormData) => {
    if (!image) {
      alert("Please select a product image");
      return;
    }
    try {
           const formData= new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("brand", data.brand)
    formData.append("maxQty", String(data.maxQty))
    formData.append("minQty", String(data.minQty))
    formData.append("purchasePrice", String(data.purchasePrice))
    formData.append("sellPrice", String(data.sellPrice))
    formData.append("productImage", image)


    await createProduct(formData)
    toast.success("product created successfully!")
    reset();
    setImage(null);
    setPreview(null);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("error on create product page ", error.response?.data); 
            toast.error(error.response?.data)  
        }
    }
  };

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#111315] p-6 text-white">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Product</h1>
        <p className="mt-1 text-sm text-slate-400">
          Add a new product to your inventory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* Product Information */}
        <section className="rounded-xl border border-[#2A3036] bg-[#111B25] p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm">Product Name</label>
              <input
                {...register("name")}
                placeholder="Enter product name"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm">Category</label>
              <select
                {...register("category")}
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="mb-2 block text-sm">Brand</label>
              <input
                {...register("brand")}
                placeholder="Enter brand"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.brand.message}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Pricing and Stock */}
        <section className="rounded-xl border border-[#2A3036] bg-[#111B25] p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Pricing & Stock Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm">Purchase Price</label>
              <input
                type="number"
                step="any"
                {...register("purchasePrice", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.purchasePrice && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm">Selling Price</label>
              <input
                type="number"
                step="any"
                {...register("sellPrice", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.sellPrice && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.sellPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm">Minimum Quantity</label>
              <input
                type="number"
                {...register("minQty", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.minQty && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.minQty.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm">Maximum Quantity</label>
              <input
                type="number"
                {...register("maxQty", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
              />
              {errors.maxQty && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.maxQty.message}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Product Image */}
        <section className="rounded-xl border border-[#2A3036] bg-[#111B25] p-6">
          <h2 className="mb-4 text-lg font-semibold">Product Image</h2>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
            className="w-full text-sm text-slate-400"
          />

          {preview && (
            <img
              src={preview}
              alt="Product preview"
              className="mt-4 h-40 w-40 rounded-lg border border-[#2A3036] object-cover"
            />
          )}
        </section>

        {/* Description */}
        <section className="rounded-xl border border-[#2A3036] bg-[#111B25] p-6">
          <h2 className="mb-4 text-lg font-semibold">Description</h2>

          <textarea
            {...register("description")}
            rows={4}
            placeholder="Enter product description"
            className="w-full resize-none rounded-lg border border-[#2A3036] bg-[#0B1118] p-3 outline-none focus:border-[#22D3EE]"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setImage(null);
              setPreview(null);
            }}
            className="rounded-lg border border-[#2A3036] px-5 py-2.5 text-sm text-slate-300 hover:bg-[#1A2733]"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#22D3EE] px-5 py-2.5 text-sm font-semibold text-[#111315] hover:bg-cyan-300 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateProductPage;
