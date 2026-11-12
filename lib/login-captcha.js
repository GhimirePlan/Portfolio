import { contactConfig } from '@/lib/contact-config';
export async function verifyLoginCaptcha(token){
 const c=contactConfig();
 if(!c.captchaReady||typeof token!=='string'||!token||token.length>10000)return false;
 try{const r=await fetch('https://www.google.com/recaptcha/api/siteverify',{method:'POST',body:new URLSearchParams({secret:c.secret,response:token}),cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)return false;const d=await r.json();const age=Date.now()-Date.parse(d.challenge_ts);return d.success===true&&typeof d.score==='number'&&d.score>=.5&&d.action==='admin_login'&&c.hosts.has(String(d.hostname||'').toLowerCase())&&Number.isFinite(age)&&age>=-60000&&age<=120000;}catch{return false}
}
