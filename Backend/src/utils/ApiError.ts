
type ValidationErrors = Record<string, string>;

class ApiError extends Error{
    statusCode: number;
    message: string;
    errors?: ValidationErrors | undefined;
    success: boolean

    constructor(statusCode:number, message:string, errors?: ValidationErrors){
        super(message)

        this.statusCode=statusCode;
        this.message=message || "something went wrong"
        this.errors= errors
        this.success=false
    }
}

export default ApiError;