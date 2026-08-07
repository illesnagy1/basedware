import { fail } from "@sveltejs/kit";
import zxcvbn from "zxcvbn";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const jid = data.get("jid") as string;
		const password = data.get("password") as string;
        const token = data.get("token") as string;

		if (!jid || !password || !token) {
			return fail(400, { missing: true });
		}

		if (!validateJID(jid)) {
			return fail(400, { invalidJID: true });
		}

		if (zxcvbn(password).score < 3) {
			return fail(400, { weakPassword: true });
		}

		try{
			const result = await fetch("https://xmpp.basedware.xyz/invites_register_web?t=" + token, {
				method: "POST",
				headers: {
					"Content-Type": "application/www-form-urlencoded",
				},
				body: `username=${encodeURIComponent(jid)}&password=${encodeURIComponent(password)}`,
			});
		} catch (error) {

		}

		return { success: true };
	},
}; 

function validateJID(jid: string): boolean {
	const jidRegex = /^[^"&'/:<>@\s\x00-\x1F\x7F]{1,1023}@[^\s@/]{1,1023}(?:\/.*)?$/;
    return jidRegex.test(jid);
}
