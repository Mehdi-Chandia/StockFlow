

 class ApiResponse<T> {
    statusCode: number;
    message: string;
    data:T;
    success:boolean;

    constructor( statusCode: number, message: string ="success", data:T){
        this.message=message
        this.statusCode=statusCode
        this.data=data 
        this.success= statusCode < 400;
    }

}

export default ApiResponse;