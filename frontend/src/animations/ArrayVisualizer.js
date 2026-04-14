import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ArrayVisualizer Component
 * 
 * @param {number[]} array - The array of numbers to visualize
 * @param {number[]} highlightIndices - Indices to highlight (e.g., being compared)
 * @param {number[]} swapIndices - Indices currently being swapped
 * @param {Object} pointerPositions - Map of pointer labels to indices { left: 0, right: 10, mid: 5 }
 * @param {string} stepDescription - Text describing the current step
 */
const ArrayVisualizer = ({ 
  array = [], 
  highlightIndices = [], 
  swapIndices = [], 
  pointerPositions = {}, 
  stepDescription = "" 
}) => {
  const maxValue = Math.max(...array, 1);
  const containerHeight = 300;

  // Colors based on requirements
  const colors = {
    default: '#2a2a4a',
    highlight: '#6c63ff',
    swap: '#ff6584',
    text: '#ffffff'
  };

  // Helper to determine bar color
  const getBarColor = (index) => {
    if (swapIndices.includes(index)) return colors.swap;
    if (highlightIndices.includes(index)) return colors.highlight;
    return colors.default;
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.visualizerArea, height: containerHeight + 100 }}>
        {/* Pointer Layer */}
        <div style={styles.pointerLayer}>
          {Object.entries(pointerPositions).map(([label, index]) => (
            index !== undefined && index >= 0 && index < array.length && (
              <motion.div
                key={`pointer-${label}`}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, x: index * 45 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={styles.pointer}
              >
                <div style={styles.pointerLabel}>{label.charAt(0).toUpperCase()}</div>
                <div style={styles.pointerArrow}>▼</div>
              </motion.div>
            )
          ))}
        </div>

        {/* Bars Layer */}
        <div style={styles.barsContainer}>
          {array.map((value, index) => (
            <motion.div
              key={`bar-wrapper-${index}`}
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              style={styles.barWrapper}
            >
              <motion.div
                animate={{ 
                  height: (value / maxValue) * containerHeight,
                  backgroundColor: getBarColor(index)
                }}
                transition={{ duration: 0.3 }}
                style={styles.bar}
              />
              <div style={styles.valueLabel}>{value}</div>
              <div style={styles.indexLabel}>{index}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepDescription}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={styles.infoBox}
        >
          {stepDescription || "Waiting for animation to start..."}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
    width: '100%',
    overflowX: 'auto'
  },
  visualizerArea: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minWidth: 'fit-content',
    padding: '0 20px'
  },
  pointerLayer: {
    position: 'absolute',
    top: 0,
    left: 20,
    height: '60px',
    width: '100%'
  },
  pointer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40px'
  },
  pointerLabel: {
    background: '#6c63ff',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '2px'
  },
  pointerArrow: {
    fontSize: '14px',
    color: '#6c63ff',
    lineHeight: 1
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '5px',
    paddingBottom: '40px'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40px'
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    minHeight: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  valueLabel: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#a0a0c0'
  },
  indexLabel: {
    fontSize: '10px',
    color: '#606080',
    marginTop: '2px'
  },
  infoBox: {
    marginTop: '30px',
    padding: '16px 24px',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderLeft: '4px solid #6c63ff',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '100%',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#d0d0f0',
    textAlign: 'center'
  }
};

export default ArrayVisualizer;
