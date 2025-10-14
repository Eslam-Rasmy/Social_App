import z from "zod"
import { GenderEnum } from "../../Common/index.js"


export const SignUpValidator ={
    body:z.strictObject({
        firstName: z.string().min(3).max(10),
        lastName: z.string().min(3).max(10),
        email:z.email(),
        password:z.string(),
        gender:z.enum(GenderEnum),
        DOB:z.date().optional(),
        phoneNumber:z.string().min(11).max(11),
        age:z.number().min(18).max(60) 
    })
}