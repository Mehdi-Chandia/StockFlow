import api from "../../../services/api";
import type { ICreateProduct, IProduct } from "../types/product";

export interface ProductFilters{
    search: string,
    category: string,
    status: string
}

export interface ProductPagination{
    totalRecords: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}

export interface ProductResponse{
    pagination: ProductPagination,
    products: IProduct
}

export interface IEditProduct{
    name?: string,
    category?: string,
    purchasePrice?: number,
    sellPrice?: number,
    minQty?: number,
    maxQty?: number,
    description?: string,
    brand?: string
}

// list products handler
export const getProducts= async (page: number, limit: number, filters: ProductFilters):
 Promise<ProductResponse>=>{
    const response= await api.get("/products/list",{
        params: {
      page,
      limit,
      search: filters.search || undefined,
      category: filters.category || undefined,
      status: filters.status || undefined,
    },
    })

    return response.data.data;
}

// list products without any user querys
export const listProducts= async ():
 Promise<ProductResponse>=>{
    const response= await api.get("/products/list",{
        params: {
      page: 1,
      limit: 50
    },
 })

    return response.data.data;
}

// get single product handler
export const getProduct= async (productId: string)=>{
    const response= await api.get(`/products/${productId}`)

    return response.data;
}

// update status of product
export const updateProductStatus= async (status: string, productId: string)=>{
    const response= await api.patch(`/products/${productId}/status`, {status})

    return response.data;
}

// edit product handler
export const editProduct=async (productId: string, data: IEditProduct)=>{
    const response= await api.patch(`/products/${productId}`, data)

    return response?.data;
}

// create product handlerr
export const createProduct=async (data: FormData)=>{
    const response= await api.post("/products/create", data)

    return response?.data;
}
