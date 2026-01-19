# PoSI (Proof-of-Skill Identity) — Step 2: REST API Design

This API is **intentionally small, explicit, and auditable**.
No magic. No overengineering.

---

## 🔐 Authentication

### POST /api/auth/register

Create a new user.

**Request**

```json
{
  "username": "samael",
  "email": "samael@email.com",
  "password": "strongpassword"
}
```

**Response**

```json
{
  "message": "User registered successfully"
}
```

---

### POST /api/auth/login

Authenticate user and return JWT.

**Request**

```json
{
  "email": "samael@email.com",
  "password": "strongpassword"
}
```

**Response**

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "username": "samael",
    "role": "USER"
  }
}
```

---

## 🧠 Skills & Challenges (ADMIN)

### POST /api/admin/skills

Create a skill.

```json
{
  "name": "JavaScript",
  "description": "Core JavaScript problem solving"
}
```

---

### POST /api/admin/challenges

Create a challenge.

```json
{
  "skillId": 1,
  "title": "Array Transformation",
  "instructions": "Transform the array based on rules",
  "difficulty": "MEDIUM",
  "timeLimitMinutes": 30,
  "evaluationType": "RULE_BASED"
}
```

---

## 🎯 Challenges (USER)

### GET /api/challenges

List available challenges.

**Response**

```json
[
  {
    "id": 1,
    "title": "Array Transformation",
    "difficulty": "MEDIUM",
    "timeLimitMinutes": 30
  }
]
```

---

### GET /api/challenges/{id}

Get full challenge details.

---

## 📝 Submissions

### POST /api/submissions

Submit a challenge attempt.

```json
{
  "challengeId": 1,
  "submittedCode": "function solve(arr) { ... }",
  "timeTakenSeconds": 1200
}
```

**Response**

```json
{
  "score": 82,
  "status": "PASSED",
  "confidenceIndex": 0.87
}
```

---

## 🏅 Skill Proofs

### GET /api/proofs/me

Get authenticated user's proofs.

---

### GET /api/profiles/{username}

Public skill identity page.

**Response**

```json
{
  "username": "samael",
  "verifiedSkills": [
    {
      "skill": "JavaScript",
      "score": 82,
      "confidenceIndex": 0.87,
      "difficulty": "MEDIUM",
      "issuedAt": "2026-01-18"
    }
  ]
}
```

---

## 🚨 Anti-Cheat Flags (Internal)

### POST /api/internal/flags

Used by scoring engine.

```json
{
  "submissionId": 12,
  "flagType": "SUSPICIOUS_SPEED",
  "severity": "MEDIUM"
}
```

---

## 🧠 Design Rules

* All writes are authenticated
* Proofs are read-only
* Submissions are append-only
* Public profiles never expose raw submissions



