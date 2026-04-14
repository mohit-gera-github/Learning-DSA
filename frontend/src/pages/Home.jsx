import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import './Home.css';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, problemsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/topics`),
        axios.get(`${apiUrl}/api/problems`)
      ]);

      const topicsWithCounts = topicsRes.data.data.map(topic => ({
        ...topic,
        problemCount: problemsRes.data.data.filter(p => p.topicId === topic._id).length
      }));

      setTopics(topicsWithCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <motion.div 
      className="home-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="home-header">
        <h2>Explore DSA Topics</h2>
      </header>

      <div className="topics-grid">
        {topics.map((topic) => (
          <motion.div
            key={topic._id}
            whileHover={{ scale: 1.05 }}
            className="topic-card"
            onClick={() => navigate(`/topic/${topic.slug}`)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
            <div className="problem-count">{topic.problemCount} Problems</div>
          </motion.div>
        ))}
      </div>

      <Link to="/admin-login" className="admin-trigger-icon">
        <FaCog />
      </Link>
    </motion.div>
  );
};

export default Home;
