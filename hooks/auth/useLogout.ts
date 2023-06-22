//import { removeCookie } from 'typescript-cookie'
//import { useCookies } from 'react-cookie';
export const useLogout = () => {
  //const [cookies, setCookie,removeCookie] = useCookies(['user']);
  const logout =  () => {
   //removeCookie("currentUser");
  };

  return { logout };
};
