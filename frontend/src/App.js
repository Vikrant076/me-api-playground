import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Projects from './components/Projects';
import Search from './components/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
