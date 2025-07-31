import { NextRequest, NextResponse } from "next/server"
import {getSessionCookie} from 'better-auth/cookies'

//define protected routes -> /profile, /post/create, /post/edit/1
const protectedRoutes = ['/profile', '/post/create', '/post/edit']

export async function middleware(request: NextRequest){
    const pathName = request.nextUrl.pathname;
    const session = getSessionCookie(request)


    const isProtectedRoute = protectedRoutes.some(route => pathName.startsWith(route))

    if(isProtectedRoute && !session){
        //redirect unauthenticated user to the auth page
        return NextResponse.redirect(new URL('/auth', request.url))
    
    }

    //if user is already logged in and user is accessing /auth route, redirect user to homepage
    if(session && pathName === '/auth'){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()


}

export const config = {
    matcher: ['/profile/:path*', '/post/create', '/post/edit/:path*', '/auth']
}