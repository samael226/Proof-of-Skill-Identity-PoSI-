# PoSI (Proof-of-Skill Identity) — MVP Database Schema

This schema is **intentionally minimal** so a solo developer can build and ship in 30 days.

---

## 1️⃣ users

Represents every person using the platform.

**Fields**

* `id` (PK)
* `username` (unique)
* `email` (unique)
* `password_hash`
* `role` (ENUM: USER, ADMIN)
* `created_at`
* `updated_at`

**Notes**

* No profile fluff (bio, avatar) in MVP
* Trust > personalization

---

## 2️⃣ skills

Defines the skill being verified (MVP = 1 skill).

**Fields**

* `id` (PK)
* `name` (e.g., "JavaScript")
* `description`
* `created_at`

**Notes**

* One skill is enough to prove the concept
* More skills = later

---

## 3️⃣ challenges

A challenge used to verify a skill.

**Fields**

* `id` (PK)
* `skill_id` (FK → skills.id)
* `title`
* `instructions`
* `difficulty` (ENUM: EASY, MEDIUM, HARD)
* `time_limit_minutes`
* `max_score` (default 100)
* `evaluation_type` (ENUM: OUTPUT, RULE_BASED)
* `created_at`

**Notes**

* Created only by ADMIN
* Keep evaluation deterministic for MVP

---

## 4️⃣ submissions

Every attempt made by a user.

**Fields**

* `id` (PK)
* `user_id` (FK → users.id)
* `challenge_id` (FK → challenges.id)
* `submitted_code` (TEXT)
* `execution_output` (TEXT)
* `score`
* `time_taken_seconds`
* `status` (ENUM: PASSED, FAILED)
* `created_at`

**Notes**

* Never overwritten
* This is your audit trail

---

## 5️⃣ skill_proofs

The **core product** — immutable proof of skill.

**Fields**

* `id` (PK)
* `user_id` (FK → users.id)
* `skill_id` (FK → skills.id)
* `challenge_id` (FK → challenges.id)
* `score`
* `confidence_index`
* `difficulty`
* `time_taken_seconds`
* `issued_at`
* `proof_hash` (string)

**Rules**

* Created ONLY if submission = PASSED
* Immutable forever
* One proof per user per challenge

---

## 🔐 Data Integrity Rules (IMPORTANT)

* Submissions are append-only
* Skill proofs are read-only
* Proofs cannot be deleted (even by admin)
* Public profile reads ONLY from `skill_proofs`

---

## 🔗 Relationships Overview

* User → many Submissions
* User → many SkillProofs
* Skill → many Challenges
* Challenge → many Submissions
* Challenge → zero or many SkillProofs

---

## 🧠 Why This Schema Works

* Simple
* Auditable
* Trust-focused
* Scales logically
* No premature complexity

---

