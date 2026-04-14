import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaUndo,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../animations/useAnimation';
import ArrayVisualizer from '../animations/ArrayVisualizer.jsx';
import Spinner from '../components/Spinner';

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(true);
  const [activeLang, setActiveLang] = useState('javascript');
  const [speed, setSpeed] = useState(500);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/problems/${id}`);
        setProblem(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load problem');
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, apiUrl]);

  const steps = useMemo(() => {
    if (!problem) return [];
    return problem.algorithmSteps || [];
  }, [problem]);

  const {
    currentStep,
    currentIndex,
    isPlaying,
    play,
    pause,
    next,
    prev,
    reset,
    setSpeed: updateSpeed,
    totalSteps
  } = useAnimation(steps, speed);

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    updateSpeed(newSpeed);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pause() : play();
      } else if (e.code === 'ArrowRight') {
        next();
      } else if (e.code === 'ArrowLeft') {
        prev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play, pause, next, prev]);

  if (loading) return <Spinner />;
  if (error) return <div style={styles.statusContainer}>{error}</div>;
  if (!problem) return <div style={styles.statusContainer}>Problem not found</div>;

  return (
    <motion.div 
      style={styles.pageWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header style={styles.topBar}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FaArrowLeft /> Back
          </button>
          <h1 style={styles.title}>{problem.title}</h1>
          <span style={{ ...styles.badge, backgroundColor: getDifficultyColor(problem.difficulty) }}>
            {problem.difficulty}
          </span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.topicLabel}>{problem.topicId?.name}</span>
        </div>
      </header>

      <main style={styles.mainContent}>
        <section style={styles.leftPanel}>
          <div style={styles.sectionHeader}>Description</div>
          <div style={styles.descriptionBox}>
            {problem.description}
          </div>
          
          <div style={styles.sectionHeader}>Test Cases</div>
          <div style={styles.testCaseList}>
            {problem.testCases?.map((tc, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setActiveTestCaseIndex(idx);
                  reset();
                }}
                style={{
                  ...styles.testCaseButton,
                  backgroundColor: activeTestCaseIndex === idx ? '#6c63ff' : '#2a2a4a',
                  borderColor: activeTestCaseIndex === idx ? '#8c83ff' : '#3a3a5a'
                }}
              >
                {tc.label || `Test ${idx + 1}`}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.rightPanel}>
          <div style={styles.vizContainer}>
            <ArrayVisualizer 
              array={currentStep?.arrayState || problem.testCases[activeTestCaseIndex]?.input[0] || []}
              highlightIndices={currentStep?.highlightIndices}
              swapIndices={currentStep?.swapIndices}
              pointerPositions={currentStep?.pointerPositions}
              stepDescription={currentStep?.description}
            />
          </div>

          <div style={styles.controlsArea}>
            <div style={styles.stepCounter}>
              Step <strong>{currentIndex + 1}</strong> of <strong>{totalSteps}</strong>
            </div>

            <div style={styles.buttonGroup}>
              <button onClick={reset} style={styles.controlBtn} title="Reset"><FaUndo /></button>
              <button onClick={prev} style={styles.controlBtn} title="Previous"><FaStepBackward /></button>
              <button onClick={isPlaying ? pause : play} style={styles.playBtn} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={next} style={styles.controlBtn} title="Next"><FaStepForward /></button>
            </div>

            <div style={styles.speedControl}>
              <label style={styles.speedLabel}>Speed: {speed}ms</label>
              <input 
                type="range" 
                min="200" 
                max="2000" 
                step="100"
                value={speed} 
                onChange={handleSpeedChange}
                style={styles.slider}
              />
            </div>
          </div>
        </section>
      </main>

      <footer style={{ 
        ...styles.codePanel, 
        height: isCodeCollapsed ? '45px' : '40%' 
      }}>
        <div style={styles.codeHeader} onClick={() => setIsCodeCollapsed(!isCodeCollapsed)}>
          <div style={styles.codeTabs}>
            {['javascript', 'python', 'java'].map(lang => (
              <button
                key={lang}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLang(lang);
                  setIsCodeCollapsed(false);
                }}
                style={{
                  ...styles.tabButton,
                  borderBottom: activeLang === lang ? '2px solid #6c63ff' : 'none',
                  color: activeLang === lang ? '#fff' : '#888'
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={styles.collapseToggle}>
            {isCodeCollapsed ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        
        {!isCodeCollapsed && (
          <div style={styles.codeContent}>
            <pre style={styles.pre}>
              <code>{problem.code?.[activeLang] || `// No ${activeLang} implementation provided.`}</code>
            </pre>
          </div>
        )}
      </footer>
    </motion.div>
  );
};

const getDifficultyColor = (diff) => {
  switch (diff) {
    case 'Easy': return '#4caf50';
    case 'Medium': return '#ff9800';
    case 'Hard': return '#f44336';
    default: return '#6c63ff';
  }
};

const styles = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f0f1a',
    color: '#e0e0e0',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  topBar: {
    height: '60px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #2a2a4a',
    backgroundColor: '#161625'
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  backButton: {
    background: 'transparent',
    border: '1px solid #3a3a5a',
    color: '#888',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: { fontSize: '18px', margin: 0, fontWeight: 600 },
  badge: { padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: 'white' },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  },
  leftPanel: {
    width: '35%',
    borderRight: '1px solid #2a2a4a',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  rightPanel: {
    width: '65%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: '#121221'
  },
  sectionHeader: { fontSize: '14px', color: '#6c63ff', fontWeight: 'bold', textTransform: 'uppercase' },
  descriptionBox: { fontSize: '15px', lineHeight: 1.6, color: '#b0b0c0', whiteSpace: 'pre-wrap' },
  testCaseList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  testCaseButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid',
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px'
  },
  vizContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  controlsArea: {
    padding: '20px',
    borderTop: '1px solid #2a2a4a',
    backgroundColor: '#161625',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px'
  },
  buttonGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  controlBtn: {
    background: '#2a2a4a',
    border: 'none',
    color: '#fff',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playBtn: {
    background: '#6c63ff',
    border: 'none',
    color: '#fff',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  stepCounter: { fontSize: '14px', color: '#888' },
  speedControl: { display: 'flex', flexDirection: 'column', width: '150px' },
  speedLabel: { fontSize: '12px', color: '#888', marginBottom: '4px' },
  slider: { cursor: 'pointer', accentColor: '#6c63ff' },
  codePanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1e1e2e',
    transition: 'height 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
    zIndex: 10
  },
  codeHeader: {
    height: '45px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    borderTop: '1px solid #3a3a5a'
  },
  codeTabs: { display: 'flex', gap: '20px' },
  tabButton: { background: 'transparent', border: 'none', padding: '12px 0', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  collapseToggle: { color: '#888' },
  codeContent: { flex: 1, padding: '20px', overflowY: 'auto' },
  pre: { 
    margin: 0, 
    fontSize: '14px', 
    lineHeight: 1.5, 
    color: '#d1d1e0',
    backgroundColor: '#161625',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #2a2a4a'
  },
  statusContainer: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a', color: '#fff' }
};

export default ProblemPage;
