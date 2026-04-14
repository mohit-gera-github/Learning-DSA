import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, problemsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/topics'),
        axios.get('http://localhost:5000/api/problems')
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

  if (loading) return <div className="loading-grid">Loading topics...</div>;

  return (
    <div className="home-wrapper">
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
    </div>
  );
};

export default Home;
