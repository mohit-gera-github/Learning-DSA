// backend/utils/generateSteps.js

/**
 * Bubble Sort: Simple swap-based sorting.
 */
exports.generateBubbleSortSteps = (arr) => {
  const steps = [];
  let a = [...arr];
  let n = a.length;

  steps.push({
    stepIndex: steps.length,
    description: "Starting Bubble Sort",
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        stepIndex: steps.length,
        description: `Comparing ${a[j]} and ${a[j+1]}`,
        arrayState: [...a],
        highlightIndices: [j, j + 1],
        swapIndices: [],
        pointerPositions: { current: j, next: j + 1 }
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          stepIndex: steps.length,
          description: `Swap ${a[j+1]} and ${a[j]} because ${a[j+1]} > ${a[j]}`,
          arrayState: [...a],
          highlightIndices: [],
          swapIndices: [j, j + 1],
          pointerPositions: { current: j, next: j + 1 }
        });
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: "Sorting complete!",
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  return steps;
};

/**
 * Selection Sort: Finding minimum element and swapping to front.
 */
exports.generateSelectionSortSteps = (arr) => {
  const steps = [];
  let a = [...arr];
  let n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      stepIndex: steps.length,
      description: `New pass: Searching for minimum starting from index ${i}`,
      arrayState: [...a],
      highlightIndices: [i],
      swapIndices: [],
      pointerPositions: { min: minIdx, current: i }
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        stepIndex: steps.length,
        description: `Checking if ${a[j]} is smaller than current minimum ${a[minIdx]}`,
        arrayState: [...a],
        highlightIndices: [minIdx, j],
        swapIndices: [],
        pointerPositions: { min: minIdx, current: j }
      });

      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({
          stepIndex: steps.length,
          description: `Found new minimum: ${a[minIdx]} at index ${minIdx}`,
          arrayState: [...a],
          highlightIndices: [minIdx],
          swapIndices: [],
          pointerPositions: { min: minIdx }
        });
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({
        stepIndex: steps.length,
        description: `Swap ${a[minIdx]} and ${a[i]} to move min to sorted portion`,
        arrayState: [...a],
        highlightIndices: [],
        swapIndices: [i, minIdx],
        pointerPositions: {}
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: "Selection sort complete!",
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  return steps;
};

/**
 * Insertion Sort: Building sorted portion one by one.
 */
exports.generateInsertionSortSteps = (arr) => {
  const steps = [];
  let a = [...arr];
  let n = a.length;

  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;

    steps.push({
      stepIndex: steps.length,
      description: `Inserting ${key} into sorted portion`,
      arrayState: [...a],
      highlightIndices: [i],
      swapIndices: [],
      pointerPositions: { current: i, compare: j }
    });

    while (j >= 0 && a[j] > key) {
      let prevVal = a[j];
      a[j + 1] = a[j];
      steps.push({
        stepIndex: steps.length,
        description: `Moving ${prevVal} forward`,
        arrayState: [...a],
        highlightIndices: [j, j + 1],
        swapIndices: [],
        pointerPositions: { compare: j }
      });
      j = j - 1;
    }
    a[j + 1] = key;
    steps.push({
      stepIndex: steps.length,
      description: `Placed ${key} at index ${j + 1}`,
      arrayState: [...a],
      highlightIndices: [j + 1],
      swapIndices: [],
      pointerPositions: { current: j + 1 }
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: "Insertion sort complete!",
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  return steps;
};

/**
 * Binary Search: Searching in a sorted array.
 */
exports.generateBinarySearchSteps = (arr, target) => {
  const steps = [];
  let a = [...arr]; // Expecting already sorted or will sort it
  let low = 0;
  let high = a.length - 1;

  steps.push({
    stepIndex: steps.length,
    description: `Binary Search for target ${target}`,
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: { low, high }
  });

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    steps.push({
      stepIndex: steps.length,
      description: `Mid point is index ${mid} (value: ${a[mid]})`,
      arrayState: [...a],
      highlightIndices: [mid],
      swapIndices: [],
      pointerPositions: { low, high, mid }
    });

    if (a[mid] === target) {
      steps.push({
        stepIndex: steps.length,
        description: `Target ${target} found at index ${mid}!`,
        arrayState: [...a],
        highlightIndices: [mid],
        swapIndices: [],
        pointerPositions: { mid }
      });
      return steps;
    }

    if (a[mid] < target) {
      low = mid + 1;
      steps.push({
        stepIndex: steps.length,
        description: `${a[mid]} < ${target}, searching right half`,
        arrayState: [...a],
        highlightIndices: [],
        swapIndices: [],
        pointerPositions: { low, high }
      });
    } else {
      high = mid - 1;
      steps.push({
        stepIndex: steps.length,
        description: `${a[mid]} > ${target}, searching left half`,
        arrayState: [...a],
        highlightIndices: [],
        swapIndices: [],
        pointerPositions: { low, high }
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Target ${target} not found.`,
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  return steps;
};

/**
 * Two Pointer: Finding pair with target sum.
 */
exports.generateTwoPointerSteps = (arr, target) => {
  const steps = [];
  let a = [...arr];
  let left = 0;
  let right = a.length - 1;

  while (left < right) {
    let sum = a[left] + a[right];
    steps.push({
      stepIndex: steps.length,
      description: `Pair (${a[left]}, ${a[right]}). Sum = ${sum}`,
      arrayState: [...a],
      highlightIndices: [left, right],
      swapIndices: [],
      pointerPositions: { left, right }
    });

    if (sum === target) {
      steps.push({
        stepIndex: steps.length,
        description: `Pair found! ${a[left]} + ${a[right]} = ${target}`,
        arrayState: [...a],
        highlightIndices: [left, right],
        swapIndices: [],
        pointerPositions: { left, right }
      });
      return steps;
    }

    if (sum < target) {
      left++;
      steps.push({
        stepIndex: steps.length,
        description: `Sum ${sum} < ${target}. Moving left forward.`,
        arrayState: [...a],
        highlightIndices: [],
        swapIndices: [],
        pointerPositions: { left, right }
      });
    } else {
      right--;
      steps.push({
        stepIndex: steps.length,
        description: `Sum ${sum} > ${target}. Moving right backward.`,
        arrayState: [...a],
        highlightIndices: [],
        swapIndices: [],
        pointerPositions: { left, right }
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: "No pair found with target sum.",
    arrayState: [...a],
    highlightIndices: [],
    swapIndices: [],
    pointerPositions: {}
  });

  return steps;
};
