import nodemailer from "nodemailer"
import { EventEmitter } from "node:events"
import type { IEmailArgument } from "../../Common/index.js"


export const sendingEmail = async ({
    to,
    cc = "e.a.eid@xed.aucegypt.edu",
    subject,
    content,
    attachments = []

}:IEmailArgument
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user:process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
        },
    })

    const info = await transporter.sendMail({
        from: "eslamrasme@gmail.com",
        to,
        cc,
        subject,
        html: content,
        attachments,        
    })
    return info
}

export const localEmitter = new EventEmitter()

localEmitter.on("sendEmail",(args:IEmailArgument)=>{
    sendingEmail(args)
})