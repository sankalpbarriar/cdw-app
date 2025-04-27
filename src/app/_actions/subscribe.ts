"use server";

import { prisma } from "@/lib/prisma";
import { CustomerStatus } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { z } from "zod";
import { SubscribeSchema } from "../schemas/subscibe-schema";


export const subscribeAction = async (_: any, formdData: FormData) => {
  try {
    const { data, success, error } = SubscribeSchema.safeParse({
      firstName: formdData.get("firstName") as string,
      lastName: formdData.get("lastName") as string,
      email: formdData.get("email") as string,
    });

    if (!success)
      return {
        success: false,
        message: error.message,
      };

    const subscriber = await prisma.customer.findFirst({
      where: {
        email: data.email,
      },
    });
    if (subscriber) {
      return {
        success: false,
        message: "Your are already subscibed",
      };
    }

    //create one
    await prisma.customer.create({
      data: {
        ...data,
        status: CustomerStatus.SUBSCRIBER,
      },
    });
    return { success: true, message: "subscribed successfully" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
      };
    }
    if (error instanceof PrismaClientValidationError) {
      return {
        success: false,
        message: "something went wrong",
      };
    }
  }
};
