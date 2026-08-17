enum StockMovementReason {
    PURCHASE = "PURCHASE",
    SALE = "SALE",
    TRANSFER = "TRANSFER",
    ADJUSTMENT = "ADJUSTMENT",
    RETURN = "RETURN",
    DAMAGE = "DAMAGE",
    LOSS = "LOSS"
}

enum StockMovementType {
    IN = "IN",
    OUT = "OUT",
    TRANSFER = "TRANSFER"
}

enum StockMovementRefrenceType{
    PURCHASE= "PURCHASE",
    ORDER= "ORDER",
    TRANSFER= "TRANSFER",
    ADJUSTMENT= "ADJUSTMENT",
    RETURN= "RETURN"
}
export {
    StockMovementType,
    StockMovementReason,
    StockMovementRefrenceType
}