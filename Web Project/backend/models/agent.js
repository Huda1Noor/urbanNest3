import mongoose from 'mongoose';

const agentSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  position: { type: String, required: true }, // e.g., Real Estate Agent, Broker
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Agent', agentSchema);