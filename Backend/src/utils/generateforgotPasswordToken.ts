import crypto from "crypto"

export function generateForgotPasswordToken() {
    const rawToken= crypto.randomBytes(32).toString("hex")

    const hashToken= crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")

    return hashToken;
}