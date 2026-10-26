export interface Property {id:string;name:string;location:string;city:string;type:string;price:number;beds:number;baths:number;area:number;image:string;images:string[];purpose:'Buy'|'Rent';description:string;availability:'Available'|'Under offer'|'Sold'|'Let'|'Unconfirmed';amenities:string[];neighbourhood:string;documentation:string;published?:boolean;}
export const asset=(name:string)=>`https://dream-homes-real-estate-2.vercel.app/images/${name}.png`;
const sample=(p:Omit<Property,'images'|'availability'|'amenities'|'neighbourhood'|'documentation'>):Property=>({...p,images:[p.image],availability:'Unconfirmed',amenities:[],neighbourhood:'Neighbourhood details have not been verified for this sample listing.',documentation:'Not provided. Ask for ownership documents and arrange independent verification.'});
export const examples:Property[]=[
sample({id:'oceanview-villa',name:'Oceanview Luxury Villa',location:'Lekki Phase 1, Lagos',city:'Lagos',type:'Villa',price:450000000,beds:5,baths:4,area:450,image:asset('villa'),purpose:'Buy',description:'An illustrative five-bedroom villa from the original DreamHomes website. The sample price, photographs and location demonstrate the browsing experience and are not a confirmed offer.'}),
sample({id:'skyline-penthouse',name:'Skyline Penthouse',location:'Maitama, Abuja',city:'Abuja',type:'Apartment',price:180000000,beds:3,baths:3,area:280,image:asset('apartment'),purpose:'Buy',description:'An illustrative three-bedroom penthouse from the original website. Confirm the exact address, floor plan, condition and total costs before arranging a transaction.'}),
sample({id:'garden-bungalow',name:'Garden Paradise Bungalow',location:'Abeokuta, Ogun',city:'Ogun',type:'Bungalow',price:85000000,beds:4,baths:2,area:320,image:asset('bungalow'),purpose:'Buy',description:'An illustrative four-bedroom bungalow from the original website. Its price, size and availability require independent confirmation.'})];
export const money=(n:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n);
export const httpsImage=(value:unknown):value is string=>{try{return typeof value==='string'&&new URL(value).protocol==='https:';}catch{return false;}};
export function normalizeProperty(row:unknown):Property {
if(!row||typeof row!=='object')throw new Error('Invalid property record.');const p=row as Record<string,unknown>;
for(const name of ['id','name','location','city','type','description'])if(typeof p[name]!=='string'||!String(p[name]).trim())throw new Error(`Property ${name} is missing.`);
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(p.id)))throw new Error('Invalid property URL.');
for(const name of ['price','beds','baths','area'])if(typeof p[name]!=='number'||!Number.isFinite(p[name])||Number(p[name])<0)throw new Error(`Invalid property ${name}.`);
if(!Number.isInteger(p.beds)||!Number.isInteger(p.baths))throw new Error('Bedrooms and bathrooms must be whole numbers.');
if(!['Buy','Rent'].includes(String(p.purpose))||!httpsImage(p.image))throw new Error('Invalid property purpose or cover image.');
const images=Array.isArray(p.images)?p.images.filter(httpsImage):[],amenities=Array.isArray(p.amenities)?p.amenities.filter((v):v is string=>typeof v==='string'&&v.length>0):[];
return {...p,images:[...new Set([String(p.image),...images])],amenities,availability:['Available','Under offer','Sold','Let','Unconfirmed'].includes(String(p.availability))?p.availability:'Unconfirmed',neighbourhood:typeof p.neighbourhood==='string'?p.neighbourhood:'Neighbourhood information has not been provided.',documentation:typeof p.documentation==='string'?p.documentation:'Document information has not been provided.'} as Property;
}
export function filterProperties(properties:Property[],params:URLSearchParams,saved:string[]=[],onlySaved=false):Property[]{
const number=(key:string)=>{const raw=params.get(key);return raw!==null&&raw!==''&&Number.isFinite(Number(raw))&&Number(raw)>=0?Number(raw):undefined;};let min=number('min'),max=number('max');
if(min===undefined&&max===undefined){if(params.get('budget')==='100')max=99999999;if(params.get('budget')==='300'){min=1e8;max=3e8;}if(params.get('budget')==='above')min=300000001;}
const beds=number('beds');return properties.filter(p=>(!params.get('city')||p.city===params.get('city'))&&(!params.get('type')||p.type===params.get('type'))&&(!params.get('purpose')||p.purpose===params.get('purpose'))&&(min===undefined||p.price>=min)&&(max===undefined||p.price<=max)&&(beds===undefined||p.beds>=beds)&&(!onlySaved||saved.includes(p.id)));}
