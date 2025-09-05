const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /health - Liveness check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET /profile - Get complete profile
router.get('/profile', (req, res) => {
  const query = `
    SELECT 
      u.*,
      json_group_array(
        json_object(
          'id', e.id,
          'institution', e.institution,
          'degree', e.degree,
          'field_of_study', e.field_of_study,
          'start_date', e.start_date,
          'end_date', e.end_date
        )
      ) as education,
      json_group_array(
        json_object(
          'id', s.id,
          'name', s.name,
          'proficiency', s.proficiency,
          'category', s.category
        )
      ) as skills,
      json_group_array(
        json_object(
          'id', w.id,
          'company', w.company,
          'position', w.position,
          'start_date', w.start_date,
          'end_date', w.end_date,
          'description', w.description
        )
      ) as work_experience,
      json_group_array(
        json_object(
          'id', l.id,
          'type', l.type,
          'url', l.url
        )
      ) as links
    FROM users u
    LEFT JOIN education e ON u.id = e.user_id
    LEFT JOIN skills s ON u.id = s.user_id
    LEFT JOIN work_experience w ON u.id = w.user_id
    LEFT JOIN links l ON u.id = l.user_id
    GROUP BY u.id
  `;
  
  db.get(query, (err, row) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Parse JSON fields
    const profile = {
      ...row,
      education: JSON.parse(row.education || '[]'),
      skills: JSON.parse(row.skills || '[]'),
      work_experience: JSON.parse(row.work_experience || '[]'),
      links: JSON.parse(row.links || '[]')
    };
    
    res.json(profile);
  });
});

// GET /projects - Get all projects or filter by skill
router.get('/projects', (req, res) => {
  const { skill } = req.query;
  
  let query = `
    SELECT 
      p.*,
      json_group_array(
        json_object(
          'id', s.id,
          'name', s.name,
          'proficiency', s.proficiency,
          'category', s.category
        )
      ) as skills,
      json_group_array(
        json_object(
          'id', pl.id,
          'type', pl.type,
          'url', pl.url
        )
      ) as links
    FROM projects p
    LEFT JOIN project_skills ps ON p.id = ps.project_id
    LEFT JOIN skills s ON ps.skill_id = s.id
    LEFT JOIN project_links pl ON p.id = pl.project_id
  `;
  
  if (skill) {
    query += ` WHERE s.name = ? `;
  }
  
  query += ` GROUP BY p.id `;
  
  db.all(query, skill ? [skill] : [], (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    const projects = rows.map(row => ({
      ...row,
      skills: JSON.parse(row.skills || '[]').filter(s => s.id !== null),
      links: JSON.parse(row.links || '[]')
    }));
    
    res.json(projects);
  });
});

// GET /skills/top - Get top skills by proficiency
router.get('/skills/top', (req, res) => {
  const { limit = 5 } = req.query;
  
  const query = `
    SELECT * FROM skills 
    ORDER BY proficiency DESC 
    LIMIT ?
  `;
  
  db.all(query, [parseInt(limit)], (err, rows) => {
    if (err) {
      console.error('Error fetching top skills:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    res.json(rows);
  });
});

// GET /search - Search across multiple fields
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  const searchTerm = `%${q}%`;
  
  // Search across skills, projects, and work experience
  const query = `
    SELECT 
      'skill' as type,
      name as title,
      NULL as description,
      proficiency as relevance
    FROM skills 
    WHERE name LIKE ?
    
    UNION ALL
    
    SELECT 
      'project' as type,
      title,
      description,
      NULL as relevance
    FROM projects 
    WHERE title LIKE ? OR description LIKE ?
    
    UNION ALL
    
    SELECT 
      'work' as type,
      company as title,
      position as description,
      NULL as relevance
    FROM work_experience 
    WHERE company LIKE ? OR position LIKE ? OR description LIKE ?
    
    ORDER BY relevance DESC NULLS LAST
  `;
  
  db.all(query, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      console.error('Error searching:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    res.json(rows);
  });
});

// PUT /profile - Update profile (basic auth protected)
router.put('/profile', (req, res) => {
  // In a real implementation, this would be protected with authentication
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
