import api from "../../../services/api";
import type { CreateWareHouseFormData, EditWareHouseFormData } from "../schemas/wareHouseSchema";
import type { ICreateWareHouse, WareHouseFilters, WarehouseI, WareHousePagination } from "../types/warehouse";

export interface WareHouseResponse{
    data: WarehouseI,
    pagination: WareHousePagination
}

// get all warehouses handler
export const getWareHouses= async(page:number, limit: number, filters: WareHouseFilters):
Promise<WareHouseResponse>=>{
    const response=await api.get("/warehouse/all",{
        params:{
            page,
            limit,
            search: filters.search || undefined,
            status: filters.status || undefined
        }
    })
    console.log(response.data.data);
    
    return response.data.data;
}

// list warehouses without any user querys
export const listWareHouses= async():
Promise<WareHouseResponse>=>{
    const response=await api.get("/warehouse/all",{
        params:{
            page: 1,
            limit: 50
        }
    })
    console.log(response.data.data);
    
    return response.data.data;
}

// get single warehouse
export const getWareHouse= async (wareHouseId: string)=>{
    const response= await api.get(`/warehouse/${wareHouseId}`)

    return response.data;
}

// update status handler
export const updateWarehouseStatus= async (status: string, wareHouseId: string)=>{
    const response= await api.patch(`/warehouse/${wareHouseId}/status`, {status})

    return response.data;
}

// create warehouse handler
export const createWarehouse= async (data: CreateWareHouseFormData)=>{
    const response = await api.post("/warehouse/create", data)
    console.log(response);
    
    return response.data;
}

// edit/update warehouse
export const editWarehouse= async (wareHouseId: string, data: EditWareHouseFormData)=>{
    const response= await api.patch(`/warehouse/${wareHouseId}/update`, data)

    return response.data;
}