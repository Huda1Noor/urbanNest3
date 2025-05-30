import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' }, // unread, read, responded
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contact', contactSchema);