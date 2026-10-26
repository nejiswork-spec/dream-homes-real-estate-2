import {useEffect} from 'react';
import type {Property} from './catalogue';
import {pageMetadata} from './seo';
export function Metadata({route,property,demo}:{route:string;property?:Property;demo:boolean}){
useEffect(()=>{
const meta=pageMetadata(route,property);document.title=meta.title;
const set=(name:string,content:string,propertyTag=false)=>{const attr=propertyTag?'property':'name';let el=document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attr,name);document.head.appendChild(el);}el.content=content;};
set('description',meta.description);set('og:title',meta.title,true);set('og:description',meta.description,true);set('og:type','website',true);
const noindex=demo||meta.path==='/admin'||route.includes('?');set('robots',noindex?'noindex,follow':'index,follow');
const base=import.meta.env.VITE_SITE_URL;let canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');if(base){if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=new URL(meta.path,base).href;set('og:url',canonical.href,true);}else canonical?.remove();
document.querySelectorAll('script[data-property-jsonld]').forEach(e=>e.remove());
if(property&&!demo){const script=document.createElement('script');script.type='application/ld+json';script.dataset.propertyJsonld='true';script.textContent=JSON.stringify({'@context':'https://schema.org','@type':property.type==='Apartment'?'Apartment':'House',name:property.name,description:property.description,image:property.images,numberOfBedrooms:property.beds,floorSize:{'@type':'QuantitativeValue',value:property.area,unitCode:'MTK'},address:{'@type':'PostalAddress',streetAddress:property.location,addressCountry:'NG'}});document.head.appendChild(script);set('og:image',property.image,true);}else document.querySelector('meta[property="og:image"]')?.remove();
},[route,property,demo]);return null;
}
