import api from "../../../services/api";

export const getWareHouses= async()=>{
    const response=await api.get("/warehouse/all")
    console.log(response.data);
    
    return response.data.data;
}