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

		await new Promise((fulfil) => setTimeout(fulfil, 5000));
		// result = fetch("https://xmpp.basedware.xyz/invites_register_web",)
		// await 
		// return { success: true };
	},
}; 

function validateJID(jid: string): boolean {
    const jidRegex = /^[^\s@]+@[^\s@/]+(?:\/.*)?$/;
    return jidRegex.test(jid);
}
