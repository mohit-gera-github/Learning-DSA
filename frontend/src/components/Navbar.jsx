import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="header">
      <div className="nav-brand">
        <Link to="/" className="logo">
          <h1>DSA Visual Learn</h1>
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">
            <FaHome /> <span>Home</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
