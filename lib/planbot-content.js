import connect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { personalData } from '@/utils/data/personal-data';
import { experiences } from '@/utils/data/experience';
import { GET as githubData } from '@/app/api/github/route';
import { bounded } from '@/lib/chat-recording';
import sanitizeHtml from 'sanitize-html';

export function plainText(html) {
  return sanitizeHtml(String(html || ''), { allowedTags: [], allowedAttributes: {}, nonTextTags: ['script','style','textarea','noscript'] })
    .replace(/&#(\d+);/g,(_,n)=>Number(n)<=1114111?String.fromCodePoint(Number(n)):' ')
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
}
const terms = value => [...new Set(String(value).toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)||[])].filter(word=>!['the','and','about','what','tell','with','does','have','that','this','plan','blog','posts','please'].includes(word)).slice(0,30);
export function selectPosts(posts, question) {
  const words=terms(question);
  return posts.map((post,index)=>({post,index,score:words.reduce((sum,word)=>sum+(String(post.title).toLowerCase().includes(word)?5:0)+(String(post.description).toLowerCase().includes(word)?2:0)+(post.tags||[]).some(tag=>String(tag).toLowerCase().includes(word))*3,0)})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,3).map(item=>item.post);
}
export function excerpt(content,question) {
 const text=plainText(content),words=terms(question);
 if(text.length<=3000)return text;
 const chunks=text.match(/.{1,900}(?:\s|$)/g)||[text.slice(0,900)];
 const selected=chunks.map((text,index)=>({text,index,score:words.reduce((sum,word)=>sum+(text.toLowerCase().includes(word)?1:0),0)})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,3).sort((a,b)=>a.index-b.index);
 return selected.map(item=>item.text).join(' […] ').slice(0,3000);
}
export async function loadPortfolioContent(question) {
 const result={retrievedAt:new Date().toISOString(),website:{url:'https://www.plan.com.np',about:personalData.aboutText,description:personalData.description,areas:experiences.map(({title,description,activities,technologies,duration})=>({title,description,activities,technologies,duration}))},blogs:{available:false,catalog:[],articles:[]},github:{available:false}};
 await Promise.allSettled([
 (async()=>{if(!process.env.MONGODB_URI)return;result.blogs=await bounded(async()=>{await connect();const catalog=await Blog.find({published:true},{title:1,slug:1,description:1,tags:1,createdAt:1,updatedAt:1}).sort({createdAt:-1}).limit(50).maxTimeMS(2000).lean();let matches=[];const search=terms(question).join(' ');if(search){try{matches=await Blog.find({published:true,$text:{$search:search}},{title:1,slug:1,description:1,tags:1,score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}}).limit(6).maxTimeMS(1000).lean()}catch{}}const candidates=[...new Map([...matches,...catalog].map(post=>[String(post._id),post])).values()];const chosen=selectPosts(candidates,question);const documents=chosen.length?await Blog.find({published:true,_id:{$in:chosen.map(p=>p._id)}},{title:1,slug:1,content:1}).maxTimeMS(1500).lean():[];return {available:true,catalog:[...new Map([...catalog.slice(0,12),...chosen].map(post=>[String(post._id),post])).values()].map(({_id,...post})=>({...post,description:plainText(post.description).slice(0,120),tags:(post.tags||[]).slice(0,5),url:`https://www.plan.com.np/blog/${encodeURIComponent(post.slug)}`})),articles:documents.map(post=>({title:post.title,url:`https://www.plan.com.np/blog/${encodeURIComponent(post.slug)}`,excerpt:excerpt(post.content,question)}))}},6500)})(),
 (async()=>{const response=await bounded(()=>githubData(),3500);if(!response.ok)return;const data=await response.json();if(data.success)result.github={available:true,profile:data.profile,projects:(data.projects||[]).slice(0,6).map(({name,description,code,demo,tools,updatedAt})=>({name,description:String(description||'').slice(0,240),code,demo,tools,updatedAt})),skills:data.skills}})(),
 ]);
 return result;
}
