const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'me-api.db');

// Check if database file exists, if not create it
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database with schema
const initDb = () => {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Error initializing database:', err);
    } else {
      console.log('Database initialized successfully');
      seedDatabase();
    }
  });
};

// Seed database with sample data
const seedDatabase = () => {
  // Insert your actual data here
  const userData = {
    name: "Vikrant",
    email: "vikrant@example.com"
  };
  
  // Check if user already exists
  db.get("SELECT id FROM users WHERE email = ?", [userData.email], (err, row) => {
    if (err) {
      console.error('Error checking user:', err);
      return;
    }
    
    if (!row) {
      // Insert user
      db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [userData.name, userData.email],
        function(err) {
          if (err) {
            console.error('Error inserting user:', err);
            return;
          }
          
          const userId = this.lastID;
          console.log(`User inserted with ID: ${userId}`);
          
          // Insert sample education
          db.run(
            `INSERT INTO education (user_id, institution, degree, field_of_study, start_date, end_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, "University of Example", "Bachelor of Science", "Computer Science", "2015-09-01", "2019-05-30"]
          );
          
          // Insert sample skills
          const skills = [
            {name: "JavaScript", proficiency: 9, category: "Programming Language"},
            {name: "Python", proficiency: 8, category: "Programming Language"},
            {name: "Node.js", proficiency: 9, category: "Framework"},
            {name: "React", proficiency: 8, category: "Framework"},
            {name: "SQL", proficiency: 8, category: "Database"},
          ];
          
          skills.forEach(skill => {
            db.run(
              "INSERT INTO skills (user_id, name, proficiency, category) VALUES (?, ?, ?, ?)",
              [userId, skill.name, skill.proficiency, skill.category]
            );
          });
          
          // Insert sample projects
          db.run(
            "INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)",
            [userId, "E-Commerce Platform", "A full-stack e-commerce application with React frontend and Node.js backend"],
            function(err) {
              if (err) return console.error(err);
              
              const projectId = this.lastID;
              
              // Link project to skills
              db.run(
                "INSERT INTO project_skills (project_id, skill_id) VALUES (?, (SELECT id FROM skills WHERE name = ? AND user_id = ?))",
                [projectId, "JavaScript", userId]
              );
              db.run(
                "INSERT INTO project_skills (project_id, skill_id) VALUES (?, (SELECT id FROM skills WHERE name = ? AND user_id = ?))",
                [projectId, "React", userId]
              );
              db.run(
                "INSERT INTO project_skills (project_id, skill_id) VALUES (?, (SELECT id FROM skills WHERE name = ? AND user_id = ?))",
                [projectId, "Node.js", userId]
              );
              
              // Add project links
              db.run(
                "INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?)",
                [projectId, "github", "https://github.com/vikrant/ecommerce-platform"]
              );
              db.run(
                "INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?)",
                [projectId, "live", "https://vikrantecommerceplatform.com"]
              );
            }
          );
          
          // Insert work experience
          db.run(
            `INSERT INTO work_experience (user_id, company, position, start_date, end_date, description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, "Tech Company Inc.", "Senior Developer", "2020-01-15", "2023-12-20", "Developed web applications using modern technologies"]
          );
          
          // Insert links
          db.run(
            "INSERT INTO links (user_id, type, url) VALUES (?, ?, ?)",
            [userId, "github", "https://github.com/vikrant"]
          );
          db.run(
            "INSERT INTO links (user_id, type, url) VALUES (?, ?, ?)",
            [userId, "linkedin", "https://linkedin.com/in/vikrant"]
          );
          db.run(
            "INSERT INTO links (user_id, type, url) VALUES (?, ?, ?)",
            [userId, "portfolio", "https://vikrantportfolio.com"]
          );
        }
      );
    }
  });
};

// Initialize database
initDb();

module.exports = db;
