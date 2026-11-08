import { isIP } from 'net';
const text=(value,max=180)=>typeof value==='string'?value.replace(/[\x00-\x1f]/g,' ').trim().slice(0,max):'';
function safePage(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?`${url.origin}${url.pathname}`.slice(0,500):''}catch{return ''}}
export function visitorAlert(body,headers){
 const raw=headers.get('x-vercel-forwarded-for')||headers.get('x-forwarded-for')||headers.get('x-real-ip')||'';
 const candidate=raw.split(',')[0].trim();const ip=isIP(candidate)?candidate:null;
 const decode=value=>{try{return decodeURIComponent(value||'')}catch{return ''}};
 const location=[headers.get('x-vercel-ip-city'),headers.get('x-vercel-ip-country-region'),headers.get('x-vercel-ip-country')].map(decode).map(v=>text(v,80)).filter(Boolean).join(', ');
 const fields=[];const add=(name,value,inline=true)=>{const cleaned=text(value,600);if(cleaned)fields.push({name,value:cleaned,inline})};
 add('🌍 Approximate location',location||'Not provided by hosting');add('🌐 Request IP',ip||'Unavailable');
 add('💻 Device',body.device);add('🔍 Browser',body.browser);add('⚙️ Operating system',body.os);add('📱 Model',body.model);
 add('🕰️ Visitor timezone',body.timezone);add('🗣️ Languages',body.languages);add('📐 Screen / viewport',body.display);add('📶 Connection',body.connection);
 add('🔗 Page',safePage(body.url),false);add('↗️ Referrer',safePage(body.referrer)||'Direct / not supplied',false);
 const campaign=body.campaign; if(campaign&&typeof campaign==='object')add('🏷️ Campaign', ['source','medium','campaign'].map(k=>typeof campaign[k]==='string'&&/^[a-z0-9 _.-]{1,80}$/i.test(campaign[k])?`${k}: ${campaign[k]}`:'').filter(Boolean).join(' · '),false);
 add('⏰ Nepal time',new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kathmandu',dateStyle:'medium',timeStyle:'short'}).format(new Date()));
 return {title:'🐾 Footprints detected',description:ip?`[Request IP details](https://ipinfo.io/${encodeURIComponent(ip)})`:'A visitor opened your portfolio.',color:5814783,fields,timestamp:new Date().toISOString(),footer:{text:'Portfolio · One alert per browser tab · Location is approximate; browser details are self-reported'}};
}
