
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
import {Promotions,PromotionsService,PromotionsKey } from '@services/Promotions';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Dialog } from 'primereact/dialog';
    
const PromotionsDetails = () => {
    const router = useRouter()
    const promotionsService = new PromotionsService();
    const [promotions, setPromotions] = useState<Promotions>({mealPlan:"",name:"",description:"",startDate:"",endDate:"",discount:"",image:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');
    
    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }

    const downloadFile=(data:Promotions,dbColName:PromotionsKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:PromotionsKey) => {
        let _promotions = {...promotions,[colName]:newUploadedFileName}
        setPromotions(_promotions);
                
    };
    const showUploadDialog = (promotions:Promotions,dbColName:string,accept:string="images/*") => {
        setPromotions({ ...promotions });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
    
    
    
const imageBodyTemplate =()=> {  
let imageURL= config.serverURI+"/"+promotions.image
let fileURL= "/file_icon.png"
let fileNoURL= "/file_icon_na.png"
let contetnt;

let acceptFile="images/*"
if(promotions.image!=undefined && promotions.image!=''){
    contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(promotions.id??'')}  src={imageURL}  alt="image"  preview downloadable width="250" /> ;
}else if(promotions.image==undefined || promotions.image=='' ){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(promotions.id??'')}  src="/photo_na.png"  alt="image" width="250" /> ;
}
return (
<>
    <div className="card flex justify-content-center">
    {contetnt}
    </div>

{currentImage == promotions.id && (
<Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(promotions,'image',acceptFile)} aria-label="Bookmark" style={{
    position: "relative",
    top: "-105px",
    right: "-35px"
  }} /> 
)}
</>
)
};
    useEffect(() => {
        setLoading(true);
        (async() => {
        let idVal:string = id?.toString()||"";
        let d=  await promotionsService.getPromotionsDetails(idVal);
        if(d.error==undefined ){
        setPromotions(d.data);
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

<BlockViewer header="Promotions details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    {imageBodyTemplate()}
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Meal Plan</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.mealPlan && promotions.mealPlan.map((t:any,k:any) => <Chip key={k} label={t}></Chip>) }</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.name}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Description</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.description}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Start Date</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.startDate}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">End Date</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.endDate}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Discount</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.discount}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Kitchen</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{promotions.kitchen}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Promotions)} url={uploadInfo?.url} table="promotions" tableId={promotions.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
    
</>

);

    
};

PromotionsDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default PromotionsDetails;

