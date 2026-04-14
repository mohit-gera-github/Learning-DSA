import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import './TopicPage.css';

const TopicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        setLoading(true);
        const topicsRes = await axios.get(`${apiUrl}/api/topics`);
        const currentTopic = topicsRes.data.data.find(t => t.slug === slug);
        
        if (!currentTopic) {
          navigate('/');
          return;
        }
        setTopic(currentTopic);

        const problemsRes = await axios.get(`${apiUrl}/api/problems?topicId=${currentTopic._id}`);
        setProblems(problemsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [slug, navigate, apiUrl]);

  if (loading) return <Spinner />;

  return (
    <motion.div 
      className="topic-view-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <button className="back-link" onClick={() => navigate('/')}>
          <FaArrowLeft /> <span>Topics</span>
        </button>

        <header className="topic-hero">
          <div className="topic-icon-display">{topic.icon}</div>
          <div className="topic-info-display">
            <h1>{topic.name}</h1>
            <p>{topic.description}</p>
          </div>
        </header>

        <section className="problems-grid">
          {problems.map((problem) => (
            <motion.div 
              key={problem._id} 
              className="problem-card"
              whileHover={{ y: -5, borderColor: '#6c63ff' }}
              onClick={() => navigate(`/problem/${problem._id}`)}
            >
              <div className="card-header">
                <h4>{problem.title}</h4>
                <span className={`badge-difficulty ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <p className="problem-preview">
                {problem.description.substring(0, 100)}
                {problem.description.length > 100 ? '...' : ''}
              </p>

              <div className="card-footer">
                <span className="animation-tag">{problem.animationType.replace('-', ' ')}</span>
                <FaChevronRight className="arrow-icon" />
              </div>
            </motion.div>
          ))}
          {problems.length === 0 && (
            <div className="empty-state">No problems found for this topic.</div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default TopicPage;
