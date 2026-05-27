'use server';
// 'use server' creates a secure network bridge, forcing this function 
// to execute safely on the server instead of the public browser.




import {cookies} from 'next/headers';
import setCookieParser from 'set-cookie-parser';
import { LoginFormData, LoginSchema } from '@/src/schemas/auth.schema';


export async function loginAction(data:LoginFormData){

   /**
    * send the form data to the backend API for authentication.
    * read the json response response.json() and check if the response is ok.
    * If the response is not ok, return an error message.
    * If the response is ok, extract the token from the response and set it as a cookie.
    */


    const validatedField = LoginSchema.safeParse(data);
    
    if (!validatedField.success) {
        return {
            success: false,
            error: 'Invalid form data',
        }
    }


    /**
     * Important Concept

    safeParse() is NON-THROWING.

   Meaning:

   safeParse()

   returns an object.

   Whereas:

   parse()

   THROWS an exception.
     */

    try { 

       
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/v1/auth/login`,
            {
                method:'POST',
                headers:{
                    
                "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedField.data), 
                // credentials: 'include' this option is not needed in server actions because they automatically 
                // have access to cookies and session data, 
                // so you can omit it when making fetch requests from server actions.
            });

        const result = await response.json();


        if(!response.ok){
            return {
                success: false,
                error: result.message || 'Invalid credentials',
            }
        }
       
        const setCookies = response.headers.getSetCookie();
        const cookieStore = await cookies(); 

        // cookie in structure format like in array
        const parsedCookies = setCookieParser.parse(setCookies)
        


        for(const cookie  of parsedCookies){
            cookieStore.set(cookie.name, cookie.value,{
                httpOnly:cookie.httpOnly?? true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: cookie.sameSite?.toLowerCase() ==='strict'?
                'strict' : 'lax',
                path: cookie.path || '/',
                maxAge: cookie.maxAge,
                expires: cookie.expires,
            });
        }


        return {
            success: true,
            message: 'Login successful',
            userData: result.user, 
        };
    } catch(error) {
        return { success: false, error: 'Internal server network error' };
    }
}