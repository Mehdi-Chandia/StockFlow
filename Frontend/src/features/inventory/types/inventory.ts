
export interface InventoryFilters{
    search: string,
    status: string
}

export type InventoryStatus= "ACTIVE" | "INACTIVE"

export type AdjustmentType = "IN" | "OUT" | "TRANSFER";

export interface IInventory{
    _id?: string,
    productId: string,
    warehouseId: string,
    quantity: number,
    reorderlevel: number,
    status: InventoryStatus,
    createdAt?: Date,
    updatedAt?: Date
}

export interface InventoryPagination{
    totalRecords: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}

export interface IInventoryWithAggregation {
  _id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reorderlevel: number;
  status: InventoryStatus;

  productDetails: {
    _id: string;
    name: string;
    sku: string;
    category: string;
  };

  warehouseDetails: {
    _id: string;
    name: string;
    city: string;
    code: string;
  };
}


export enum StockMovementReason {
    PURCHASE = "PURCHASE",
    SALE = "SALE",
    TRANSFER = "TRANSFER",
    ADJUSTMENT = "ADJUSTMENT",
    RETURN = "RETURN",
    DAMAGE = "DAMAGE",
    LOSS = "LOSS"
}
