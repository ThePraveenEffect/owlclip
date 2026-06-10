import {z} from "zod";

export const VideoLinkSchema = z.object({
    yt_url: z.url("Please enter a valid URL").min(32,"Enter valid youtube Url.")
})

export type VideoLink = z.infer<typeof VideoLinkSchema>;