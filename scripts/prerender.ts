import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {loadEnv} from 'vite';
import {examples,normalizeProperty,type Property,money} from '../src/catalogue.ts';
import {pageMetadata} from '../src/seo.ts';
const env={...loadEnv('production',process.cwd(),''),...process.env};
const url=env.VITE_SUPABASE_URL,key=env.VITE_SUPABASE_PUBLISHABLE_KEY||env.VITE_SUPABASE_ANON_KEY;
let properties:Property[]=examples,demo=true;
if(url||key){if(!url||!key)throw new Error('Both Supabase URL and public key are required.');const response=await fetch(`${url.replace(/\/$/,'')}/rest/v1/properties?select=*&published=eq.true&order=created_at.desc`,{headers:{apikey:key},signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Published property metadata could not be fetched. Build stopped.');const rows:unknown=await response.json();if(!Array.isArray(rows))throw new Error('Invalid property response.');properties=rows.map(normalizeProperty);demo=false;}
let site:string|null=null;if(env.VITE_SITE_URL){const candidate=new URL(env.VITE_SITE_URL);if(candidate.protocol!=='https:')throw new Error('VITE_SITE_URL must be a public HTTPS origin.');site=candidate.origin;}
const escape=(value:unknown)=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const template=await readFile('dist/index.html','utf8');
const nav='<nav aria-label="Main navigation"><a href="/">DreamHomes</a> · <a href="/listings">Properties</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></nav>';
const cards=properties.map(p=>`<article><h2><a href="/property/${escape(p.id)}">${escape(p.name)}</a></h2><img src="${escape(p.image)}" alt="${escape(p.name)}" width="600"/><p>${escape(p.location)} · ${escape(money(p.price))}${p.purpose==='Rent'?' per year':''} · ${p.beds} bedrooms</p></article>`).join('');
const routes=['/','/listings','/about','/contact','/privacy','/terms','/admin',...properties.map(p=>'/property/'+p.id)];
for(const route of routes){const property=properties.find(p=>route==='/property/'+p.id),meta=pageMetadata(route,property),noindex=demo||route==='/admin';
 let body=`<h1>${escape(meta.title.split(' | ')[0])}</h1><p>${escape(meta.description)}</p>`;
 if(route==='/'||route==='/listings')body+=cards;
 if(property)body+=`<img src="${escape(property.image)}" alt="${escape(property.name)}" width="900"/><p>${escape(money(property.price))}${property.purpose==='Rent'?' per year':''} · ${property.beds} bedrooms · ${property.baths} bathrooms · ${property.area} m²</p><p>Availability: ${escape(property.availability)}</p><p>${escape(property.description)}</p><h2>Amenities</h2><ul>${property.amenities.map(v=>'<li>'+escape(v)+'</li>').join('')}</ul><h2>Neighbourhood</h2><p>${escape(property.neighbourhood)}</p><h2>Document information</h2><p>${escape(property.documentation)}</p><a href="/contact?property_id=${property.id}&amp;property=${encodeURIComponent(property.name)}&amp;intent=viewing">Request a viewing</a>`;
 if(demo)body+='<p>Sample properties. Availability, photographs and details are illustrative.</p>';
 let head=`<meta name="robots" content="${noindex?'noindex,follow':'index,follow'}"/><meta property="og:title" content="${escape(meta.title)}"/><meta property="og:description" content="${escape(meta.description)}"/>`;
 if(site)head+=`<link rel="canonical" href="${site+route}"/><meta property="og:url" content="${site+route}"/>`;
 if(property&&!demo){head+=`<meta property="og:image" content="${escape(property.image)}"/>`;const structured={'@context':'https://schema.org','@type':property.type==='Apartment'?'Apartment':'House',name:property.name,image:property.images,description:property.description,numberOfBedrooms:property.beds,address:{'@type':'PostalAddress',streetAddress:property.location,addressCountry:'NG'}};head+=`<script type="application/ld+json" data-property-jsonld="true">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>`;}
 const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(meta.title)}</title>`).replace(/<meta name="description"[^>]*\/>/,`<meta name="description" content="${escape(meta.description)}"/>`).replace('</head>',head+'</head>').replace('<div id="root"></div>',`<div id="root">${nav}<main>${body}</main><footer>DreamHomes</footer></div>`);
 const directory=resolve('dist','.'+route);await mkdir(directory,{recursive:true});await writeFile(resolve(directory,'index.html'),html);
}
const indexable=!demo&&site;await writeFile('dist/robots.txt',indexable?`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${site}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
const sitemapRoutes=indexable?routes.filter(v=>v!=='/admin'):[];await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapRoutes.map(route=>`<url><loc>${escape(site+route)}</loc></url>`).join('')}</urlset>`);
console.log(`Prepared ${routes.length} static page entries; ${demo?'sample data, indexing disabled':'published Supabase data'}.`);
