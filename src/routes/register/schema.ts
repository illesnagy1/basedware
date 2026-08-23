import * as z from 'zod';
import zxcvbn from 'zxcvbn';

const jidRegex = /^[^"&'/:<>@\s\x00-\x1F\x7F]{0,1023}?$/;

export const registerSchema = z
  .object({
    JID: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'JID cannot be empty. Try again.')
      .regex(jidRegex, 'The provided JID is not valid. Try again.'),
    password: z.string().min(1, 'The password cannot be empty. Try again.'),
    token: z.string().min(1, 'You must provide a token. Try again.'),
  })
  .refine(({ JID, password }) => zxcvbn(password, [JID]).score >= 3, {
    message: 'The provided password is not strong enough. Try again.',
    path: ['password'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
