import { handleInterviewRequest } from '../agent/interviewEngine.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'candidates.json'), 'utf-8')).candidates;

console.log("====================================================");
console.log("   AUTOMATED VERIFICATION OF POST /api/interview");
console.log("====================================================\n");

const testCandidate = candidates[0]; // Sarah Johnson (Senior Data Engineer)
const sessionId = "test-session-" + Date.now();

console.log(`1. Testing START INTERVIEW for ${testCandidate.member.name}...`);
let res1 = handleInterviewRequest({
  sessionId,
  candidate: testCandidate
});

console.log("Response 1:", JSON.stringify(res1, null, 2));
if (res1.done !== false || !res1.reply) {
  console.error("FAILED: Turn 1 response structure invalid");
  process.exit(1);
}

let turnCount = 1;
const mockAnswers = [
  "In Day 7, we converted document text into vector embeddings using Sentence Transformers with 384 dimensions. We evaluated Cosine Similarity vs Euclidean Distance and found cosine worked best for normalized semantic matching.",
  "For ChromaDB vs Pinecone, ChromaDB provided low-latency local execution during testing, whereas Pinecone offered managed index scalability for larger enterprise query workloads.",
  "Our query router analyzed user query intents: SQL for structured claim status lookups, Chroma vector search for document text, and hybrid reciprocal rank fusion to merge results.",
  "We constructed grounded prompts with explicit system instructions to restrict answers strictly to retrieved context blocks, injecting clear source citations.",
  "We defined function calling schemas using Pydantic, enabling automatic tool execution and robust parameter validation before executing SQLite database queries.",
  "In FastAPI, we implemented streaming responses using Server-Sent Events (SSE) and StreamingResponse to stream tokens in real-time while handling client drops gracefully.",
  "Conversation memory was persisted in SQLite. We implemented token sliding windows and summary buffers when history exceeded 2000 tokens.",
  "Our ReAct agent dynamically chose tools based on query intent and logged full reasoning traces to debug tool execution steps.",
  "We deployed the containerized chatbot to Kubernetes with health check probes, ConfigMaps for environment settings, and horizontal pod autoscalers."
];

let finalResult = null;
for (let i = 0; i < mockAnswers.length; i++) {
  turnCount++;
  console.log(`\nTurn ${turnCount}: Sending candidate answer...`);
  const stepRes = handleInterviewRequest({
    sessionId,
    message: mockAnswers[i]
  });
  console.log(`Response ${turnCount}:`, { done: stepRes.done, replyPreview: stepRes.reply.substring(0, 100) + "..." });

  if (stepRes.done) {
    finalResult = stepRes;
    break;
  }
}

if (!finalResult || !finalResult.done || !finalResult.feedback) {
  console.error("FAILED: Interview did not complete with structured feedback!");
  process.exit(1);
}

console.log("\n====================================================");
console.log("   SUCCESS! FINAL EVALUATION FEEDBACK RECEIVED:");
console.log("====================================================");
console.log("Summary:", finalResult.feedback.summary);
console.log("Strengths:", finalResult.feedback.strengths);
console.log("Gaps:", finalResult.feedback.gaps);
console.log("Next Steps:", finalResult.feedback.next);
console.log("\nAutomated API verification passed successfully!");
