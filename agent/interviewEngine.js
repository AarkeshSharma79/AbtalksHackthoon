import { analyzeCandidateCurriculum, generateQuestionForDay } from './curriculumAnalyzer.js';
import { generateInterviewFeedback } from './feedbackGenerator.js';

// In-memory session store
const sessions = new Map();

/**
 * Normalizes keyword matching for technical concepts
 */
function evaluateResponseDepth(userMessage, currentQuestion) {
  const text = (userMessage || '').toLowerCase();
  const words = text.split(/\s+/).length;
  
  // Check technical keywords relevant to the topic
  const expectedKeywords = (currentQuestion.expectedConcepts || []).map(c => String(c).toLowerCase());
  const tools = (currentQuestion.tools || []).map(t => String(t).toLowerCase());

  let matchedCount = 0;
  expectedKeywords.concat(tools).forEach(kw => {
    if (text.includes(kw)) matchedCount++;
  });

  const isShort = words < 12;
  const isDetailed = words > 30 || matchedCount >= 2;

  let score = 0.7; // default solid base
  if (isDetailed) score += 0.2;
  if (isShort) score -= 0.25;

  return {
    words,
    matchedCount,
    isShort,
    isDetailed,
    score: Math.min(1.0, Math.max(0.2, score))
  };
}

/**
 * Generates an intelligent follow-up question based on candidate response
 */
function generateFollowUp(currentQuestion, userMessage, evaluation) {
  const day = currentQuestion.day;
  const topic = currentQuestion.topic;

  if (evaluation.isShort) {
    return `Could you expand a bit more on the specific implementation details for ${topic}? For instance, what specific parameters, errors, or trade-offs did you encounter?`;
  }

  // Topic specific follow-ups
  if (day === 7 || day === 8 || day === 10) {
    return `That's a solid breakdown of ${topic}. When scaling this retrieval setup to millions of documents, how would you optimize chunk sizes, embedding index updates, or vector search distance calculation speed?`;
  } else if (day === 11 || day === 12 || day === 13) {
    return `Interesting approach to ${topic}. How did you handle edge cases such as prompt injections, invalid structured JSON outputs, or fallback responses when the model failed to follow instructions?`;
  } else if (day === 21 || day === 22 || day === 23) {
    return `Great explanation of your agentic design. In a multi-agent system, how did you prevent infinite reasoning loops, control token latency, and ensure strict state synchronization between worker agents?`;
  } else if (day === 28 || day === 29 || day === 31) {
    return `Excellent point regarding ${topic}. In a high-availability production environment, how would you configure zero-downtime rolling updates and automated monitoring alerts for degraded LLM response quality?`;
  }

  return `That makes sense. In hindsight, if you were to redesign your ${topic} architecture for enterprise scale, what key change would you make first?`;
}

/**
 * Handles POST /api/interview API requests
 */
