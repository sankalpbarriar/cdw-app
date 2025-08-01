//fully edge compatible database
import { PrismaClient } from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";
//creating a prisma that will be used to query the database all over the project
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function makeClient() {
  return new PrismaClient().$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma || makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
