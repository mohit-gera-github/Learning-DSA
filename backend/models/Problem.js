const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'A problem must belong to a topic']
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: '{VALUE} is not a valid difficulty'
    }
  },
  description: {
    type: String, // Markdown supported
    required: true
  },
  testCases: [{
    label: String,
    input: [mongoose.Schema.Types.Mixed],
    description: String
  }],
  animationType: {
    type: String,
    required: true,
    enum: [
      'bubble-sort',
      'selection-sort',
      'insertion-sort',
      'binary-search',
      'two-pointer',
      'array-traversal',
      'tree', 
      'graph', 
      'stack-queue', 
      'string', 
      'sliding-window'
    ]
  },
  algorithmSteps: [{
    stepIndex: { type: Number, required: true },
    description: { type: String, required: true },
    arrayState: [Number],
    highlightIndices: [Number],
    swapIndices: [Number], 
    pointerPositions: {
      type: Map,
      of: Number
    }
  }],
  code: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

problemSchema.index({ topicId: 1 });

module.exports = mongoose.model('Problem', problemSchema);
