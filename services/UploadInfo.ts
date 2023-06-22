export type UploadInfo = {
    url?:string;
    dbColName?:string;
    accept?:string;
    table?:string;
    tableId?:string;
    fieldName?:string;
    maxFileSize?:number;
    onUpload?:(info:string)=>void
}