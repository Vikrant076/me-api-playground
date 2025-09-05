import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <h1>Me-API Playground</h1>
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
        </li>
        <li>
          <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
            Search
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
