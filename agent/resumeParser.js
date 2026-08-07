/**
 * Resume Parsing and CV Fusion Engine
 */

// Key technical skills dictionary for NLP extraction
const TECH_SKILLS = [
  "python", "javascript", "typescript", "react", "fastapi", "express", "node", "docker",
  "kubernetes", "sql", "sqlite", "postgres", "mongodb", "chromadb", "pinecone", "qdrant",
  "langchain", "crewai", "langgraph", "mcp", "openai", "gemini", "ollama", "qlora", "lora",
  "pytorch", "tensorflow", "pandas", "scikit-learn", "aws", "gcp", "azure", "git", "ci/cd"
];

export function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      name: "Candidate",
      title: "AI Engineer",
      yearsExp: 3,
      skills: ["Python", "FastAPI", "RAG", "Vector DBs"],
      summary: "Experienced software engineer specializing in AI/ML solutions."
    };
  }

  const textLower = rawText.toLowerCase();

  // Extract matched skills
  const extractedSkills = TECH_SKILLS.filter(skill => textLower.includes(skill))
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // Deduplicate and format skills
  const skills = Array.from(new Set(extractedSkills));
  if (skills.length === 0) {
    skills.push("Python", "AI Engineering", "REST APIs", "RAG Pipelines");
  }

  // Infer experience level
  let yearsExp = 3;
  const expMatch = textLower.match(/(\d+)\+?\s*years?\s+(?:of\s+)?experience/);
  if (expMatch && expMatch[1]) {
    yearsExp = parseInt(expMatch[1], 10);
  }

  // Infer target role
  let title = "AI Engineer";
  if (textLower.includes("senior") || yearsExp >= 6) title = "Senior AI Architect";
  else if (textLower.includes("data engineer")) title = "Data & AI Engineer";
  else if (textLower.includes("devops")) title = "AI Systems & DevOps Engineer";
  else if (textLower.includes("backend")) title = "Backend & LLM Engineer";

  return {
    title,
    yearsExp,
    skills,
    rawText: rawText.substring(0, 1500),
    summary: `Extracted ${skills.length} core technical competencies (${skills.slice(0, 5).join(', ')}) with ~${yearsExp} years industry experience.`
  };
}

/**
 * Fuses resume insights directly into interview question framing
 */
export function fuseResumeQuestion(baseQuestionText, resumeData) {
  if (!resumeData || !resumeData.skills || resumeData.skills.length === 0) {
    return baseQuestionText;
  }

  const primarySkill = resumeData.skills[0];
  const exp = resumeData.yearsExp || 3;

  return `[Resume-Aware Context: Given your ${exp}+ years experience with ${primarySkill}]\n${baseQuestionText}`;
}
