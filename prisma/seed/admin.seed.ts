import { bcryptPasswordHash } from "@/lib/bcrypt";
import { PrismaClient } from "@prisma/client";

export async function seedAdmin(prisma:PrismaClient){
    const password = await bcryptPasswordHash("abc123#");

    const admin = await  prisma.user.create({
        data:{
            email:"sankalp.develop@gmail.com",
            hashedPassword:password,
        }
    })
    console.log("ADmin created: ",admin)
    return admin;
}