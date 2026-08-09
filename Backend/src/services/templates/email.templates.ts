

export function welcomeEmailTemplate({
    firstName,
    email,
    empID,
    temporaryPassword,
}: {
    firstName: string;
    email: string;
    empID: string;
    temporaryPassword: string;
}) {
    return `
        <h2>Welcome to StockFlow</h2>

        <p>Hello ${firstName},</p>

        <p>Your StockFlow account has been created.</p>

        <p><strong>Employee ID:</strong> ${empID}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>

        <p>
            Please log in using these credentials and change your
            temporary password when prompted.
        </p>

        <p>Regards,<br>StockFlow Admin</p>
    `;
}


export function otpEmailTemplate({
    firstName,
    otp,
}: {
    firstName: string;
    otp: string;
}) {
    return `
        <h2>StockFlow Login Verification</h2>

        <p>Hello ${firstName},</p>

        <p>Your verification code is:</p>

        <h1>${otp}</h1>

        <p>This code will expire in 5 minutes.</p>

        <p>If you did not try to log in, please contact the administrator.</p>

        <p>Regards,<br>StockFlow</p>
    `;
}

export function resetPasswordTemplate(resetLink: string){
    return `

       <h2>StockFlow Password Reset Link!</h2>

       <p>Your Reset Link</p>

       <a href="${resetLink}">Click here to reset your password</a>
    
        <p>This link will expire in 10 minutes.</p>

        <p>If you did not request this, please contact the administrator.</p>

        <p>Regards,<br>StockFlow</p>
    `
}

