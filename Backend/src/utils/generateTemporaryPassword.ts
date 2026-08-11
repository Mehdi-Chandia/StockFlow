import crypto from "crypto";

export function generateTempPassword() {
    const tempPassword = crypto.randomBytes(8).toString("hex");

    return tempPassword;
}