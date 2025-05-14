import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String, required: true },
  categories: [String],
  tags: [String],
  comments: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Blog', blogSchema);