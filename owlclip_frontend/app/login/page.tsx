'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { apiFetch } from "@/src/lib/api";
import { loginAction } from "@/src/features/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "@/src/schemas/auth.schema";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  


  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: LoginFormData) {
    try {
       setServerError(null); // Clear previous server errors
       setSuccessMessage(null); // Clear previous success messages

      // const response = await apiFetch("/api/v1/auth/login", {
      //   method: "POST",
      //   body: JSON.stringify(data),
      // });

      const response = await loginAction(data);

     if (!response.success) {
      setServerError(response.error || "Login failed");
      return;
    }

      setSuccessMessage("Login successful! Redirecting...");
      reset(); // Clear the form after successful submission

      setTimeout(()=>{
                router.push('/'); // Redirect to home page after successful login

            }, 1500);

    } catch (error) {
      setServerError( 
        error instanceof Error
        ? error.message
        : "Something went wrong.");
    }
  }

  return (
  <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back!
        </h1>
        <p className="text-gray-500 mt-2">
          Please enter your credentials to login.
        </p>
      </div>



       {successMessage && (
    <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in'>
        <p className='text-sm text-green-700 font-semibold'>
            {successMessage}
        </p>
    </div>
)}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            {...register("email")}
            placeholder="Enter your email"
            type="email"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200
              ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              }`}
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            {...register("password")}
            placeholder="Enter your password"
            type="password"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200
              ${
                errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              }`}
          />

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full rounded-xl bg-black text-white py-3 font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

       <p className='mt-6 text-center text-gray-600'>
                    Already have an account?{' '}
                    <Link href='/signup' className='text-indigo-600 hover:text-indigo-700 font-semibold'>
                        Sign Up
                    </Link>
       </p>


    </div>
  </section>
);
}
