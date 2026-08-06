

export function generateEmpID() {
    let id = Date.now().toString().slice(-4)
    let prefix ='EMP-'

    let empId=prefix+id;

    return empId;
}