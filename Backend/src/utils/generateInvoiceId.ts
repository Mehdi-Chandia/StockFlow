
export function generateInvoiceId(){
    const date= Date.now()

    return `INV-${date}`
}