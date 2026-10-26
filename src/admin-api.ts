import {configuration} from './data';
type Session={access_token:string;refresh_token:string;expires_in:number};
let session:Session|null=null,expires=0,refreshing:Promise<void>|null=null;
const config=()=>{const value=configuration();if(!value)throw new Error('Connect Supabase before signing in.');return value;};
async function token(body:Record<string,string>,grant:string){const c=config(),r=await fetch(`${c.url}/auth/v1/token?grant_type=${grant}`,{method:'POST',headers:{apikey:c.key,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('Sign-in failed or your session expired. Check your details and try again.');const s=await r.json();session=s;expires=Date.now()+s.expires_in*1000;}
export async function signIn(email:string,password:string){await token({email,password},'password');try{if(await adminRequest('/rest/v1/rpc/is_admin',{method:'POST',body:'{}'})!==true)throw new Error('This account is not authorised to manage DreamHomes.');}catch(e){await signOut();throw e;}}
export async function signOut(){const old=session;session=null;expires=0;if(old){const c=config();await fetch(`${c.url}/auth/v1/logout`,{method:'POST',headers:{apikey:c.key,Authorization:`Bearer ${old.access_token}`}}).catch(()=>{});}}
export async function adminRequest(path:string,options:RequestInit={}){
const c=config();if(!session)throw new Error('Sign in to continue.');if(Date.now()>expires-60000){if(!refreshing)refreshing=token({refresh_token:session.refresh_token},'refresh_token').finally(()=>{refreshing=null;});await refreshing;}
const response=await fetch(c.url+path,{...options,headers:{apikey:c.key,Authorization:`Bearer ${session!.access_token}`,'Content-Type':'application/json',...options.headers}});
if(!response.ok)throw new Error(response.status===401?'Your session expired. Sign in again.':response.status===403?'You do not have permission for this action.':response.status===409?'That property URL is already in use. Choose another.':'The update could not be completed. Check the information and try again.');
const text=await response.text();return text?JSON.parse(text):null;
}
export async function uploadPhoto(file:File){
if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>6*1024*1024)throw new Error('Use JPEG, PNG or WebP photographs under 6 MB.');
// Unique names prevent overwriting cached photos or another listing's image.
const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp',path=`properties/${crypto.randomUUID()}.${ext}`;
await adminRequest('/storage/v1/object/property-images/'+path,{method:'POST',headers:{'Content-Type':file.type,'x-upsert':'false'},body:file});
return `${config().url}/storage/v1/object/public/property-images/${path}`;
}
