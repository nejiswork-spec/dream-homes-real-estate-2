import {validateEnquiry} from '../_shared/enquiry.ts';
// Deploy to Supabase Edge Functions. Secrets stay on the server.
Deno.serve(async(request:Request)=>{
const origin=request.headers.get('origin')||'',allowed=(Deno.env.get('ALLOWED_ORIGINS')||'').split(',').map(v=>v.trim()).filter(Boolean);
const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':allowed.includes(origin)?origin:'null','Access-Control-Allow-Headers':'content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
const reply=(status:number,body:Record<string,unknown>)=>new Response(JSON.stringify(body),{status,headers});
if(!origin||!allowed.includes(origin))return reply(403,{error:'Origin not allowed.'});if(request.method==='OPTIONS')return new Response(null,{status:204,headers});if(request.method!=='POST')return reply(405,{error:'Method not allowed.'});
const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),secret=Deno.env.get('ENQUIRY_RATE_SECRET');
if(!url||!key||!secret)return reply(503,{error:'Enquiry service is not configured.'});
try{
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'JSON required.'});
 const reader=request.body?.getReader();if(!reader)return reply(400,{error:'Missing enquiry.'});const chunks:Uint8Array[]=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>16000){await reader.cancel();return reply(413,{error:'Enquiry too large.'});}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const payload=validateEnquiry(JSON.parse(new TextDecoder().decode(bytes)),today);
 const ip=request.headers.get('x-forwarded-for')?.split(',').map(s=>s.trim()).filter(Boolean).at(-1);if(!ip)return reply(503,{error:'Unable to validate request.'});
 const hmac=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',hmac,new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('');
 const response=await fetch(`${url}/rest/v1/rpc/receive_enquiry`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({payload,client_hash:await hash(ip),email_hash:await hash(payload.email)})});
 if(!response.ok){const result=await response.json().catch(()=>({}));return reply(result.message==='RATE_LIMIT'?429:400,{error:result.message==='RATE_LIMIT'?'Too many enquiries.':'Enquiry could not be saved.'});}
 return reply(201,{ok:true});
}catch{return reply(400,{error:'Please check your enquiry details.'});}
});
