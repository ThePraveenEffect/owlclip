'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { apiFetch } from "@/lib/api";
import { loginAction } from "@/features/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "@/schemas/auth.schema";

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
  <section className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-border">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-card-foreground">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground mt-2">
          Please enter your credentials to login.
        </p>
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
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Email
          </label>

          <input
            {...register("email")}
            placeholder="Enter your email"
            type="email"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200 bg-background
              ${
                errors.email
                  ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
              }`}
          />

          {errors.email && (
            <p className="mt-2 text-sm text-destructive-foreground">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Password
          </label>

          <input
            {...register("password")}
            placeholder="Enter your password"
            type="password"
            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-200 bg-background
              ${
                errors.password
                  ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-input focus:border-ring focus:ring-2 focus:ring-ring/20"
              }`}
          />

          {errors.password && (
            <p className="mt-2 text-sm text-destructive-foreground">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
            <p className="text-sm text-destructive-foreground">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

       <p className="mt-6 text-center text-muted-foreground">
                    Already have an account?{' '}
                    <Link href='/signup' className='text-primary hover:opacity-80 font-semibold'>
                        Sign Up
                    </Link>
       </p>


    </div>
  </section>
);
}
