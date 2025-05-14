import mongoose from 'mongoose';

const newsletterSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Newsletter', newsletterSchema);