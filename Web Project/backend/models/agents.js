import mongoose from 'mongoose';
import Agent from '../models/agent.js';

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const agents = await Agent.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Agent.countDocuments();
    
    res.status(200).json({
      agents,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalAgents: total
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a single agent by ID
export const getAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    const agent = await Agent.findById(id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new agent
export const createAgent = async (req, res) => {
  try {
    const agent = req.body;
    
    const newAgent = new Agent({
      ...agent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    await newAgent.save();
    
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Update an agent
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    const updatedAgent = await Agent.findByIdAndUpdate(
      id, 
      { ...agent, updatedAt: new Date().toISOString() }, 
      { new: true }
    );
    
    res.status(200).json(updatedAgent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    await Agent.findByIdAndRemove(id);
    
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

console.log('Agent controller loaded');