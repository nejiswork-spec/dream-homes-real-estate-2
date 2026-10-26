import React,{useState} from 'react';
import {Search} from 'lucide-react';
import {go} from './router';
export function SearchForm({initial=''}:{initial?:string}){
const params=new URLSearchParams(initial),[error,setError]=useState('');
return <form className="search-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget),min=String(data.get('min')||''),max=String(data.get('max')||'');if(min&&max&&Number(min)>Number(max)){setError('Maximum price must be at least the minimum price.');return;}setError('');const query=new URLSearchParams();data.forEach((value,key)=>{if(String(value))query.set(key,String(value));});go('/listings'+(query.size?'?'+query:''));}}>
<label>Buy or rent<select name="purpose" defaultValue={params.get('purpose')||''}><option value="">Buy or rent</option><option value="Buy">Buy</option><option value="Rent">Rent</option></select></label>
<label>Location<select name="city" defaultValue={params.get('city')||''}><option value="">All locations</option>{['Lagos','Abuja','Ogun','Rivers'].map(v=><option key={v}>{v}</option>)}</select></label>
<label>Property type<select name="type" defaultValue={params.get('type')||''}><option value="">All types</option>{['Villa','Apartment','Bungalow','Duplex','Land'].map(v=><option key={v}>{v}</option>)}</select></label>
<label>Bedrooms<select name="beds" defaultValue={params.get('beds')||''}><option value="">Any bedrooms</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}+ bedrooms</option>)}</select></label>
<label>Minimum price (₦)<input name="min" type="number" inputMode="numeric" min="0" step="1" defaultValue={params.get('min')||''} placeholder="No minimum"/></label>
<label>Maximum price (₦)<input name="max" type="number" inputMode="numeric" min="0" step="1" defaultValue={params.get('max')||''} placeholder="No maximum"/></label>
<button className="button" type="submit"><Search size={18}/> Search</button><p className="search-hint">Rental prices are per year. {error&&<span role="alert">{error}</span>}</p></form>;}
