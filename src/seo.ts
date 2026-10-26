import type {Property} from './catalogue';
export function pageMetadata(route:string,property?:Property){
const path=route.split('?')[0];
const titles:Record<string,string>={'/':'DreamHomes | Homes to buy and rent in Nigeria','/listings':'Properties for sale and rent | DreamHomes','/about':'About DreamHomes | Property discovery in Nigeria','/contact':'Property enquiries and viewing requests | DreamHomes','/privacy':'Privacy information | DreamHomes','/terms':'Website information | DreamHomes','/admin':'Property management | DreamHomes'};
return {title:property?`${property.name} in ${property.location} | DreamHomes`:titles[path]||'Property not found | DreamHomes',description:property?`${property.beds} bedrooms, ${property.baths} bathrooms, ${property.area} m² in ${property.location}. View photographs and request a viewing.`:'Compare homes across Nigeria by location, price and bedrooms. Review property details, save a shortlist and request a viewing.',path};
}
