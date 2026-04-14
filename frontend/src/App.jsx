import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import ProblemPage from './pages/ProblemPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topic/:slug" element={<TopicPage />} />
            <Route path="/problem/:id" element={<ProblemPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2026 DSA Visual Learn</p>
          <Link to="/admin-login" className="admin-trigger">
            <FaCog />
          </Link>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
