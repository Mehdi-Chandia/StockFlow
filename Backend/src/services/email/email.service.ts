import dotenv from "dotenv"
dotenv.config();

import { BrevoClient } from "@getbrevo/brevo";

const brevo=new BrevoClient({
    apiKey:process.env.BREVO_API_KEY!
})

interface SendEmailOptions{
    to: string,
    subject: string,
    html: string
}

export async function sendEmail({to, subject, html}: SendEmailOptions): Promise<void>{
    try {
        const response=await brevo.transactionalEmails.sendTransacEmail({
            subject:subject,
            htmlContent:html,

            sender:{
                 name: "StockFlow", email: process.env.EMAIL!
            },
            to:[
                {email:to}
            ]
        })

        // return response;
    } catch (error: unknown) {
        console.error("Error sending email:", error);
        throw error
        
    }
}