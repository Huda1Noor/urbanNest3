import mongoose from 'mongoose';
import Property from '../models/property.js';

// Get all properties with optional filtering
export const getProperties = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      minPrice, 
      maxPrice, 
      beds, 
      baths, 
      propertyType, 
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }
    
    if (beds) filter.beds = Number(beds);
    if (baths) filter.baths = Number(baths);
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const properties = await Property.find(filter)
      .sort(sortObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('agent', 'name email phone image');
    
    // Get total count for pagination
    const total = await Property.countDocuments(filter);
    
    res.status(200).json({
      properties,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProperties: total
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a single property by ID
export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const property = await Property.findById(id).populate('agent', 'name email phone image bio position');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(property);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const property = req.body;
    
    const newProperty = new Property({
      ...property,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    await newProperty.save();
    
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update a property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(
      id, 
      { ...property, updatedAt: new Date().toISOString() }, 
      { new: true }
    );
    
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Delete a property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    await Property.findByIdAndRemove(id);
    
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const properties = await Property.find()
      .sort({ price: -1 })
      .limit(Number(limit))
      .populate('agent', 'name');
    
    res.status(200).json(properties);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

console.log('Property controller loaded');