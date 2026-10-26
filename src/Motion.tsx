import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function Motion({route}:{route:string}) {
 useEffect(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const lenis=new Lenis({autoRaf:false,anchors:true,duration:1.05});
   const tick=(time:number)=>lenis.raf(time*1000);
   lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(tick);
   const context=gsap.context(()=>{
    if(document.querySelector('.hero')){
     gsap.from('.hero-copy > *',{y:28,opacity:0,stagger:0.11,duration:0.9,ease:'power3.out',clearProps:'all'});
     gsap.to('.hero-photo',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    }
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{y:24,opacity:0,duration:0.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'}));
   });
   return ()=>{context.revert();gsap.ticker.remove(tick);lenis.destroy();};
  });
  return ()=>media.revert();
 },[route]); return null;
}
