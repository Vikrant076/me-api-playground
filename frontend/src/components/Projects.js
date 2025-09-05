import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await profileAPI.getProjects();
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (skillFilter) {
      const filtered = projects.filter(project => 
        project.skills.some(skill => 
          skill.name.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [skillFilter, projects]);

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects">
      <h1>Projects</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />
      </div>
      
      <div className="project-list">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            
            <div className="project-skills">
              <strong>Skills:</strong>
              {project.skills.map(skill => (
                <span key={skill.id} className="skill-tag">
                  {skill.name}
                </span>
              ))}
            </div>
            
            <div className="project-links">
              <strong>Links:</strong>
              {project.links.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.type}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
