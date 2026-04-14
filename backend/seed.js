const mongoose = require('mongoose');
require('dotenv').config();
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Topic.deleteMany({});
    await Problem.deleteMany({});
    console.log('Cleared existing data.');

    const topicsData = [
      { name: 'Arrays', icon: '🔢', order: 1, description: 'Fundamental linear data structure stored in contiguous memory.' },
      { name: 'Strings', icon: '🔤', order: 2, description: 'Sequences of characters and common manipulation algorithms.' },
      { name: 'Sorting', icon: '📊', order: 3, description: 'Algorithms for arranging data in a specific order.' },
      { name: 'Linked Lists', icon: '🔗', order: 4, description: 'Linear collection of data elements cuya order is not given by their physical placement.' },
      { name: 'Stacks & Queues', icon: '📚', order: 5, description: 'LIFO and FIFO data structures for specialized access patterns.' },
      { name: 'Trees', icon: '🌲', order: 6, description: 'Hierarchical structure with nodes and edges.' },
      { name: 'Graphs', icon: '🕸️', order: 7, description: 'Collections of vertices connected by edges.' },
      { name: 'Dynamic Programming', icon: '⚡', order: 8, description: 'Optimization method for complex problems by breaking them into simpler subproblems.' }
    ];

    const createdTopics = await Topic.create(topicsData);
    console.log(`Seeded ${createdTopics.length} topics.`);

    const sortingTopic = createdTopics.find(t => t.name === 'Sorting');
    const arrayTopic = createdTopics.find(t => t.name === 'Arrays');

    const problemsData = [
      {
        topicId: sortingTopic._id,
        title: 'Bubble Sort',
        difficulty: 'Easy',
        description: 'Sort an array by repeatedly swapping adjacent elements if they are in the wrong order.',
        animationType: 'sorting',
        testCases: [
          { label: 'Unsorted', input: [5, 3, 8, 1, 2], description: 'Standard unsorted array' },
          { label: 'Reversed', input: [9, 7, 5, 4, 2, 1], description: 'Worst case' },
          { label: 'Small', input: [3, 1, 2], description: 'Minimal case' }
        ],
        algorithmSteps: [
          { stepIndex: 0, description: 'Starting Bubble Sort on [5, 3, 8, 1, 2]', highlightIndices: [] },
          { stepIndex: 1, description: 'Compare 5 and 3. 5 > 3, so swap.', highlightIndices: [0, 1], swapIndices: [0, 1] },
          { stepIndex: 2, description: 'Array is now [3, 5, 8, 1, 2]. Compare 5 and 8.', highlightIndices: [1, 2] },
          { stepIndex: 3, description: '5 < 8, no swap needed. Compare 8 and 1.', highlightIndices: [2, 3] },
          { stepIndex: 4, description: '8 > 1, so swap.', highlightIndices: [2, 3], swapIndices: [2, 3] },
          { stepIndex: 5, description: 'Array is now [3, 5, 1, 8, 2]. Compare 8 and 2.', highlightIndices: [3, 4] },
          { stepIndex: 6, description: '8 > 2, so swap. 8 is now at its correct position.', highlightIndices: [3, 4], swapIndices: [3, 4] }
        ],
        code: {
          javascript: 'function bubbleSort(arr) {\n  for(let i=0; i<arr.length; i++) {\n    for(let j=0; j<arr.length-i-1; j++) {\n      if(arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n    }\n  }\n  return arr;\n}',
          python: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr'
        }
      },
      {
        topicId: sortingTopic._id,
        title: 'Binary Search',
        difficulty: 'Medium',
        description: 'Find the position of a target value within a sorted array using a divide and conquer approach.',
        animationType: 'array-traversal',
        testCases: [
          { label: 'Target Found', input: [1, 2, 3, 5, 8, 10, 12], description: 'Target: 8' },
          { label: 'Not Found', input: [1, 2, 3, 5, 8], description: 'Target: 4' }
        ],
        algorithmSteps: [
          { stepIndex: 0, description: 'Initial: low=0, high=6', pointerPositions: { low: 0, high: 6 } },
          { stepIndex: 1, description: 'Mid is index 3 (value 5). 5 < 8, move low to mid + 1.', highlightIndices: [3], pointerPositions: { low: 4, high: 6, mid: 3 } },
          { stepIndex: 2, description: 'New mid is index 5 (value 10). 10 > 8, move high to mid - 1.', highlightIndices: [5], pointerPositions: { low: 4, high: 4, mid: 5 } },
          { stepIndex: 3, description: 'New mid is index 4 (value 8). Found target!', highlightIndices: [4], pointerPositions: { low: 4, high: 4, mid: 4 } }
        ],
        code: {
          javascript: 'function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}'
        }
      },
      {
        topicId: arrayTopic._id,
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Find two numbers such that they add up to a specific target number.',
        animationType: 'two-pointer',
        testCases: [
          { label: 'Standard', input: [2, 7, 11, 15], description: 'Target: 9' },
          { label: 'Unsorted', input: [3, 2, 4], description: 'Target: 6' }
        ],
        algorithmSteps: [
          { stepIndex: 0, description: 'Initializing pointers at start and end.', pointerPositions: { left: 0, right: 3 } },
          { stepIndex: 1, description: 'Check sum: 2 + 15 = 17. 17 > 9, move right pointer left.', highlightIndices: [0, 3], pointerPositions: { left: 0, right: 2 } }
        ],
        code: {
          javascript: 'var twoSum = function(nums, target) {\n    const map = new Map();\n    for(let i=0; i<nums.length; i++) {\n        const diff = target - nums[i];\n        if(map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n};'
        }
      }
    ];

    await Problem.create(problemsData);
    console.log('Seeded sample problems.');

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
