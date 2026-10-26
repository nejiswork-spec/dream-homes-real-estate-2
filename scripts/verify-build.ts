import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadEnv} from 'vite';
const env={...loadEnv('production',process.cwd(),''),...process.env};
const connected=!!env.VITE_SUPABASE_URL;
const home=await readFile('dist/index.html','utf8');
if(connected){
 assert.match(home,/<title>DreamHomes \| Homes to buy and rent in Nigeria<\/title>/);
 assert.match(home,/<link rel="canonical"/);
 assert.doesNotMatch(home,/Sample properties\. Availability/);
 const admin=await readFile('dist/admin/index.html','utf8');assert.match(admin,/noindex,follow/);
 const sitemap=await readFile('dist/sitemap.xml','utf8');assert.doesNotMatch(sitemap,/<loc>[^<]*\/admin<\/loc>/);
 assert.match(await readFile('dist/robots.txt','utf8'),/Disallow: \/admin/);
 for(const match of home.matchAll(/href="(\/property\/[a-z0-9-]+)"/g)){
  const property=await readFile(`dist${match[1]}/index.html`,'utf8');
  assert.match(property,/Request a viewing/);assert.match(property,/data-property-jsonld="true"/);
 }
 console.log('Connected build metadata, canonical URL, admin noindex and property links passed.');
}else{
const page=await readFile('dist/property/oceanview-villa/index.html','utf8');
assert.match(page,/<title>Oceanview Luxury Villa in Lekki Phase 1, Lagos \| DreamHomes<\/title>/);
assert.match(page,/<meta name="description" content="5 bedrooms/);
assert.match(page,/Request a viewing/);
assert.match(page,/<h2>Document information<\/h2>/);
assert.match(page,/noindex,follow/);
assert.match(home,/href="\/property\/oceanview-villa"/);
assert.equal((await readFile('dist/robots.txt','utf8')).includes('Disallow: /'),true);
console.log('Static property URL, description, property content, links and sample noindex checks passed.');
}
