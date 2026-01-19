export function analyzeInput(text: string) {
  const keywords = text.toLowerCase();

  let intent = "unknown";
  let score = 0.4;

  if (keywords.includes("learn")) {
    intent = "learning_goal";
    score += 0.3;
  }

  if (keywords.includes("backend")) {
    score += 0.2;
  }

  return {
    intent,
    confidenceScore: Math.min(score, 1),
    suggestedPath: [
      "Node.js fundamentals",
      "REST APIs",
      "PostgreSQL",
      "Authentication"
    ]
  };
}
