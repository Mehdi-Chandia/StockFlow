import crypto from 'crypto'

export function generateTempPassword() {
    const tempPassword = crypto.randomBytes(8).toString('hex')

    const hashPassword= crypto.createHash("sha256").update(tempPassword).digest("hex")

    return hashPassword;
}