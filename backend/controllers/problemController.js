const Problem = require('../models/Problem');
const { 
  generateBubbleSortSteps, 
  generateSelectionSortSteps, 
  generateInsertionSortSteps, 
  generateBinarySearchSteps, 
  generateTwoPointerSteps 
} = require('../utils/generateSteps');

exports.getProblems = async (req, res) => {
  try {
    const filter = req.query.topicId ? { topicId: req.query.topicId } : {};
    const problems = await Problem.find(filter).select('title difficulty topicId animationType');
    res.status(200).json({ success: true, data: problems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate('topicId', 'name');
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const { animationType, testCases } = req.body;
    
    if (animationType && testCases && testCases.length > 0) {
      const firstInput = testCases[0].input;
      let steps = [];

      switch (animationType) {
        case 'bubble-sort':
          steps = generateBubbleSortSteps(firstInput[0]);
          break;
        case 'selection-sort':
          steps = generateSelectionSortSteps(firstInput[0]);
          break;
        case 'insertion-sort':
          steps = generateInsertionSortSteps(firstInput[0]);
          break;
        case 'binary-search':
          steps = generateBinarySearchSteps(firstInput[0], firstInput[1]);
          break;
        case 'two-pointer':
          steps = generateTwoPointerSteps(firstInput[0], firstInput[1]);
          break;
      }

      if (steps.length > 0) {
        req.body.algorithmSteps = steps;
      }
    }

    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.status(200).json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
