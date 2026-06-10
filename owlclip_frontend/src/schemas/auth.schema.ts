import {z} from 'zod';


export const SignupSchema = z.object({
    username: z
    .string()
    .trim()
    .min(3, {message: 'Username must be at least 3 characters long'})
    .max(20, {message: 'Username too long.'}), 

    email: z
    .email({message: 'Invalid email address'})
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters long'})
    .max(100, {message: 'Password too long.'})
});


export const LoginSchema = z.object({
    email: z
    .email({message: 'Invalid email address'})
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters long'})
    .max(100, {message: 'Password too long.'})
    .trim()
})

export type SignupFormData = z.infer<typeof SignupSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;