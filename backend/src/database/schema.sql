-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    proficiency INTEGER CHECK(proficiency BETWEEN 1 AND 10),
    category TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Project skills junction table
CREATE TABLE IF NOT EXISTS project_skills (
    project_id INTEGER,
    skill_id INTEGER,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects (id),
    FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- Project links table
CREATE TABLE IF NOT EXISTS project_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- Work experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills (name);
CREATE INDEX IF NOT EXISTS idx_skills_user ON skills (user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects (user_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills (skill_id);
