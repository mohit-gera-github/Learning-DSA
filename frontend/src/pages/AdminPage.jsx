import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaTimes, FaSignOutAlt, FaExclamationTriangle, FaFolderOpen, FaLightbulb } from 'react-icons/fa';
import './AdminPage.css';

const AdminPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form States
  const [newTopic, setNewTopic] = useState({ name: '', description: '', icon: '', order: 0 });
  const [newProblem, setNewProblem] = useState({ 
    topicId: '', title: '', difficulty: 'Easy', description: '', animationType: 'array-traversal' 
  });

  // Delete State
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/topics');
      setTopics(res.data.data);
      if (res.data.data.length > 0 && !selectedTopic) {
        setSelectedTopic(res.data.data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async (topicId) => {
    if (!topicId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/problems?topicId=${topicId}`);
      setProblems(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchProblems(selectedTopic._id);
    }
  }, [selectedTopic]);

  const openDeleteModal = (id, type, name) => {
    setItemToDelete({ id, type, name });
    setShowConfirmModal(true);
    setConfirmPassword('');
    setModalError('');
  };

  const handleConfirmDelete = async () => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (confirmPassword !== adminPassword) {
      setModalError('Incorrect password.');
      return;
    }

    try {
      if (itemToDelete.type === 'topic') {
        await axios.delete(`http://localhost:5000/api/topics/${itemToDelete.id}`);
        setSelectedTopic(null);
        fetchTopics();
      } else {
        await axios.delete(`http://localhost:5000/api/problems/${itemToDelete.id}`);
        fetchProblems(selectedTopic._id);
      }
      setShowConfirmModal(false);
    } catch (error) {
      setModalError('Deletion failed.');
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/topics', newTopic);
    setShowTopicModal(false);
    setNewTopic({ name: '', description: '', icon: '', order: 0 });
    fetchTopics();
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    const problemData = { ...newProblem, topicId: selectedTopic._id };
    await axios.post('http://localhost:5000/api/problems', problemData);
    setShowProblemModal(false);
    setNewProblem({ topicId: '', title: '', difficulty: 'Easy', description: '', animationType: 'array-traversal' });
    fetchProblems(selectedTopic._id);
  };

  if (loading) return <div className="admin-loading">Initializing Dashboard...</div>;

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <div className="admin-title">
          <h2>Admin Dashboard</h2>
          <p>Strict Topic-Problem Relationship Mode</p>
        </div>
        <div className="admin-actions">
          <button className="btn-add" onClick={() => setShowTopicModal(true)}><FaPlus /> New Topic</button>
          <button className="btn-logout" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </div>
      </header>

      <div className="admin-layout">
        {/* LEFT SIDE: TOPICS */}
        <aside className="admin-sidebar">
          <h3><FaFolderOpen /> Topics</h3>
          <div className="sidebar-list">
            {topics.map(t => (
              <div 
                key={t._id} 
                className={`sidebar-item ${selectedTopic?._id === t._id ? 'active' : ''}`}
                onClick={() => setSelectedTopic(t)}
              >
                <span>{t.icon} {t.name}</span>
                <button className="mini-del" onClick={(e) => { e.stopPropagation(); openDeleteModal(t._id, 'topic', t.name); }}>
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE: PROBLEMS FOR SELECTED TOPIC */}
        <main className="admin-main">
          {selectedTopic ? (
            <div className="topic-detail-view">
              <header className="detail-header">
                <div className="detail-title">
                  <h3>{selectedTopic.icon} Problems for {selectedTopic.name}</h3>
                  <p>{problems.length} problems found in this category.</p>
                </div>
                <button className="btn-add" onClick={() => setShowProblemModal(true)}><FaPlus /> Add Problem</button>
              </header>

              <div className="problems-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Title</th><th>Difficulty</th><th>Type</th><th>Actions</th></tr></thead>
                  <tbody>
                    {problems.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td><span className={`diff-dot ${p.difficulty.toLowerCase()}`}></span> {p.difficulty}</td>
                        <td>{p.animationType}</td>
                        <td>
                          <button className="btn-del" onClick={() => openDeleteModal(p._id, 'problem', p.title)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {problems.length === 0 && <tr><td colSpan="4" className="empty-row">No problems in this topic yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <FaLightbulb size={50} />
              <h3>Select a topic from the left to manage its problems.</h3>
            </div>
          )}
        </main>
      </div>

      {/* MODALS: Topic, Problem, Confirm (same as before but integrated) */}
      {/* (Skipping full modal code here to be turn-efficient, but ensuring they are present) */}
      {showTopicModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header"><h3>New Topic</h3><button onClick={() => setShowTopicModal(false)}><FaTimes /></button></div>
            <form onSubmit={handleTopicSubmit}>
              <input type="text" placeholder="Topic Name" required value={newTopic.name} onChange={e => setNewTopic({...newTopic, name: e.target.value})} />
              <textarea placeholder="Description" value={newTopic.description} onChange={e => setNewTopic({...newTopic, description: e.target.value})} />
              <input type="text" placeholder="Emoji Icon" value={newTopic.icon} onChange={e => setNewTopic({...newTopic, icon: e.target.value})} />
              <button type="submit" className="submit-btn">Create Topic</button>
            </form>
          </div>
        </div>
      )}

      {showProblemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Problem under {selectedTopic.name}</h3>
              <button onClick={() => setShowProblemModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleProblemSubmit}>
              <input type="text" placeholder="Problem Title" required value={newProblem.title} onChange={e => setNewProblem({...newProblem, title: e.target.value})} />
              <select value={newProblem.difficulty} onChange={e => setNewProblem({...newProblem, difficulty: e.target.value})}>
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
              <select value={newProblem.animationType} onChange={e => setNewProblem({...newProblem, animationType: e.target.value})}>
                <option value="array-traversal">Array Traversal</option>
                <option value="sorting">Sorting</option>
                <option value="two-pointer">Two Pointer</option>
              </select>
              <textarea placeholder="Problem Statement (Markdown)" required value={newProblem.description} onChange={e => setNewProblem({...newProblem, description: e.target.value})} />
              <button type="submit" className="submit-btn">Add Problem to {selectedTopic.name}</button>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="warning-icon"><FaExclamationTriangle size={40} color="#ff4d4d" /></div>
            <h3>Critical Deletion!</h3>
            <p className="warning-msg">This cannot be undone.</p>
            <p className="danger-text">
              {itemToDelete?.type === 'topic' 
                ? `Deleting topic "${itemToDelete.name}" will also delete ALL associated problems.`
                : `Are you sure you want to delete problem "${itemToDelete.name}"?`}
            </p>
            <div className="confirm-form">
              <label>Admin Password Required</label>
              <input type="password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value); setModalError('');}} />
              {modalError && <p className="modal-error">{modalError}</p>}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleConfirmDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
