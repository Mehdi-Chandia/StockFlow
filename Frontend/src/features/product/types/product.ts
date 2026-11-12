

export type IProductImage={
    url: string,
    publicId: string
}

export type ProductStatus = "ACTIVE" | "INACTIVE";


export interface IProduct{
    _id?: string,
    name: string,
    category: string,
    sku: string,
    purchasePrice: number,
    sellPrice: number,
    minQty: number,
    maxQty: number,
    image: IProductImage,
    description?: string,
    brand: string,
    status: ProductStatus,
    createdBy: string,
    createdAt?: Date,
    updatedAt?: Date

}

export interface ICreateProduct{
    name: string,
    description: string,
    brand: string,
    category: string,
    purchasePrice: number,
    sellPrice: number,
    minQty: number,
    maxQty: number,
    productImage: string
}
