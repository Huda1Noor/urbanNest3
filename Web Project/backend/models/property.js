import mongoose from 'mongoose';

const propertySchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  description: { type: String, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  squareFeet: { type: Number, required: true },
  propertyType: { type: String, required: true }, // e.g., House, Apartment, Condo
  status: { type: String, required: true }, // For Sale, For Rent, Sold
  features: [String], // Array of features
  images: [String], // Array of image URLs
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);