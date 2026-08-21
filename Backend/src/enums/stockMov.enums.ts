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

enum StockMovementReferenceType{
    PURCHASE= "PURCHASE",
    ORDER= "ORDER",
    TRANSFER= "TRANSFER",
    ADJUSTMENT= "ADJUSTMENT",
    RETURN= "RETURN"
}
export {
    StockMovementType,
    StockMovementReason,
    StockMovementReferenceType
}