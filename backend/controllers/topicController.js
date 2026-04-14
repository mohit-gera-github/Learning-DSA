const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    
    await Problem.deleteMany({ topicId: req.params.id });
    await topic.deleteOne();
    
    res.status(200).json({ success: true, message: 'Topic and associated problems deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
