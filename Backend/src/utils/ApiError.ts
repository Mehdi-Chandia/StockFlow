


class ApiError extends Error{
    statusCode: number;
    message: string;
    success: boolean

    constructor(statusCode:number, message:string){
        super(message)

        this.statusCode=statusCode;
        this.message=message || "something went wrong"
        this.success=false
    }
}

export default ApiError;