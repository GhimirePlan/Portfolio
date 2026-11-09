'use client';
import { useEffect, useState } from 'react';
import { personalData } from '@/utils/data/personal-data';
export default function OwnerAvailability(){
 const [presence,setPresence]=useState(null);
 useEffect(()=>{
  let active=true,sequence=0;const controller=new AbortController();
  async function refresh(){if(document.visibilityState!=='visible')return;const current=++sequence;try{const r=await fetch('/api/developer-status',{cache:'no-store',signal:controller.signal});if(!r.ok)throw Error();const data=await r.json();if(active&&current===sequence)setPresence(data.discord?data.presence:null)}catch{if(active&&current===sequence)setPresence(null)}}
  const visible=()=>{if(document.visibilityState==='visible'){setPresence(null);refresh()}};
  refresh();const timer=setInterval(refresh,60000);document.addEventListener('visibilitychange',visible);
  return()=>{active=false;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',visible)};
 },[]);
 if(presence!=='online')return null;
 return <aside className="planbot-owner" aria-label="Contact Plan directly" role="status"><span className="planbot-owner-dot" aria-hidden="true"/><div><strong>Plan is online on Discord</strong><p>Continue with PlanBot here, or message Plan directly on WhatsApp.</p></div><a href={`https://wa.me/${personalData.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">Message Plan ↗</a></aside>;
}
