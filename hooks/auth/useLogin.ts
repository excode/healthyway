import { GetLoginResponse } from "@lib/httpRequest";
import { LoginData,LoginService,UserData } from "@services/Login";



//import jwt_decode, { JwtPayload } from 'jwt-decode';


export const useLogin = () => {
  const login = async (loginData:LoginData) => {
    const loginService = new LoginService()
   
    const user:GetLoginResponse = await loginService.login(loginData);
   
    
      
      return user
    
    
  };

  return { login };
};
