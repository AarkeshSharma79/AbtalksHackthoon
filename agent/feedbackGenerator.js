/**
 * Generates structured, actionable technical interview feedback.
 * 
 * Schema:
 * {
 *   "summary": string,
 *   "strengths": string[],
 *   "gaps": string[],
 *   "next": string[]
 * }
 */
export function generateInterviewFeedback(sessionState) {
  const candidate = sessionState.candidate || {};
  const member = candidate.member || {};
  const name = member.name || "Candidate";
  const role = member.jobRole || "Engineer";
  const history = sessionState.history || [];
  const coveredDays = Array.from(sessionState.coveredDays || []);
  const responseEvaluations = sessionState.evaluations || [];

  // Calculate high-level performance indicators
  const totalTurns = responseEvaluations.length;
  let totalScore = 0;
  let strongAreas = [];
  let weakAreas = [];

  responseEvaluations.forEach(ev => {
    totalScore += (ev.score || 0.7);
    if ((ev.score || 0.7) >= 0.75) {
      strongAreas.push(ev.topic || `Day ${ev.day}`);
    } else {
      weakAreas.push(ev.topic || `Day ${ev.day}`);
    }
  });

  const avgScore = totalTurns > 0 ? (totalScore / totalTurns) : 0.75;
  
  // Synthesize Summary
  let summary = "";
  if (avgScore >= 0.85) {
    summary = `${name} demonstrated outstanding technical command across ${coveredDays.length} curriculum days. They articulated complex AI engineering decisions clearly, showing strong mastery in enterprise RAG architecture, agent orchestration, and system optimization.`;
  } else if (avgScore >= 0.7) {
    summary = `${name} showed solid practical understanding of the ABTalks AI Cohort curriculum, successfully addressing core concepts in retrieval engines, prompt design, and backend APIs across ${coveredDays.length} days. Further depth in edge-case optimization and production deployment will solidify their senior expertise.`;
  } else {
    summary = `${name} demonstrated a foundational grasp of AI engineering workflows across ${coveredDays.length} cohort modules. While able to describe basic RAG and API implementations, they will benefit from deeper hands-on practice with production evaluation, error handling, and multi-agent coordination.`;
  }

  // Synthesize Strengths
  const strengths = [];
  if (strongAreas.length > 0) {
    strengths.push(`Strong architectural understanding of ${[...new Set(strongAreas)].slice(0, 3).join(', ')}.`);
  } else {
    strengths.push(`Clear enthusiasm and baseline conceptual understanding across ${role} competencies.`);
  }

  strengths.push(`Demonstrated ability to explain practical implementation details from completed cohort missions.`);

  if (candidate.signals?.commitDays >= 25) {
    strengths.push(`High engagement and consistency during the cohort (${candidate.signals.commitDays} active commit days).`);
  } else {
    strengths.push(`Proactive approach to tackling multi-step AI engineering tasks.`);
  }

  // Synthesize Gaps / Growth Areas
  const gaps = [];
  if (weakAreas.length > 0) {
    gaps.push(`Could deepen technical specifics around ${[...new Set(weakAreas)].slice(0, 2).join(' and ')}.`);
  }
  
  // Check skipped missions in candidate profile
  const skippedMissions = (candidate.missions || []).filter(m => m.skipped);
  if (skippedMissions.length > 0) {
    const skippedTitles = skippedMissions.map(m => m.title).join(', ');
    gaps.push(`Skipped topics during cohort (${skippedTitles}) require review for comprehensive coverage.`);
  } else {
    gaps.push(`Could provide more quantitative performance metrics when discussing production trade-offs.`);
  }

  gaps.push(`Further practice needed in articulating failure modes, fallback mechanisms, and security guardrails.`);

  // Synthesize Next Recommended Steps
  const next = [
    `Build an end-to-end benchmark suite (using Ragas or custom test sets) to measure RAG retrieval accuracy and hallucination rates quantitatively.`,
    `Implement standardized Model Context Protocol (MCP) servers and robust multi-agent error recovery pipelines for production robustness.`,
    `Review system design patterns for streaming low-latency responses, context truncation strategies, and Kubernetes deployment monitoring.`
  ];

  return {
    summary,
    strengths: [...new Set(strengths)].slice(0, 4),
    gaps: [...new Set(gaps)].slice(0, 4),
    next: next.slice(0, 4)
  };
}
