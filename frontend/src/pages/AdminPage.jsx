import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaExclamationTriangle, 
  FaTimes,
  FaFolder,
  FaLightbulb,
  FaSignOutAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Spinner';

const AdminPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicForm, setTopicForm] = useState({ 
    id: null, name: '', description: '', icon: '', order: 0 
  });
  
  const [problemForm, setProblemForm] = useState({
    id: null, title: '', difficulty: 'Easy', description: '',
    animationType: 'array-traversal', testCases: [{ label: 'Test 1', input: '', description: '' }],
    code: { javascript: '', python: '', java: '' }
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false, type: null, targetId: null, password: '', error: ''
  });

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/topics`);
      setTopics(res.data.data);
      setLoading(false);
      if (!selectedTopic && res.data.data.length > 0) {
        handleSelectTopic(res.data.data[0]);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchProblems = async (topicId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/problems?topicId=${topicId}`);
      setProblems(res.data.data);
    } catch (err) {
      console.error('Failed to load problems');
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    fetchProblems(topic._id);
    resetProblemForm();
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      if (topicForm.id) {
        await axios.put(`${apiUrl}/api/topics/${topicForm.id}`, topicForm);
      } else {
        await axios.post(`${apiUrl}/api/topics`, topicForm);
      }
      resetTopicForm();
      fetchTopics();
    } catch (err) {
      alert('Error saving topic');
    }
  };

  const resetTopicForm = () => {
    setTopicForm({ id: null, name: '', description: '', icon: '', order: 0 });
  };

  const editTopic = (topic) => {
    setTopicForm({
      id: topic._id,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      order: topic.order
    });
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return alert('Select a topic first');
    
    const payload = { ...problemForm, topicId: selectedTopic._id };
    
    try {
      if (problemForm.id) {
        await axios.put(`${apiUrl}/api/problems/${problemForm.id}`, payload);
      } else {
        await axios.post(`${apiUrl}/api/problems`, payload);
      }
      resetProblemForm();
      fetchProblems(selectedTopic._id);
    } catch (err) {
      alert('Error saving problem');
    }
  };

  const resetProblemForm = () => {
    setProblemForm({
      id: null, title: '', difficulty: 'Easy', description: '',
      animationType: 'array-traversal', testCases: [{ label: 'Test 1', input: '', description: '' }],
      code: { javascript: '', python: '', java: '' }
    });
  };

  const editProblem = async (pId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/problems/${pId}`);
      const p = res.data.data;
      setProblemForm({
        id: p._id,
        title: p.title,
        difficulty: p.difficulty,
        description: p.description,
        animationType: p.animationType,
        testCases: p.testCases.length > 0 ? p.testCases : [{ label: 'Test 1', input: '', description: '' }],
        code: p.code || { javascript: '', python: '', java: '' }
      });
    } catch (err) {
      alert('Error fetching problem details');
    }
  };

  const addTestCase = () => {
    setProblemForm({
      ...problemForm,
      testCases: [...problemForm.testCases, { label: `Test ${problemForm.testCases.length + 1}`, input: '', description: '' }]
    });
  };

  const removeTestCase = (idx) => {
    const updated = problemForm.testCases.filter((_, i) => i !== idx);
    setProblemForm({ ...problemForm, testCases: updated });
  };

  const updateTestCase = (idx, field, value) => {
    const updated = [...problemForm.testCases];
    updated[idx][field] = value;
    setProblemForm({ ...problemForm, testCases: updated });
  };

  const openDeleteModal = (type, id) => {
    setDeleteModal({ isOpen: true, type, targetId: id, password: '', error: '' });
  };

  const confirmDelete = async () => {
    if (deleteModal.password !== ADMIN_PASSWORD) {
      setDeleteModal({ ...deleteModal, error: 'Incorrect password. Deletion cancelled.' });
      return;
    }

    try {
      if (deleteModal.type === 'topic') {
        await axios.delete(`${apiUrl}/api/topics/${deleteModal.targetId}`);
        if (selectedTopic && selectedTopic._id === deleteModal.targetId) {
          setSelectedTopic(null);
          setProblems([]);
        }
        fetchTopics();
      } else {
        await axios.delete(`${apiUrl}/api/problems/${deleteModal.targetId}`);
        fetchProblems(selectedTopic._id);
      }
      setDeleteModal({ isOpen: false, type: null, targetId: null, password: '', error: '' });
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  if (loading) return <Spinner />;

  return (
    <motion.div 
      style={styles.dashboard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <aside style={styles.leftPanel}>
        <div style={styles.panelHeader}>
          <FaFolder style={{ color: '#6c63ff' }} />
          <span>Topics Management</span>
        </div>

        <div style={styles.list}>
          {topics.map(topic => (
            <div 
              key={topic._id} 
              style={{
                ...styles.listItem,
                backgroundColor: selectedTopic?._id === topic._id ? '#2a2a4a' : 'transparent',
                borderColor: selectedTopic?._id === topic._id ? '#6c63ff' : 'rgba(108, 99, 255, 0.1)'
              }}
              onClick={() => handleSelectTopic(topic)}
            >
              <div style={styles.itemMain}>
                <span style={styles.itemIcon}>{topic.icon || '📁'}</span>
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{topic.name}</div>
                  <div style={styles.itemSub}>{topic.description?.substring(0, 30)}...</div>
                </div>
              </div>
              <div style={styles.itemActions}>
                <button 
                  onClick={(e) => { e.stopPropagation(); editTopic(topic); }} 
                  style={styles.actionBtn}
                ><FaEdit /></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); openDeleteModal('topic', topic._id); }} 
                  style={{ ...styles.actionBtn, color: '#ff6584' }}
                ><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleTopicSubmit} style={styles.form}>
          <div style={styles.formTitle}>{topicForm.id ? 'Edit Topic' : 'Add New Topic'}</div>
          <div style={styles.formRow}>
            <input 
              placeholder="Name" 
              value={topicForm.name} 
              onChange={e => setTopicForm({ ...topicForm, name: e.target.value })} 
              required
              style={styles.input}
            />
            <input 
              placeholder="Icon" 
              value={topicForm.icon} 
              onChange={e => setTopicForm({ ...topicForm, icon: e.target.value })} 
              style={{ ...styles.input, width: '60px' }}
            />
          </div>
          <textarea 
            placeholder="Description" 
            value={topicForm.description} 
            onChange={e => setTopicForm({ ...topicForm, description: e.target.value })} 
            style={styles.textarea}
          />
          <div style={styles.formRow}>
            <input 
              type="number" 
              placeholder="Order" 
              value={topicForm.order} 
              onChange={e => setTopicForm({ ...topicForm, order: parseInt(e.target.value) })} 
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>
              {topicForm.id ? 'Update' : 'Add Topic'}
            </button>
            {topicForm.id && <button type="button" onClick={resetTopicForm} style={styles.cancelBtn}>Cancel</button>}
          </div>
        </form>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main style={styles.rightPanel}>
        {selectedTopic ? (
          <>
            <div style={styles.panelHeader}>
              <FaLightbulb style={{ color: '#ffcc00' }} />
              <span>Problems for: {selectedTopic.name}</span>
            </div>

            <div style={styles.listHorizontal}>
              {problems.map(prob => (
                <div key={prob._id} style={styles.problemCard}>
                  <div style={styles.probHeader}>
                    <span style={{ ...styles.diffBadge, backgroundColor: getDiffColor(prob.difficulty) }}>
                      {prob.difficulty}
                    </span>
                    <div style={styles.probActions}>
                      <button onClick={() => editProblem(prob._id)} style={styles.actionBtn}><FaEdit /></button>
                      <button onClick={() => openDeleteModal('problem', prob._id)} style={{ ...styles.actionBtn, color: '#ff6584' }}><FaTrash /></button>
                    </div>
                  </div>
                  <div style={styles.probTitle}>{prob.title}</div>
                  <div style={styles.probType}>{prob.animationType}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleProblemSubmit} style={{ ...styles.form, marginTop: '30px' }}>
              <div style={styles.formTitle}>{problemForm.id ? 'Edit Problem' : 'Add New Problem'}</div>
              <div style={styles.formRow}>
                <input 
                  placeholder="Problem Title" 
                  value={problemForm.title} 
                  onChange={e => setProblemForm({ ...problemForm, title: e.target.value })} 
                  required
                  style={{ ...styles.input, flex: 2 }}
                />
                <select 
                  value={problemForm.difficulty}
                  onChange={e => setProblemForm({ ...problemForm, difficulty: e.target.value })}
                  style={styles.select}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <select 
                  value={problemForm.animationType}
                  onChange={e => setProblemForm({ ...problemForm, animationType: e.target.value })}
                  style={styles.select}
                >
                  <option value="array-traversal">Array Traversal</option>
                  <option value="bubble-sort">Bubble Sort</option>
                  <option value="selection-sort">Selection Sort</option>
                  <option value="insertion-sort">Insertion Sort</option>
                  <option value="binary-search">Binary Search</option>
                  <option value="two-pointer">Two Pointer</option>
                </select>
              </div>

              <textarea 
                placeholder="Description" 
                value={problemForm.description} 
                onChange={e => setProblemForm({ ...problemForm, description: e.target.value })} 
                style={{ ...styles.textarea, height: '80px' }}
              />

              <div style={styles.sectionHeader}>Test Cases</div>
              {problemForm.testCases.map((tc, idx) => (
                <div key={idx} style={styles.testCaseRow}>
                  <input placeholder="Label" value={tc.label} onChange={e => updateTestCase(idx, 'label', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                  <input placeholder="Input (JSON array)" value={tc.input} onChange={e => updateTestCase(idx, 'input', e.target.value)} style={{ ...styles.input, flex: 2 }} />
                  <button type="button" onClick={() => removeTestCase(idx)} style={styles.removeBtn}><FaTimes /></button>
                </div>
              ))}
              <button type="button" onClick={addTestCase} style={styles.addStepBtn}><FaPlus /> Add Test Case</button>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <div style={styles.label}>JavaScript Code</div>
                  <textarea 
                    value={problemForm.code.javascript} 
                    onChange={e => setProblemForm({ ...problemForm, code: { ...problemForm.code, javascript: e.target.value } })}
                    style={styles.codeTextarea}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.label}>Python Code</div>
                  <textarea 
                    value={problemForm.code.python} 
                    onChange={e => setProblemForm({ ...problemForm, code: { ...problemForm.code, python: e.target.value } })}
                    style={styles.codeTextarea}
                  />
                </div>
              </div>

              <div style={styles.formFooter}>
                <button type="submit" style={styles.submitBtnLarge}>
                  {problemForm.id ? 'Update Problem' : 'Save Problem'}
                </button>
                {problemForm.id && <button type="button" onClick={resetProblemForm} style={styles.cancelBtn}>Cancel</button>}
              </div>
            </form>
          </>
        ) : (
          <div style={styles.emptyState}>Select a topic from the left to manage problems</div>
        )}
      </main>

      <AnimatePresence>
        {deleteModal.isOpen && (
          <div style={styles.modalOverlay}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={styles.modal}
            >
              <FaExclamationTriangle style={styles.warningIcon} />
              <h2 style={styles.modalTitle}>Confirm Deletion</h2>
              <p style={styles.modalText}>
                {deleteModal.type === 'topic' 
                  ? "Deleting this topic will also delete ALL problems under it. This cannot be undone!"
                  : "Are you sure you want to delete this problem? This cannot be undone!"}
              </p>
              
              <div style={styles.passwordField}>
                <label style={styles.modalLabel}>Enter admin password to confirm</label>
                <input 
                  type="password" 
                  value={deleteModal.password} 
                  onChange={e => setDeleteModal({ ...deleteModal, password: e.target.value })}
                  style={styles.modalInput}
                  autoFocus
                />
                {deleteModal.error && <div style={styles.modalError}>{deleteModal.error}</div>}
              </div>

              <div style={styles.modalActions}>
                <button 
                  onClick={() => setDeleteModal({ isOpen: false, type: null, targetId: null, password: '', error: '' })} 
                  style={styles.modalCancel}
                >Cancel</button>
                <button onClick={confirmDelete} style={styles.modalConfirm}>Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getDiffColor = (diff) => {
  switch (diff) {
    case 'Easy': return '#4caf50';
    case 'Medium': return '#ff9800';
    case 'Hard': return '#f44336';
    default: return '#6c63ff';
  }
};

const styles = {
  dashboard: { display: 'flex', height: '100vh', backgroundColor: '#0f0f1a', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' },
  leftPanel: { width: '350px', borderRight: '1px solid #2a2a4a', padding: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#161625' },
  rightPanel: { flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#0f0f1a' },
  panelHeader: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' },
  list: { flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { padding: '12px', borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' },
  itemMain: { display: 'flex', gap: '12px', alignItems: 'center' },
  itemIcon: { fontSize: '20px' },
  itemName: { fontWeight: 'bold', fontSize: '14px' },
  itemSub: { fontSize: '12px', color: '#888' },
  itemActions: { display: 'flex', gap: '5px' },
  actionBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#888', padding: '6px', borderRadius: '4px', cursor: 'pointer', display: 'flex' },
  form: { backgroundColor: 'rgba(108, 99, 255, 0.05)', padding: '15px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' },
  formTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', color: '#6c63ff' },
  formRow: { display: 'flex', gap: '10px' },
  input: { backgroundColor: '#1e1e2e', border: '1px solid #2a2a4a', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '13px' },
  textarea: { backgroundColor: '#1e1e2e', border: '1px solid #2a2a4a', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '13px', resize: 'none', minHeight: '60px' },
  select: { backgroundColor: '#1e1e2e', border: '1px solid #2a2a4a', borderRadius: '4px', padding: '8px', color: '#fff' },
  submitBtn: { backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: 'transparent', color: '#888', border: '1px solid #3a3a5a', borderRadius: '4px', padding: '8px 15px', cursor: 'pointer' },
  listHorizontal: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
  problemCard: { backgroundColor: '#161625', padding: '15px', borderRadius: '8px', border: '1px solid #2a2a4a' },
  probHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  diffBadge: { fontSize: '10px', padding: '2px 6px', borderRadius: '4px', color: 'white' },
  probTitle: { fontWeight: 'bold', marginBottom: '5px' },
  probType: { fontSize: '11px', color: '#6c63ff', textTransform: 'uppercase' },
  sectionHeader: { fontSize: '14px', fontWeight: 'bold', margin: '15px 0 5px', color: '#888' },
  testCaseRow: { display: 'flex', gap: '10px', marginBottom: '5px' },
  removeBtn: { background: 'transparent', border: 'none', color: '#ff6584', cursor: 'pointer' },
  addStepBtn: { background: 'transparent', border: '1px dashed #3a3a5a', color: '#888', padding: '8px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' },
  codeTextarea: { backgroundColor: '#1e1e2e', border: '1px solid #2a2a4a', borderRadius: '4px', padding: '10px', color: '#d1d1e0', fontSize: '12px', fontFamily: 'monospace', width: '100%', height: '150px' },
  label: { fontSize: '12px', color: '#888', marginBottom: '5px' },
  submitBtnLarge: { backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  formFooter: { display: 'flex', gap: '15px', marginTop: '20px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#161625', padding: '40px', borderRadius: '12px', width: '400px', textAlign: 'center', border: '1px solid #ff6584' },
  warningIcon: { fontSize: '48px', color: '#ff6584', marginBottom: '20px' },
  modalTitle: { fontSize: '24px', marginBottom: '15px' },
  modalText: { color: '#b0b0c0', lineHeight: 1.5, marginBottom: '25px' },
  passwordField: { textAlign: 'left' },
  modalLabel: { display: 'block', fontSize: '12px', marginBottom: '8px', color: '#888' },
  modalInput: { width: '100%', backgroundColor: '#0f0f1a', border: '1px solid #2a2a4a', borderRadius: '4px', padding: '12px', color: '#fff', marginBottom: '10px' },
  modalError: { color: '#ff6584', fontSize: '12px', marginBottom: '15px' },
  modalActions: { display: 'flex', gap: '15px', marginTop: '10px' },
  modalCancel: { flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #3a3a5a', background: 'transparent', color: '#fff', cursor: 'pointer' },
  modalConfirm: { flex: 1, padding: '12px', borderRadius: '6px', border: 'none', background: '#ff6584', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  logoutBtn: { backgroundColor: 'transparent', color: '#ff6584', border: '1px solid #ff6584', borderRadius: '6px', padding: '10px', marginTop: 'auto', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default AdminPage;
