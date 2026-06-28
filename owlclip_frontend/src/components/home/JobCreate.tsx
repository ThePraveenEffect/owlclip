'use client';

import { useState } from "react";
import { VideoLinkSchema, VideoLink } from "@/schemas/VideoLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";


export function JobCreate() {

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },

    } = useForm<VideoLink>({
        resolver: zodResolver(VideoLinkSchema),
        defaultValues: {
            yt_url: ""
        },
        mode: "onSubmit"
    });


    const onSubmit = async (data: VideoLink) => {
        console.log("Form submitted with data:", data);
        setServerError(null);
        setSuccessMessage(null);

        try {
            const response = await apiClient("/v1/upload", {
                method: "POST",
                body: JSON.stringify(data),
            });


            setSuccessMessage("Video link submitted successfully!");
            reset();
            router.push(`/dashboard/clips`);
        } catch (error: any) {
            console.error("Error:", error);

            if (error?.code === "VALIDATION_FAILED" && error.issues?.length > 0) {
                error.issues.forEach((issue: any) => {
                    if (issue.field === "yt_url") {
                        setServerError(issue.message);
                    }
                });
            } else {
                setServerError(error?.message || "An error occurred while submitting the video link.");
            }
        }
    };


    return (
        <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="absolute -inset-8 bg-linear-to-r from-orange-500/20 via-red-500/30 to-orange-500/20 blur-3xl rounded-3xl -z-10 animate-pulse" />
            <div className="absolute -inset-6 bg-linear-to-b from-orange-500/10 via-red-500/20 to-transparent blur-2xl rounded-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -inset-1 bg-linear-to-r from-orange-500/40 via-red-500/40 to-orange-500/40 rounded-3xl blur-sm -z-10 animate-spin-slow" />

            <div className="relative bg-card rounded-3xl border border-border p-8 shadow-2xl overflow-hidden">

                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-100">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-orange-600/5 rounded-full blur-3xl animate-float-slow" />
                </div>

                <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-border/50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/50 animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/50 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <div className="ml-6 flex-1 bg-muted px-4 py-2 rounded-lg text-md font-mono text-muted-foreground border border-border/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="relative z-10">🎬 owlclip.app</span>
                    </div>
                </div>

                <div className="relative mb-10 pb-10 border-b border-border/50">
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping absolute" />
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                            Paste YouTube Link
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-orange-500/30 via-red-500/30 to-orange-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow" />
                            <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500/50 via-red-500/50 to-orange-500/50 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500" />

                            <div className="relative flex flex-col sm:flex-row gap-3">
                                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <input
                                            {...register("yt_url")}
                                            id="yt_url"
                                            type="text"
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-muted px-6 py-4 rounded-xl text-card-foreground placeholder-muted-foreground text-sm border border-border focus:border-orange-500/50 focus:outline-none transition-all duration-300 font-mono hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
                                        />
                                        {errors.yt_url && (
                                            <p className="text-destructive-foreground text-xs mt-2">
                                                {errors.yt_url.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        className="relative px-6 py-4 bg-linear-to-r from-orange-500 via-orange-600 to-red-600 text-white font-bold rounded-xl overflow-hidden group/btn transition-all duration-300 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap"
                                        type="submit"
                                        disabled={isSubmitting || !!errors.yt_url}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                        <Zap className="w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                                        <div className="absolute inset-0 bg-linear-to-r from-orange-400/0 via-orange-400/50 to-orange-400/0 opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-500" />
                                        <span className="relative z-10">
                                            {isSubmitting ? (
                                                <span className='flex items-center justify-center gap-2'>
                                                    <span className='animate-spin'>⏳</span>
                                                    Creating Clips...
                                                </span>
                                            ) : (
                                                'Process'
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {serverError && (
                    <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground">
                        {serverError}
                    </div>
                )}
                {successMessage && (
                    <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500">
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
