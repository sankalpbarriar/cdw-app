"use server";

import { signIn } from "@/auth";
import { routes } from "@/config/routes";
import type { PrevState } from "@/config/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SignInSchema } from "../schemas/auth.schema";

export const signInAction = async (_: PrevState, formData: FormData) => {
	try {
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const { data, success, error } = SignInSchema.safeParse({
			email,
			password,
		});

		if (!success) {
			console.log({ error });
			return { success: false, message: "Invalid Credentials" };
		}

		await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: true,
			redirectTo: routes.challenge,
		});

		return {
			success: true,
			message: "Signed in successfully!",
		};
	} catch (error) {
		if (isRedirectError(error)) throw error; 
		console.log({ error });
		return { success: false, message: "Invalid Credentials" };
	}
};
