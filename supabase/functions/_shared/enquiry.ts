export type EnquiryPayload={name:string;email:string;phone:string|null;intent:string;message:string;property_id:string|null;preferred_date:string|null;consent:boolean};
export function validateEnquiry(raw:unknown,today=new Date().toISOString().slice(0,10)):EnquiryPayload{
if(!raw||typeof raw!=='object')throw new Error('Invalid enquiry.');const p=raw as Record<string,unknown>;
const text=(key:string,max:number,min=0)=>{if(typeof p[key]!=='string')throw new Error(`Invalid ${key}.`);const value=String(p[key]).trim();if(value.length<min||value.length>max||value.includes('\u0000'))throw new Error(`Invalid ${key}.`);return value;};
const name=text('name',100,2),email=text('email',254,3).toLowerCase(),message=text('message',3000,10),intent=text('intent',30,1);
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['Buy','Rent','Sell','Viewing'].includes(intent)||p.consent!==true||p.website)throw new Error('Please check the enquiry details and consent.');
const phone=p.phone?text('phone',30):null;if(phone&&!/^[+\d\s().-]{5,30}$/.test(phone))throw new Error('Invalid phone number.');
const property_id=p.property_id?text('property_id',120):null;if(property_id&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(property_id))throw new Error('Invalid property.');
const preferred_date=p.preferred_date?text('preferred_date',10):null;if(preferred_date&&(!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)||Number.isNaN(Date.parse(preferred_date))||new Date(preferred_date).toISOString().slice(0,10)!==preferred_date||preferred_date<today))throw new Error('Choose a valid future viewing date.');
return {name,email,phone,intent,message,property_id,preferred_date,consent:true};
}
