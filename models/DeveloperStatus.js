import mongoose from 'mongoose';
const schema = new mongoose.Schema({ _id: String, availability: { type: String, default: 'Open to Opportunities' }, discord: { type: Boolean, default: false }, spotify: { type: Boolean, default: false } });
export default mongoose.models.DeveloperStatus || mongoose.model('DeveloperStatus', schema);
