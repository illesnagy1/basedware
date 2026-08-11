import { fail } from "@sveltejs/kit";
import zxcvbn from "zxcvbn";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const jid = data.get("JID") as string;
		const password = data.get("password") as string;
        const token = data.get("token") as string;
		
		if(!jid) return fail(400, { error: "JID cannot be empty. Try again."})
		if(!password) return fail(400, { error: "The password cannot be empty. Try again."})
		if(!token) return fail(400, { error: "You must provide a valid token. Try again."})

		if (!validateJID(jid)) {
			return fail(400, { error: "The provided JID is not valid. Try again." });
		}

		if (zxcvbn(password).score < 3) {
			return fail(400, { error: "The provided password is not strong enough. Try again." });
		}

		await new Promise((fulfil)=>setTimeout(fulfil, 5000))
		return { success: true };
	},
}; 

function validateJID(jid: string): boolean {
	const jidRegex = /^[^"&'/:<>@\s\x00-\x1F\x7F]{1,1023}@[^\s@/]{1,1023}(?:\/.*)?$/;
    return jidRegex.test(jid);
}
