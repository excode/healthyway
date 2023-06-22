import { UserData } from '@services/Login';
import { NextRequest,NextResponse } from 'next/server'

export function middleware(request:NextRequest) {
  const currentUser =    request.cookies.get("user")||"";
  
  console.log("*****");
  console.log(currentUser)
 
  if (
    (!currentUser)
  ) {
    const response = NextResponse.redirect((new URL("/auth/login", request.url)));
   
    return response;
  }
}

export const config = {
  matcher: [
    '/secure'
  ]
  
};