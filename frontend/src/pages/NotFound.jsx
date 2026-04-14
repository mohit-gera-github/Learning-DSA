import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={styles.container}
    >
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Algorithm Not Found</h2>
      <p style={styles.text}>The path you're looking for doesn't exist in our memory.</p>
      <Link to="/" style={styles.button}>Back to Home</Link>
    </motion.div>
  );
};

const styles = {
  container: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    fontSize: '120px',
    margin: 0,
    color: '#6c63ff',
    textShadow: '0 0 20px rgba(108, 99, 255, 0.4)'
  },
  subtitle: {
    fontSize: '32px',
    marginBottom: '1rem'
  },
  text: {
    color: '#888',
    marginBottom: '2rem'
  },
  button: {
    backgroundColor: '#6c63ff',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  }
};

export default NotFound;
