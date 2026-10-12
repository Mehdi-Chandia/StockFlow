import api from "../../../services/api";
import type { createUserData } from "../schemas/createUserSchema";

export const createUser=async (data: createUserData)=>{
    const response= await api.post("/auth/create", data)

    return response.data;
}
