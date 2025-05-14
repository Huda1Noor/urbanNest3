import mongoose from 'mongoose';

const testimonialSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Testimonial', testimonialSchema);