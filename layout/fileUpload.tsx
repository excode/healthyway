
import React, {forwardRef, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload,ItemTemplateOptions, FileUploadBeforeUploadEvent,FileUploadHeaderTemplateOptions,FileUploadSelectEvent, FileUploadFilesEvent, FileUploadHandlerEvent, FileUploadUploadEvent, FileUploadProps } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import {UploadInfo} from '@services/UploadInfo'
import { parse } from 'cookie';

const CustomFileUpload= ({url,accept,table,tableId,fieldName,maxFileSize,onUpload,dbColName}:UploadInfo)=>{
  
   const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const uploadUrl=`${url}/${table}/upload/${dbColName}/${tableId}`
    const cookies = parse(document.cookie);
    const cookieObj = JSON.parse(cookies.user);
    const onTemplateSelect = (e:FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((value,key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e:FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file:File) => {
            _totalSize += file.size || 0;
        });
       
        setTotalSize(_totalSize);
        if(onUpload){
            onUpload(e.xhr.responseText??"");
        }
        
       // console.log("I AM DONE2")
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file:File, callback:Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };
    const onBeforeUpload_ =(event:FileUploadBeforeUploadEvent)=>{
        //const ldata = cookies
       
        if ( cookies == null ) return [];
       
        const token = cookieObj.accessToken
       
        event.xhr.setRequestHeader('Authorization','Bearer '+token);
   

    }
    const uploadHandler =(event:FileUploadHandlerEvent)=>{
        console.log(event)
    }
    const headerTemplate = (options:FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const numValue:number=fileUploadRef && fileUploadRef.current ? fileUploadRef.current:0;
        const formatedValue = "";

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file:any ,props:ItemTemplateOptions) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload ref={fileUploadRef} name={fieldName} url={uploadUrl}  accept={accept} maxFileSize={maxFileSize}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                onBeforeSend={onBeforeUpload_}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}  
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}
        /**onBeforeSend={onBeforeUpload_} uploadHandler={uploadHandler}  */


export default CustomFileUpload;