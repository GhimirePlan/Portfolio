import connect from '@/lib/mongodb';
import Submission from '@/models/ContactSubmission';
import { bounded } from '@/lib/chat-recording';
import { sendDiscordEmbed, chatHistoryUrl } from '@/lib/discord';
export async function saveContact(body) {
 if(!process.env.MONGODB_URI)return null;
 try{return await bounded(async()=>{await connect();return Submission.create(body)},2500)}catch{return null}
}
export async function notifyContact(record) {
 if(!record)return;
 const url=chatHistoryUrl('unused').replace('/admin/chats/unused',`/admin/inbox/${record._id}`);
 const sent=await sendDiscordEmbed({title:'📨 New portfolio contact submission',url,description:`[Read and reply in your admin inbox](${url})`,fields:[{name:'Inbox',value:'Submission saved securely',inline:true},{name:'Email',value:'Delivery attempted separately',inline:true}],color:1752220,timestamp:new Date().toISOString()});
 await updateContact(record._id,{discordSent:sent});
}
export async function updateContact(id,fields){if(!id)return;try{await bounded(()=>Submission.updateOne({_id:id},{$set:fields},{maxTimeMS:1000}),1500)}catch{}}
