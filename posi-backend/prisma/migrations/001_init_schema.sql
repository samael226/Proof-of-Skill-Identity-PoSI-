-- PoSI MVP — PostgreSQL Schema
-- Skill: Backend API Logic
-- Philosophy: append-only, auditable, trust-first

-- ==============================
-- 1️⃣ USERS
-- ==============================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) CHECK (role IN ('USER', 'ADMIN')) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 2️⃣ SKILLS
-- ==============================
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 3️⃣ CHALLENGES
-- ==============================
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  instructions TEXT NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  time_limit_minutes INTEGER NOT NULL,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 4️⃣ SUBMISSIONS (APPEND-ONLY)
-- ==============================
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  challenge_id INTEGER REFERENCES challenges(id),
  submitted_answer TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  status VARCHAR(10) CHECK (status IN ('PASSED', 'FAILED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 5️⃣ SKILL PROOFS (IMMUTABLE)
-- ==============================
CREATE TABLE skill_proofs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  skill_id INTEGER REFERENCES skills(id),
  challenge_id INTEGER REFERENCES challenges(id),
  score INTEGER NOT NULL,
  confidence_index NUMERIC(3,2) CHECK (confidence_index >= 0 AND confidence_index <= 1),
  difficulty VARCHAR(10),
  time_taken_seconds INTEGER,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  proof_hash TEXT UNIQUE NOT NULL
);

-- ==============================
-- 6️⃣ IMMUTABILITY GUARANTEES
-- ==============================

-- Prevent deletion of skill proofs
CREATE OR REPLACE FUNCTION prevent_proof_delete()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Skill proofs cannot be deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_delete_skill_proofs
BEFORE DELETE ON skill_proofs
FOR EACH ROW EXECUTE FUNCTION prevent_proof_delete();

-- Prevent updates of skill proofs
CREATE OR REPLACE FUNCTION prevent_proof_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Skill proofs cannot be updated';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_update_skill_proofs
BEFORE UPDATE ON skill_proofs
FOR EACH ROW EXECUTE FUNCTION prevent_proof_update();

-- ==============================
-- 7️⃣ SEED MVP DATA
-- ==============================
INSERT INTO skills (name, description)
VALUES ('Backend API Logic', 'Reasoning about backend systems, data flow, and API design');

INSERT INTO challenges (skill_id, title, instructions, difficulty, time_limit_minutes)
VALUES (
  1,
  'Design a REST API for Order Management',
  'Describe endpoints, data flow, validation, and error handling for an order system.',
  'MEDIUM',
  30
);

