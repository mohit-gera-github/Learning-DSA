import React from 'react';
import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div style={styles.container}>
      <motion.div
        style={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    minHeight: '200px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(108, 99, 255, 0.1)',
    borderTop: '4px solid #6c63ff',
    borderRadius: '50%',
  }
};

export default Spinner;
