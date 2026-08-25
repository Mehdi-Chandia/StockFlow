
interface PaginationOptions {
    Page?: string | undefined;
    Limit?: string | undefined;
}

export function pagination({Page, Limit}: PaginationOptions){
    const page= Math.max(Number(Page)  || 1, 1)
    const limit= Math.min(Math.max(Number(Limit) || 10, 1), 100)

    const skip= (page - 1)* limit;

    return{
        page,
        limit,
        skip
    }
}