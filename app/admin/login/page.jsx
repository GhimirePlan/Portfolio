import { redirect } from 'next/navigation';
export default function LegacyLogin({searchParams}){
 const query=new URLSearchParams();
 for(const key of ['callbackUrl','error'])if(typeof searchParams?.[key]==='string')query.set(key,searchParams[key]);
 redirect('/login'+(query.size?'?'+query.toString():''));
}
