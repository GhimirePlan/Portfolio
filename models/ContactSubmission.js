import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String, email: String, message: String, createdAt: {type:Date,default:Date.now,index:true}, emailStatus:{type:String,default:'pending'}, discordSent:{type:Boolean,default:false} });
export default mongoose.models.ContactSubmission || mongoose.model('ContactSubmission',schema);
