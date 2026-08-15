
const categoryCodes: Record<string, string> ={
    electronics: "ELC",
    furniture : "FUR",
    tools: "TL",
    hardware: "HRW",
    electrical: 'ELEC'

}

export function generateProductSku(category: string){

    const code= categoryCodes[category.toLowerCase()]
    if (code) {
        return `SKU-${code}`
    }else{
        return `SKU-OTH`
    }
}