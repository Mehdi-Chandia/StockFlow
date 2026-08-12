
let cityCodes : Record<string, string>={
    Lahore: "LHR",
    Multan: "MUL",
    Karachi: "KAR",
    Islamabad: "ISB"

}

export function generateWHcode(city: string) {

    let code  = cityCodes[city];
    if (!code) {
        throw new Error("invalid city name")
    }

    return `SF-${code}`
    
}