import { NextRequest, NextResponse } from "next/server";
import {redirect} from 'next/navigation';

export function proxy(req:NextRequest){

    const accessToken = req.cookies.get('access_token')?.value;
    const refreshToken = req.cookies.get('refresh_token')?.value;
    

    if(req.nextUrl.pathname.startsWith('/dashboard')){
        if(!accessToken && !refreshToken){
            return NextResponse.redirect(new URL('/login', req.url));
        }
        
        if(!accessToken&& refreshToken){
           return NextResponse.redirect(
            new URL('api/v1/auth/refresh', req.url)
       );
    }
    }
      
    return NextResponse.next();
   
}

export const config = {
    matcher:[
        '/dashboard/:path*',
        '/app/:path*'
    ]
}