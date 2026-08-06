

class ApiResponse{
    constructor(data:unknown, status, message:string,){
        this.message=message,
        this.data=data,
        this.status=status,
        this.success= status < 400
    }
}

export default ApiResponse;