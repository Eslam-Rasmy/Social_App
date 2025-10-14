import type z from "zod";
import type { SignUpValidator } from "../../Validators/User/auth.validators.js";



export type SignUpBodyType = z.infer<typeof SignUpValidator.body>