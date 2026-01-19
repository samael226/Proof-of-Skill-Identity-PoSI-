# PoSI (Proof-of-Skill Identity) — Step 3: Core Algorithms

This step defines the **heart of PoSI**.
These algorithms turn raw submissions into **trustable proof**.

No AI required for MVP — logic > hype.

---

## 🎯 Algorithm 1: Base Skill Score

The base score measures **actual problem correctness**.

### Inputs

* `testCasesPassed`
* `totalTestCases`
* `maxScore` (default 100)

### Formula

```
correctnessRatio = testCasesPassed / totalTestCases
baseScore = correctnessRatio * maxScore
```

### Example

* 8 / 10 test cases passed
* maxScore = 100

→ baseScore = 80

---

## ⏱️ Algorithm 2: Time Efficiency Modifier

Rewards solving under pressure.

### Inputs

* `timeTakenSeconds`
* `timeLimitSeconds`

### Formula

```
timeRatio = timeTakenSeconds / timeLimitSeconds

if timeRatio <= 0.5 → bonus = +10
if timeRatio <= 0.75 → bonus = +5
else → bonus = 0
```

---

## 📏 Algorithm 3: Constraint Compliance

Checks if the solution respects rules (loops only, no built-ins, etc).

### Inputs

* `violationsCount`

### Formula

```
penalty = violationsCount * 5
```

---

## 🧮 Final Score Calculation

```
finalScore = baseScore + timeBonus - constraintPenalty
finalScore = clamp(finalScore, 0, 100)
```

---

## 🧠 Algorithm 4: Confidence Index (PoSI Signature)

This is **what makes PoSI different**.

Confidence answers:

> “How much can this skill be trusted?”

### Inputs

* `finalScore`
* `difficultyWeight`
* `attemptCount`

### Difficulty Weight

* EASY → 0.8
* MEDIUM → 1.0
* HARD → 1.2

### Formula

```
rawConfidence = (finalScore / 100) * difficultyWeight
retryPenalty = (attemptCount - 1) * 0.05

confidenceIndex = rawConfidence - retryPenalty
confidenceIndex = clamp(confidenceIndex, 0, 1)
```

---

## 🚨 Algorithm 5: Anti-Cheat Heuristics (MVP)

This does **not block users** — it flags behavior.

### Flags

#### 1️⃣ Suspicious Speed

```
if timeTakenSeconds < (timeLimitSeconds * 0.1)
→ FLAG: SUSPICIOUS_SPEED
```

#### 2️⃣ Copy/Paste Burst

```
if pasteEvents > 3 within 10 seconds
→ FLAG: COPY_PASTE
```

#### 3️⃣ Similarity Detection (Basic)

```
if similarity(submissionA, submissionB) > 85%
→ FLAG: POSSIBLE_PLAGIARISM
```

---

## 🏅 Proof Issuance Rules

A SkillProof is created ONLY if:

```
finalScore >= 70
AND no HIGH severity cheat flags
```

Once created:

* Immutable
* Public
* Verifiable

---

## 🧠 Why These Algorithms Matter

* Transparent
* Explainable
* Auditable
* Fair
* Hard to game

This is **trust engineering**, not gamification.

---


