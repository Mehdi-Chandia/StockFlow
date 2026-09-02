
const categoryCodes: Record<string, string> ={
    ELECTRONICS: "ELC",
    FURNITURE : "FUR",
    TOOLS: "TL",
    HARDWARE: "HRW",
    ELECTRICAL: 'ELEC'

}


export function generateProductSku(category: string){

    const code= categoryCodes[category.toLowerCase()]
    if (code) {
        return `SKU-${code}`
    }else{
        return `SKU-OTH`
    }
}