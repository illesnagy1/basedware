import { fail } from "@sveltejs/kit";
import zxcvbn from "zxcvbn";
import { env } from "$env/dynamic/private";



export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = (data.get("JID") as string)?.toLowerCase().trim();
		const password = data.get("password") as string;
        const token = data.get("token") as string;
		
		if(!username) return fail(400, { error: "JID cannot be empty. Try again."})
		if(!password) return fail(400, { error: "The password cannot be empty. Try again."})
		if(!token) return fail(400, { error: "You must provide a token. Try again."})

		if (!validateJID(username)) {
			return fail(400, { error: "The provided JID is not valid. Try again." });
		}

		if (zxcvbn(password, [username]).score < 3) {
			return fail(400, { error: "The provided password is not strong enough. Try again." });
		}

		try {
			// const prosody_response = await fetch(`${env.PROSODY_HOST}/register_api/register`, {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		username: username,
			// 		password: password,
			// 		token: token
			// 	}),
			// });
			
			// if (prosody_response.status == 404) {
			// 	return fail(400, { error: "The provided token is not valid or expired. Try again." });
			// } else if (prosody_response.status == 409) {
			// 	return fail(400, { error: "The provided JID is already registered. Try again." });
			// } else if (prosody_response.status == 500) {
			// 	return fail(500, { error: "An internal server error occurred. Try again later." });
			// }

			return { success: true };

		} catch (error) {
			return fail(500, { error: "An internal server error occurred. Try again later." });
		}

	},
}; 

function validateJID(username: string): boolean {
	const jidRegex = /^[^"&'/:<>@\s\x00-\x1F\x7F]{1,1023}?$/;
    return jidRegex.test(username);
}
