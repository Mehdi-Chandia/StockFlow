import { z} from "zod"

export const orderValidationSchema=z.object({
  customerName: z.string(),
  customerPhone: z.string(),
  warehouseId: z.string(),
  discount: z.number().positive()
    
})


