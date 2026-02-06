import {ZodType, z} from 'zod';

export const RegisterWithEmailSchema: ZodType<{
  email: string;
  password: string;
  confirmPassword: string;
}> = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, {message: 'Password is too short'})
      .max(20, {message: 'Password is too long'}),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // path of error
  });
