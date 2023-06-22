import { unlink } from 'fs';
import config from '../config'
type validationRule={
  id:string,
  type:number,
  max?:number,
  min?:number,
  required?:boolean
}
export const validateEmail=(value?:string)=> {
    // if the field is empty
   
    if (!value) {
      return false;
    }
    // if the field is not a valid email
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return false;
    }
    // All is good
    return true;
  }
  function isInt(value:number) {
    console.log(value);
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value.toString()))
  }
  function dummy(){
    console.log("I am dummy");
  }

function validateUsr(value?:string) {
  if (!value) {
    return false;
  }
  const regex = /^[a-z\d_]{4,16}$/i;
    if (!regex.test(value)) {
      return false;
    }
    // All is good
    return true;
}
  function isValidHttpUrl(str?:string) {
    const pattern = new RegExp(
      '/^[a-zA-Z0-9]+$/', // fragment locator
      'i'
    );
    return pattern.test(str??"");
  }
  
  export function validateForm<T>(formData:T,rules:validationRule[]){
    //console.log(formData)
    var errors:string[]=[];
    let key: keyof T;
    for (key in formData) { 
     // console.log(`${key} -> ${formData[key]}`)
      const rule = rules.find(r=>r.id==key);
      if(rule!==undefined){
        
          const  value=formData[key];
          let strValue:string="";
          let numValue:number= 0;
          let dateValue:Date = new Date(1900,1,1);
          let boolValue = false;
          let aryValue:string[] = [];
          let objValue = {}
          if (typeof value ==='number'){
            numValue = value;
          }else if(typeof value ==='string'){
            strValue=value;
          }else if(typeof value ==='boolean'){
            boolValue=value;
          
          }else if(typeof value === 'object'){
            objValue = value as object ;
          }else if(value instanceof Date && value.getTime()){
            dateValue= value
          }
         if([validate.email,validate.username,validate.url,validate.phone].includes(rule.type)){
          if( (strValue=="")){
            if(rule.required){
              if(config.multiLanguageSupport){
                errors.push(key.toString() +"_is_required")
              }else{
                errors.push(capitalizeFirstLetter(key) +" is required")
              }
            }
          }else{
            if(rule.type==validate.email ){
              //console.log("Email checking "+value)
              if(!validateEmail(strValue)){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_invalid_email_address")
                }else{
                  errors.push(" invalid email address for "+key.toString() )
                }
              }
            }
            if(rule.type==validate.url ){
              
              if(!isValidHttpUrl(strValue)){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_is_not_valid_url")
                }else{
                  errors.push(capitalizeFirstLetter(key)+" is not a valid URL")
                }
              }
            }
            if(rule.type==validate.username ){
              
              if(!validateUsr(strValue)){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_is_not_valid_format")
                }else{
                  errors.push(capitalizeFirstLetter(key) +" is not a valid!! Space , special chars not supported")
                }
              }
            }
            if(rule.max!==undefined && rule.max>0){
              if(strValue.length>rule.max){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_must_be_lower_than_"+rule.max+"_chars")
                }else{
                  errors.push(capitalizeFirstLetter(key) +" must be lower than "+rule.max+" chars")
                }
              }
            }
            if(rule.min!==undefined && rule.min>0){
              if(strValue.length<rule.min){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_must_be_minimum_"+rule.min+"_chars"+strValue.length)
                }else{
                  errors.push(capitalizeFirstLetter(key) +" must be minimum  "+rule.min+" chars")
                }
              }
            }
          }
        }
            if(rule.type==validate.date && rule.required){
             
              let result1 = dateValue.getDate;
              //let result2 = moment(value, 'MM/DD/YYYY',true).isValid();
              if(!result1){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_is_not_valid_date")
                }else{
                  errors.push(capitalizeFirstLetter(key) +" is not a valid date  ")
                }
              }
            }
            if(rule.type==validate.number && rule.required){
              
              if(isNaN(numValue)){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_is_not_valid_number")
                }else{
                  errors.push(capitalizeFirstLetter(key) +" is not a valid number  ")
                }
              }
            }
            if(rule.type==validate.int && rule.required){
            if(numValue==0){

            }else{
              let newVal = numValue*1;
              //console.log(!Number.isInteger(newVal))
              if(!Number.isInteger(newVal)){
                if(config.multiLanguageSupport){
                  errors.push(key.toString() +"_is_not_valid_integer")
                }else{
                  errors.push(capitalizeFirstLetter(key) +" is not a valid integer")
                }
              }
            }
          
            
          }
        
      }
    }
    return errors;

  }
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  export class validate {
    // Private Fields
    static email_ = 0;
    static string_ = 1;
    static text_ = 1;
    static date_ = 2;
    static number_ = 3;
    static int_ = 4;
    static url_ = 5;
    static username_ = 6;
    static phone_ = 7;
    static array_ = 8;
    static password_ =9;
    static time_=10;
    static boolean_=10;
    static datetime_=10;


    
    // Accessors for "get" functions only (no "set" functions)
    static get email() { return this.email_; }
    static get string() { return this.string_; }
    static get text() { return this.text_; }
    static get date() { return this.date_; }
    static get number() { return this.number_; }
    static get int() { return this.int_; }
    static get url() { return this.url_; }
    static get username() { return this.username_; }
    static get phone() { return this.phone_; }
    static get array() { return this.array_; }
    static get password() { return this.password_; }
    static get time() { return this.time_; }
    static get boolean() { return this.boolean_; }
    static get datetime() { return this.datetime_; }
}