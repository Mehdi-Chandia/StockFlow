import rateLimit from "express-rate-limit";

export const globalRateLimiter= rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message:{
        success: false,
        message: "Too many requests, please try again later."
    }
})

export const loginRateLimiter= rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message:{
        success: false,
        message: "Too many requests, please try again later."
    }
})

export const otpRateLimiter= rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message:{
        success: false,
        message: "Too many requests, please try again later."
    }
})

export const resetPasswordRateLimiter= rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message:{
        success: false,
        message: "Too many requests, please try again later."
    }
})

