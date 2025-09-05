import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">No profile data found</div>;

  return (
    <div className="profile">
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      
      <h2>Education</h2>
      <div className="education">
        {profile.education.map(edu => (
          <div key={edu.id} className="education-item">
            <h3>{edu.institution}</h3>
            <p>{edu.degree} in {edu.field_of_study}</p>
            <p>{edu.start_date} to {edu.end_date || 'Present'}</p>
          </div>
        ))}
      </div>
      
      <h2>Skills</h2>
      <div className="skills">
        {profile.skills.map(skill => (
          <span key={skill.id} className="skill-tag">
            {skill.name} ({skill.proficiency}/10)
          </span>
        ))}
      </div>
      
      <h2>Work Experience</h2>
      <div className="work-experience">
        {profile.work_experience.map(work => (
          <div key={work.id} className="work-item">
            <h3>{work.position} at {work.company}</h3>
            <p>{work.start_date} to {work.end_date || 'Present'}</p>
            <p>{work.description}</p>
          </div>
        ))}
      </div>
      
      <h2>Links</h2>
      <div className="links">
        {profile.links.map(link => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.type}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Profile;
