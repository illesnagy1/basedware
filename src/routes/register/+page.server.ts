import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { env } from "$env/dynamic/private";
import { dev } from "$app/environment";
import { registerSchema } from "./schema";

export const load = async ({ url }) => {
	const token = url.searchParams.get("t");
	const form = await superValidate(token ? { token } : undefined, zod4(registerSchema), {
		errors: false
	});
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (dev) {
			return message(form, "Registered successfully.");
		}

		try {
			const prosody_response = await fetch(`${env.PROSODY_HOST}/register_api/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: form.data.JID,
					password: form.data.password,
					token: form.data.token
				}),
			});

			if (prosody_response.status == 404) {
				return message(form, "The provided token is not valid or expired. Try again.", { status: 400 });
			} else if (prosody_response.status == 409) {
				return message(form, "The provided JID is already registered. Try again.", { status: 400 });
			} else if (prosody_response.status == 500) {
				return message(form, "An internal server error occurred. Try again later.", { status: 500 });
			}

			return message(form, "Registered successfully.");

		} catch (error) {
			return message(form, "An internal server error occurred. Try again later.", { status: 500 });
		}

	},
};
