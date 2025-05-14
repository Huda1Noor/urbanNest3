// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// ——— ES Modules __dirname Fix ———
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ——— Middleware ———
app.use(cors());
app.use(express.json());

// ——— Serve Frontend ———
const staticPath = path.resolve(__dirname, '../frontend');
app.use(express.static(staticPath));

// Fallback for root
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// ——— MongoDB Connection ———
mongoose.connect('mongodb://localhost:27017/huda_web', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// ——— Mongoose Model ———
const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  price:       { type: Number, required: true },
  location:    { type: String, required: true },
  description: { type: String },
  imageUrl:    { type: String }
});
const Property = mongoose.model('Property', propertySchema);

// ——— CRUD Endpoints ———

// Create a new property
app.post('/api/properties', async (req, res) => {
  try {
    const prop = new Property(req.body);
    const saved = await prop.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all properties
app.get('/api/properties', async (req, res) => {
  try {
    const all = await Property.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const one = await Property.findById(req.params.id);
    if (!one) return res.status(404).json({ error: 'Not found' });
    res.json(one);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update by ID
app.put('/api/properties/:id', async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete by ID
app.delete('/api/properties/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ——— Start Server ———
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
