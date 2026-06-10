'use client'

import {useState} from 'react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {SignupFormData, SignupSchema} from '@/schemas/auth.schema';
import {apiClient} from '@/lib/api/client';
import { useRouter } from 'next/navigation';

// zodresolver help to use zod in react-hook-form for validation. 
// It acts as a bridge, translating Zod's validation errors into a format 
// that React Hook Form can understand and display.
import {zodResolver} from '@hookform/resolvers/zod';




//  we don't need it because we're using zod that creates a z.infer type that 
// automatically gives us the types of the schema. 
// So we can use SignupFormData directly without having to define it separately.

// type SignupFormData = {
//     username: string;
//     email: string;
//     password: string;
// }

export default function SignupPage(){


    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState:{
            errors,
            isSubmitting,
            isDirty
        }
    
    } = useForm<SignupFormData>({
        resolver: zodResolver(SignupSchema),


// 🧠 Why the defaultValues Are Explicitly Defined Even though your fields start empty, 
// passing empty strings "" is a crucial best practice for three reasons:
// Prevents Controlled vs. Uncontrolled Errors: If you don't provide default values, React Hook Form sets your values to undefined initially. 
// When the HTML input later receives text, the input changes from uncontrolled to controlled, triggering a loud React console warning.
// Sets the Type Foundation: Passing an object with keys defines the exact shape of your form data, 
// allowing TypeScript to catch typos when you use register("username").
// Empowers the reset() API: The reset() function you extracted from useForm reads from this exact defaultValues object. 
// When you call reset() after a successful signup, the form knows exactly how to wipe the fields back to empty strings.


// If you omit defaultValues, React Hook Form initializes your fields as undefined.

        defaultValues:{
            username:'',
            email:'',
            password:''
        },
        mode: 'onSubmit'
    });
    
    const onSubmit = async (data: SignupFormData)=>{
        setServerError(null); // Clear previous server errors
        setSuccessMessage(null); // Clear previous success messages
        try{
            const response = await apiClient('/api/v1/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )   

            
            setSuccessMessage('Account created successfully!'); // Show success message
            reset();     // Clear the form after successful submission
            
            setTimeout(()=>{
                router.push('/login'); // Redirect to login page after successful signup

            }, 1500);
            
        } catch(payload: any){
           if (payload?.error?.issues && Array.isArray(payload.error.issues)) {
      payload.error.issues.forEach((issue: { field: string; message: string }) => {
        setError(issue.field as any, {
          type: "server",
          message: issue.message,
        });
      });
    } else {
      // Catch-all structural fallback if the server goes down completely
      setError("root", {
        message: payload?.error?.message || "An unexpected system error occurred.",
      });
    }
            setServerError(payload.message || 'Something went wrong.');   
        }
    }




    return(

    /**
     * using react-hook-form to making the form handling easier and more efficient. It provides a simple API for managing form state, validation, and submission. By using react-hook-form, we can easily register form fields, handle form submissions, and manage form errors without the need for complex state management or additional libraries.
     * we have to implement zod for validation with react-hook-form.
     * fetch the api when user submit the form. 
     */



 <div className='min-h-screen bg-background flex items-center justify-center p-4'>
            <section className='w-full max-w-md bg-card rounded-lg shadow-lg p-8 border border-border'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-card-foreground'>Create Account</h1>
                    <p className='text-muted-foreground mt-2'>Join our community today</p>
                </div>

               
               {successMessage && (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-emerald-600 font-semibold">
            {successMessage}
        </p>
    </div>
)}
               
                
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    {/* Username Field */}
                    <div>
                        <label htmlFor='username' className='block text-sm font-medium text-muted-foreground mb-2'>
                            Username
                        </label>
                        <input 
                            {...register('username')} 
                            id='username'
                            placeholder="Enter your username" 
                            type="text"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-background text-foreground ${
                                errors.username 
                                    ? 'border-destructive focus:ring-destructive/20' 
                                    : 'border-input focus:ring-ring/20'
                            }`}
                        />
                        {errors.username && (
                            <p className='mt-1 text-sm text-destructive-foreground flex items-center gap-1'>
                                <span>⚠️</span>
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-muted-foreground mb-2'>
                            Email Address
                        </label>
                        <input 
                            {...register('email')} 
                            id='email'
                            placeholder="Enter your email" 
                            type="email"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-background text-foreground ${
                                errors.email 
                                    ? 'border-destructive focus:ring-destructive/20' 
                                    : 'border-input focus:ring-ring/20'
                            }`}
                        />
                        {errors.email && (
                            <p className='mt-1 text-sm text-destructive-foreground flex items-center gap-1'>
                                <span>⚠️</span>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-muted-foreground mb-2'>
                            Password
                        </label>
                        <input 
                            {...register('password')} 
                            id='password'
                            placeholder="Create a strong password" 
                            type="password"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition bg-background text-foreground ${
                                errors.password 
                                    ? 'border-destructive focus:ring-destructive/20' 
                                    : 'border-input focus:ring-ring/20'
                            }`}
                        />
                        {errors.password && (
                            <p className='mt-1 text-sm text-destructive-foreground flex items-center gap-1'>
                                <span>⚠️</span>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
                            <p className='text-sm text-destructive-foreground'>
                                <span className='font-semibold'>Error:</span> {serverError}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !isDirty}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                            isSubmitting || !isDirty
                                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className='flex items-center justify-center gap-2'>
                                <span className='animate-spin'>⏳</span>
                                Creating Account...
                            </span>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <p className='mt-6 text-center text-muted-foreground'>
                    Already have an account?{' '}
                    <Link href='/login' className='text-orange-500 hover:text-orange-600 font-semibold'>
                        Sign In
                    </Link>
                </p>
            </section>
        </div>

    );
}
