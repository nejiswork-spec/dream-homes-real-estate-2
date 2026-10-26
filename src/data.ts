import {examples,normalizeProperty,type Property} from './catalogue';
export {asset,examples,money,type Property} from './catalogue';
export function configuration(){
 const url=import.meta.env.VITE_SUPABASE_URL?.trim(),key=(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim();
 if(!url&&!key)return null;
 if(!url||!key)throw new Error('Supabase configuration is incomplete.');
 if(!url.startsWith('https://'))throw new Error('The Supabase URL must use HTTPS.');
 return {url:url.replace(/\/$/,''),key};
}
export async function loadProperties(signal:AbortSignal):Promise<{items:Property[];demo:boolean}>{
 const config=configuration();if(!config)return {items:examples,demo:true};
 const response=await fetch(`${config.url}/rest/v1/properties?select=*&published=eq.true&order=created_at.desc`,{signal,headers:{apikey:config.key}});
 if(!response.ok)throw new Error('Properties could not be loaded. Please try again later.');
 const data:unknown=await response.json();if(!Array.isArray(data))throw new Error('Unexpected property service response.');
 return {items:data.map(normalizeProperty),demo:false};
}
