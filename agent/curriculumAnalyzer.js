import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load curriculum data
const curriculumPath = path.join(__dirname, '..', 'curriculum.json');
let curriculumData = { days: [], modules: [] };

try {
  const raw = fs.readFileSync(curriculumPath, 'utf-8');
  curriculumData = JSON.parse(raw);
} catch (err) {
  console.error('Error loading curriculum.json in analyzer:', err);
}

/**
 * Analyzes candidate profile against cohort curriculum
 */
export function analyzeCandidateCurriculum(candidate) {
  const missions = candidate.missions || [];
  const completedMissions = missions.filter(m => m.passed || !m.skipped);
  const skippedMissions = missions.filter(m => m.skipped);

  // Group completed missions by curriculum days
  const completedDaysMap = new Map();
  completedMissions.forEach(m => {
    const dayObj = curriculumData.days.find(d => d.day === m.day);
    if (dayObj) {
      completedDaysMap.set(m.day, {
        mission: m,
        curriculum: dayObj
      });
    }
  });

  // Target candidate-completed curriculum days (sort by day order)
  const availableDays = Array.from(completedDaysMap.keys()).sort((a, b) => a - b);

  return {
    candidateMember: candidate.member || {},
    signals: candidate.signals || {},
    completedMissions,
    skippedMissions,
    completedDaysMap,
    availableDays
  };
}

/**
 * Generates an initial baseline question for a candidate on a specific curriculum day
 */
export function generateQuestionForDay(candidate, dayNumber, questionIndex, contextHistory = []) {
  const dayObj = curriculumData.days.find(d => d.day === dayNumber);
  const candidateMission = (candidate.missions || []).find(m => m.day === dayNumber);
  
  if (!dayObj) {
    return {
      day: dayNumber,
      topic: "AI Engineering Fundamentals",
      text: "Can you explain how you designed your core AI application architecture during the cohort?",
      expectedConcepts: ["architecture", "llm", "rag", "agents"],
      tools: ["Python", "FastAPI"]
    };
  }

  const role = candidate.member?.jobRole || "AI Engineer";
  const attempts = candidateMission?.attempts || 1;
  const passed = candidateMission?.passed;

  // Custom question templates based on Curriculum Day & Objectives
  let questionText = "";
  const title = dayObj.title;
  const toolsStr = dayObj.tools?.join(", ") || "";
  const objectives = dayObj.objectives || [];

  switch (dayNumber) {
    case 7:
      questionText = `On Day 7 (${title}), you worked with tools like ${toolsStr}. How did you convert healthcare text documents into vector embeddings, and what distance metrics or dimensionality considerations did you keep in mind?`;
      break;
    case 8:
      questionText = `During Day 8 (${title}), you evaluated local vs. cloud vector databases (e.g., ChromaDB vs. Pinecone). What technical trade-offs guided your decision for the enterprise chatbot, and how did indexing strategies affect search latency?`;
      break;
    case 10:
      questionText = `Day 10 covered the Retrieval & Matching Engine. Can you walk me through how your query router decided between SQL structured queries, vector semantic search, or hybrid retrieval? How did you deduplicate and rank results?`;
      break;
    case 11:
      questionText = `On Day 11 (${title}), you built an end-to-end RAG pipeline. How did you construct grounded system prompts to prevent hallucinations while injecting retrieved context from vector search?`;
      break;
    case 12:
      questionText = `In Day 12 (Prompt Engineering Fundamentals), you experimented with zero-shot, few-shot, and Chain-of-Thought (CoT) prompting. How did you structure your prompt templates to achieve predictable system outputs?`;
      break;
    case 13:
      questionText = `Day 13 focused on Function Calling and Structured Outputs using Pydantic. How did you define function schemas for healthcare operations, and how did your system validate tool parameters before execution?`;
      break;
    case 16:
      questionText = `On Day 16 (${title}), you built the FastAPI backend for your chatbot. How did you handle API endpoint session management, concurrency, and backend database integrations?`;
      break;
    case 18:
      questionText = `During Day 18 (Streaming Responses), you implemented Server-Sent Events (SSE) in FastAPI. What challenges did you face when streaming tokens in real-time, and how did you handle client disconnects or mid-stream errors?`;
      break;
    case 20:
      questionText = `On Day 20 (${title}), you managed conversation memory and context window limits. How did you implement automated conversation summarization to stay within token budgets without losing crucial past context?`;
      break;
    case 21:
      questionText = `In Day 21 (LangChain Agents & Tool Use), you built a ReAct agent. How did your agent select tools dynamically based on user intent, and how did you inspect reasoning traces when tool execution failed?`;
      break;
    case 22:
      questionText = `On Day 22 (${title}), you implemented multi-agent orchestration using CrewAI or LangGraph. How did router agents delegate tasks to specialized agents, and what trade-offs did you observe compared to single-agent setups?`;
      break;
    case 23:
      questionText = `Day 23 introduced the Model Context Protocol (MCP). How did you build and expose your custom MCP server tools to clients like Claude Desktop or Cline, and what advantages did standardized MCP protocols offer?`;
      break;
    case 24:
      questionText = `On Day 24 (${title}), you integrated agents, MCP tools, and memory into a production pipeline. What fallback mechanisms and retries did you implement to handle external API failures or invalid tool responses?`;
      break;
    case 25:
      questionText = `Day 25 was about Chatbot Evaluation & Testing. How did you structure your benchmark dataset, and what metrics did you use to evaluate retrieval accuracy, answer grounding, and hallucination rates?`;
      break;
    case 28:
      questionText = `On Day 28 (${title}), you containerized and deployed your app with Docker & Kubernetes. How did you handle secrets management, environment configurations, and cluster health checks?`;
      break;
    case 29:
      questionText = `Day 29 focused on Monitoring, Logging & Observability. How did you set up structured logging and track metrics like latency, token consumption, and tool execution errors in production?`;
      break;
    case 31:
      questionText = `In your Day 31 Capstone Project, you presented a complete enterprise healthcare chatbot. What was the most critical architectural decision you made across the 31-day cohort, and how did you prove its production readiness?`;
      break;
    default:
      const firstObj = objectives[0] || `Mastering ${title}`;
      questionText = `Regarding Day ${dayNumber} (${title}), your objective was to: "${firstObj}". How did you implement this in your project using ${toolsStr || 'your selected tech stack'}?`;
      break;
  }

  // Adjust question framing slightly based on candidate role and attempts
  if (attempts > 3) {
    questionText += ` (I noticed this mission took ${attempts} attempts during the cohort, so I'd love to hear what key lessons or edge cases you discovered while solving it.)`;
  }

  return {
    day: dayNumber,
    topic: title,
    text: questionText,
    expectedConcepts: objectives.concat(dayObj.tools || []),
    tools: dayObj.tools || []
  };
}

export { curriculumData };
