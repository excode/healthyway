
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import React, { useState,useEffect,useRef } from 'react';
import { useRouter } from 'next/router'
import BlockViewer from '../../../components/BlockViewer';
import config from "@config/index"; 
import { Image } from 'primereact/image';
import moment from 'moment' 
import {Users,UsersService,UsersKey } from '@services/Users';

const UsersDetails = () => {
    const router = useRouter()
    const usersService = new UsersService();
    const [users, setUsers] = useState<Users>({firstName:"",email:"",lastName:"",kitchen:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }


    useEffect(() => {
        setLoading(true);
        (async() => {
        let idVal:string = id?.toString()||"";
        let d=  await usersService.getUsersDetails(idVal);
        if(d.error==undefined ){
        setUsers(d.data);
        setLoading(false);
        toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data Loaded', life: 3000 });
        }else{
        setLoading(false)
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
    })()
}, []);
    

    return (
         <>

<BlockViewer header="Users details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">First Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.firstName}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.email}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.mobile}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Country</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.country}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">User Types</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.userType}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Last Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.lastName}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Kitchen</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{users.kitchen}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

</>

);

    
};

UsersDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default UsersDetails;

