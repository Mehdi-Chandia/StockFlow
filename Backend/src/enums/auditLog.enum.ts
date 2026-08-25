export enum AuditAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    BLOCK = "BLOCK",
    UNBLOCK = "UNBLOCK",
    CANCEL = "CANCEL",
}

export enum AuditEntityType {
    USER = "USER",
    PRODUCT = "PRODUCT",
    WAREHOUSE = "WAREHOUSE",
    INVENTORY = "INVENTORY",
    ORDER = "ORDER",
    INVOICE = "INVOICE",
    STOCK_MOVEMENT = "STOCK_MOVEMENT",
}