/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import React, { useContext, useState,useRef } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../../../types/types';
import { Toast } from "primereact/toast";
import { useLogin } from "../../../hooks/auth/useLogin";
import config from "@config/index";
import { LoginData, UserData } from '@services/Login';
import { useCookies } from 'react-cookie';
//import jwt_decode, { JwtPayload } from 'jwt-decode';

const LoginPage: Page = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState("");
    const [checked, setChecked] = useState(false);
    const { login } = useLogin();
    const { layoutConfig } = useContext(LayoutContext);
    //const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies(['user']);
    
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig?.inputStyle === 'filled' });
    const onSubmit = () => {
        
        if (!username || !password) {
            alert("Please enter login information");
        } else {
            setLoading(true);
            let loginData:LoginData ={email:username,password:password};
            login(loginData)
                .then(function (res) {
                    console.log(res)
                    if (!res.error) {
                  
                       
                        setCookie('user', res);
                       
                        setLoading(false);
                        console.log(cookies.user)
                        
                        router.push("/secure");
                    } else {
                        setLoading(false);
                        toast.current?.show({ severity: "error", summary: "Login Failed", detail: res.error, life: 3000 });
                    }
                })
                .catch((e) => alert(e));
        }
        
    };
    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig?.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={onSubmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
