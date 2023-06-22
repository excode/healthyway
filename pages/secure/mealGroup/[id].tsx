
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
import {MealGroup,MealGroupService,MealGroupKey } from '@services/MealGroup';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Dialog } from 'primereact/dialog';
    
const MealGroupDetails = () => {
    const router = useRouter()
    const mealgroupService = new MealGroupService();
    const [mealGroup, setMealGroup] = useState<MealGroup>({name:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');
    
    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }

    const downloadFile=(data:MealGroup,dbColName:MealGroupKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:MealGroupKey) => {
        let _mealGroup = {...mealGroup,[colName]:newUploadedFileName}
        setMealGroup(_mealGroup);
                
    };
    const showUploadDialog = (mealGroup:MealGroup,dbColName:string,accept:string="images/*") => {
        setMealGroup({ ...mealGroup });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
    
    
    
const imageBodyTemplate =()=> {  
let imageURL= config.serverURI+"/"+mealGroup.image
let fileURL= "/file_icon.png"
let fileNoURL= "/file_icon_na.png"
let contetnt;

let acceptFile="images/*"
if(mealGroup.image!=undefined && mealGroup.image!=''){
    contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(mealGroup.id??'')}  src={imageURL}  alt="image"  preview downloadable width="250" /> ;
}else if(mealGroup.image==undefined || mealGroup.image=='' ){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(mealGroup.id??'')}  src="/photo_na.png"  alt="image" width="250" /> ;
}
return (
<>
    <div className="card flex justify-content-center">
    {contetnt}
    </div>

{currentImage == mealGroup.id && (
<Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(mealGroup,'image',acceptFile)} aria-label="Bookmark" style={{
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
        let d=  await mealgroupService.getMealGroupDetails(idVal);
        if(d.error==undefined ){
        setMealGroup(d.data);
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

<BlockViewer header="MealGroup details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    {imageBodyTemplate()}
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Created By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{mealGroup.createBy}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Created At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{mealGroup.createAt}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{mealGroup.updateBy}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{mealGroup.updateAt}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{mealGroup.name}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof MealGroup)} url={uploadInfo?.url} table="mealGroup" tableId={mealGroup.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
    
</>

);

    
};

MealGroupDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default MealGroupDetails;

