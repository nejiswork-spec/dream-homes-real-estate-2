export const readRoute=()=>typeof window==='undefined'?'/':location.pathname+location.search;
export function go(path:string){history.pushState(null,'',path);window.dispatchEvent(new PopStateEvent('popstate'));}
export function installNavigation(onRoute:()=>void){
if(location.hash.startsWith('#/'))history.replaceState(null,'',location.hash.slice(1));
const click=(e:MouseEvent)=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const link=(e.target as Element)?.closest<HTMLAnchorElement>('a[href]');if(!link||link.target||link.hasAttribute('download')||link.getAttribute('href')?.startsWith('#'))return;const url=new URL(link.href);if(url.origin!==location.origin)return;e.preventDefault();go(url.pathname+url.search+url.hash);};
document.addEventListener('click',click);window.addEventListener('popstate',onRoute);onRoute();return()=>{document.removeEventListener('click',click);window.removeEventListener('popstate',onRoute);};}
