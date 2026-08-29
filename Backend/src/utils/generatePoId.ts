

export function generatePOID(){
    const date= Date.now();

    return `POID-${date}`
}