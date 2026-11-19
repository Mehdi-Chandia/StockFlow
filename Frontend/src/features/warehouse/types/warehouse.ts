export interface WarehouseI{
    _id?: string,
    name: string,
    code: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    status:WareHouseStatus,
    manager: string,
    createdBy: string,
    createdAt?: Date,
    updatedAt?: Date
}



export type WareHouseStatus= "ACTIVE" | "INACTIVE"


export interface ICreateWareHouse{
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    manager: string
}

export interface WareHouseFilters{
    search: string,
    status: string
}

export interface WareHousePagination{
    totalRecords: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}