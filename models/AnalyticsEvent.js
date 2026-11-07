import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ['page_view', 'project_open', 'resume_click', 'contact_submission'], required: true },
  visitorId: String,
  sessionId: String,
  path: { type: String, maxlength: 256 },
  source: { type: String, maxlength: 100 },
  resource: { type: String, maxlength: 240 },
  createdAt: { type: Date, default: Date.now, index: true },
});
AnalyticsEventSchema.index({ type: 1, createdAt: -1 });
export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);