export function handleInterviewRequest(payload) {
  const { sessionId, candidate, message } = payload;

  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  // 1. START INTERVIEW SESSION (First request with candidate object)
  if (candidate && !sessions.has(sessionId)) {
    const analysis = analyzeCandidateCurriculum(candidate);
    const availableDays = analysis.availableDays;
    
    // Pick at least 4-6 distinct days to cover to meet minimum requirements (min 8 questions, min 4 days)
    // If candidate has days [7, 8, 10, 12, 16, 22, 23, 28, 31]
    const targetDays = availableDays.length >= 4 ? availableDays : [7, 10, 13, 21, 28, 31];

    const sessionState = {
      sessionId,
      candidate,
      analysis,
      targetDays,
      currentDayIndex: 0,
      coveredDays: new Set(),
      questionsAskedCount: 0,
      isAskingFollowUp: false,
      history: [],
      evaluations: [],
      currentQuestion: null,
      done: false
    };

    // Pick first curriculum day question
    const firstDay = targetDays[0];
    const q1 = generateQuestionForDay(candidate, firstDay, 1);

    sessionState.currentQuestion = q1;
    sessionState.questionsAskedCount = 1;
    sessionState.coveredDays.add(firstDay);

    const welcomeMemberName = candidate.member?.name ? candidate.member.name.split(' ')[0] : 'Candidate';
    const welcomeMsg = `Welcome ${welcomeMemberName}! I'm your AI Interviewer for the ABTalks AI Cohort. I've reviewed your project missions and cohort journey, and I'm excited to dive into your technical work. Let's begin!\n\nQuestion 1 (Day ${q1.day} - ${q1.topic}): ${q1.text}`;

    sessionState.history.push({ role: 'assistant', text: welcomeMsg });
    sessions.set(sessionId, sessionState);

    return {
      reply: welcomeMsg,
      done: false
    };
  }

  // Retrieve active session
  let session = sessions.get(sessionId);

  // If session doesn't exist yet and candidate wasn't provided, create default fallback candidate
  if (!session) {
    const defaultCandidate = {
      member: { id: "CAND-DEFAULT", name: "Cohort Candidate", jobRole: "AI Engineer" },
      missions: [
        { day: 7, title: "Embeddings Explained", passed: true },
        { day: 10, title: "Retrieval & Matching Engine", passed: true },
        { day: 13, title: "Function Calling", passed: true },
        { day: 21, title: "LangChain Agents", passed: true },
        { day: 28, title: "Docker & Kubernetes Deployment", passed: true },
        { day: 31, title: "Capstone Project", passed: true }
      ]
    };
    return handleInterviewRequest({ sessionId, candidate: defaultCandidate, message });
  }

  // If interview was already marked done
  if (session.done) {
    const feedback = generateInterviewFeedback(session);
    return {
      reply: "Interview completed. Thank you for your responses!",
      done: true,
      feedback
    };
  }

  // 2. CONVERSATION TURN
  const userText = message || "";
  session.history.push({ role: 'user', text: userText });

  // Evaluate candidate response
  const currentQ = session.currentQuestion;
  const evaluation = evaluateResponseDepth(userText, currentQ);
  session.evaluations.push({
    day: currentQ.day,
    topic: currentQ.topic,
    userText,
    score: evaluation.score,
    isShort: evaluation.isShort
  });

  // Decide whether to ask a follow-up or move to next curriculum question
  const totalAsked = session.questionsAskedCount;
  const coveredCount = session.coveredDays.size;

  // Criteria for ending interview:
  // Must ask at least 8 questions AND cover at least 4 distinct days
  const isMinRequirementsMet = totalAsked >= 8 && coveredCount >= 4;

  if (isMinRequirementsMet && (!session.isAskingFollowUp || evaluation.score >= 0.7)) {
    session.done = true;
    const finalFeedback = generateInterviewFeedback(session);
    const endingReply = `Thank you for sharing those detailed engineering insights, ${session.candidate.member?.name || 'Candidate'}! That wraps up our technical interview session for the ABTalks AI Cohort. I've compiled your full evaluation feedback below.`;
    
    session.history.push({ role: 'assistant', text: endingReply });

    return {
      reply: endingReply,
      done: true,
      feedback: finalFeedback
    };
  }

  // Determine next question: follow-up vs. new day
  let nextReplyText = "";
  let isFollowUpTurn = false;

  // Ask a follow-up if response was short/vague or if we need extra depth on this topic before moving on
  if (!session.isAskingFollowUp && (evaluation.isShort || totalAsked < 4)) {
    isFollowUpTurn = true;
    session.isAskingFollowUp = true;
    session.questionsAskedCount += 1;
    
    const followUpQText = generateFollowUp(currentQ, userText, evaluation);
    nextReplyText = `Follow-up (Day ${currentQ.day}): ${followUpQText}`;
    
    session.currentQuestion = {
      day: currentQ.day,
      topic: currentQ.topic,
      text: followUpQText,
      expectedConcepts: currentQ.expectedConcepts,
      tools: currentQ.tools
    };
  } else {
    // Move to next curriculum day
    session.isAskingFollowUp = false;
    session.currentDayIndex = (session.currentDayIndex + 1) % session.targetDays.length;
    
    const nextDay = session.targetDays[session.currentDayIndex];
    session.coveredDays.add(nextDay);
    session.questionsAskedCount += 1;

    const nextQ = generateQuestionForDay(session.candidate, nextDay, session.questionsAskedCount);
    session.currentQuestion = nextQ;

    nextReplyText = `Question ${session.questionsAskedCount} (Day ${nextQ.day} - ${nextQ.topic}): ${nextQ.text}`;
  }

  session.history.push({ role: 'assistant', text: nextReplyText });

  return {
    reply: nextReplyText,
    done: false
  };
}

/**
 * Gets session details for debugging or UI inspection
 */
export function getSessionState(sessionId) {
  return sessions.get(sessionId);
}
