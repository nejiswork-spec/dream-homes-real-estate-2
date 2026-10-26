import {test} from 'node:test';
import assert from 'node:assert/strict';
import {examples,filterProperties,normalizeProperty} from '../src/catalogue.ts';
import {validateEnquiry} from '../supabase/functions/_shared/enquiry.ts';
test('combines location, purpose, bedrooms and inclusive price bounds',()=>{
 const properties=[...examples,{...examples[0],id:'rental',purpose:'Rent' as const,price:6000000}];
 assert.deepEqual(filterProperties(properties,new URLSearchParams('city=Lagos&purpose=Rent&beds=5&min=6000000&max=6000000')).map(p=>p.id),['rental']);
 assert.equal(filterProperties(properties,new URLSearchParams('purpose=Rent&beds=6')).length,0);
});
test('retains old budget boundaries and combines saved filters',()=>{
 assert.deepEqual(filterProperties(examples,new URLSearchParams('budget=100')).map(p=>p.id),['garden-bungalow']);
 assert.equal(filterProperties(examples,new URLSearchParams('city=Lagos'),['garden-bungalow'],true).length,0);
 assert.equal(filterProperties(examples,new URLSearchParams(),['oceanview-villa'],true).length,1);
 assert.equal(filterProperties(examples,new URLSearchParams('min=450000001&max=400000000')).length,0);
});
test('rejects invalid public records and unsafe cover URLs',()=>{
 assert.throws(()=>normalizeProperty({...examples[0],price:-1}));
 assert.throws(()=>normalizeProperty({...examples[0],beds:2.5}));
 assert.throws(()=>normalizeProperty({...examples[0],image:'javascript:alert(1)'}));
 assert.throws(()=>normalizeProperty({...examples[0],id:'../../escape'}));
 assert.equal(normalizeProperty({...examples[0],images:[examples[0].image,examples[0].image]}).images.length,1);
});
const valid={name:'Test Person',email:'TEST@example.com',phone:'',intent:'Viewing',message:'Please confirm the available viewing dates.',property_id:'oceanview-villa',preferred_date:'2026-10-25',consent:true,website:''};
test('enquiry validation normalises email and preserves a valid viewing request',()=>{
 const result=validateEnquiry(valid,'2026-10-24');assert.equal(result.email,'test@example.com');assert.equal(result.phone,null);assert.equal(result.preferred_date,'2026-10-25');
});
test('rejects missing consent, spam traps, invalid dates and oversized input',()=>{
 for(const change of [{consent:false},{website:'spam'},{preferred_date:'2026-10-23'},{preferred_date:'2026-02-30'},{email:'invalid'},{message:'a'.repeat(3001)},{property_id:'bad/slug'}])assert.throws(()=>validateEnquiry({...valid,...change},'2026-10-24'));
});
