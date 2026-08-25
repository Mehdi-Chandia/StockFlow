import type mongoose from "mongoose";
import type { IInvoice } from "../../models/invoice.model.js";
import Invoice from "../../models/invoice.model.js";

async function createInvoice(data:IInvoice, session:mongoose.ClientSession){
    if (!data) {
        throw new Error("data is not provided")
    }

    const newInvoice= await Invoice.create([{
        orderId: data.orderId,
        invoiceId: data.invoiceId,
        customerName: data.customerName,
        ...(data.customerPhone && {
            customerPhone: data.customerPhone
        }),
        warehouseId: data.warehouseId,
        items: data.items,
        subtotal: data.subtotal,
        discount: data.discount,
        total: data.total,
        issuedBy: data.issuedBy
    }],{session})

    if (!newInvoice[0]) {
        throw new Error("error while creating invoice")
    }

    console.log("invoice created successfully!");

    return newInvoice[0];
    
}

export default createInvoice;