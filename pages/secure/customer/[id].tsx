
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
import {Customer,CustomerService,CustomerKey } from '@services/Customer';

const CustomerDetails = () => {
    const router = useRouter()
    const customerService = new CustomerService();
    const [customer, setCustomer] = useState<Customer>({name:"",Address:"",GeoTag:"",mobile:""});
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
        let d=  await customerService.getCustomerDetails(idVal);
        if(d.error==undefined ){
        setCustomer(d.data);
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

<BlockViewer header="Customer details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Created By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.createBy}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Created At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.createAt}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.updateBy}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.updateAt}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.name}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.email}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.Address}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">GeoTag</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.GeoTag}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.mobile}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Customer Type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{customer.customerType}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

</>

);

    
};

CustomerDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default CustomerDetails;

