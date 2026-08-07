import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleInterviewRequest, getSessionState } from './agent/interviewEngine.js';
import { executeCandidateCode } from './agent/codeSandbox.js';
import { parseResumeText } from './agent/resumeParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load static JSON resources
const candidatesPath = path.join(__dirname, 'candidates.json');
const curriculumPath = path.join(__dirname, 'curriculum.json');

let candidatesData = { candidates: [] };
let curriculumData = { days: [], modules: [] };

try {
  candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf-8'));
} catch (e) {
  console.error('Failed to parse candidates.json:', e);
}

try {
  curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
} catch (e) {
  console.error('Failed to parse curriculum.json:', e);
}

// ----------------------------------------------------
// Technical Spec Required HTTP Endpoint
// POST /api/interview
// ----------------------------------------------------
app.post('/api/interview', (req, res) => {
  try {
    const payload = req.body || {};
    const result = handleInterviewRequest(payload);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling /api/interview:', error);
    return res.status(400).json({
      error: error.message || 'Invalid interview request',
      done: false
    });
  }
});

// Live Code Execution Sandbox
app.post('/api/execute-code', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body || {};
    const result = await executeCandidateCode(code, language);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      output: '',
      error: err.message || 'Sandbox execution failure'
    });
  }
});

// Resume Uploader & Parser
app.post('/api/parse-resume', (req, res) => {
  try {
    const { resumeText } = req.body || {};
    const parsed = parseResumeText(resumeText);
    return res.json({ success: true, resumeData: parsed });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Whisper STT Endpoint
app.post('/api/whisper', (req, res) => {
  try {
    const { textFallback } = req.body || {};
    const transcript = textFallback || "I implemented vector embeddings with cosine similarity distance metric in Python.";
    return res.json({ success: true, text: transcript });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Auxiliary API Endpoints
app.get('/api/candidates', (req, res) => {
  res.json(candidatesData);
});

app.get('/api/curriculum', (req, res) => {
  res.json(curriculumData);
});

app.get('/api/session/:sessionId', (req, res) => {
  const session = getSessionState(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({
    sessionId: session.sessionId,
    questionsAskedCount: session.questionsAskedCount,
    coveredDays: Array.from(session.coveredDays),
    done: session.done,
    history: session.history,
    evaluations: session.evaluations
  });
});

export default app;
