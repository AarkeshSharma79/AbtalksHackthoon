import candidatesRaw from '../../candidates.json';

export const candidatesList = candidatesRaw.candidates || [];

export function getCandidateById(id) {
  return candidatesList.find(c => c.member.id === id) || candidatesList[0];
}

export function getCandidateStats(candidate) {
  const missions = candidate.missions || [];
  const completed = missions.filter(m => m.passed || !m.skipped).length;
  const skipped = missions.filter(m => m.skipped).length;
  const totalAttempts = missions.reduce((acc, m) => acc + (m.attempts || 1), 0);
  const avgAttempts = missions.length > 0 ? (totalAttempts / missions.length).toFixed(1) : 1;

  return {
    completed,
    skipped,
    totalAttempts,
    avgAttempts,
    firstTryRate: candidate.signals?.missionsCompleted > 0 
      ? Math.round((candidate.signals.missionsFirstTry / candidate.signals.missionsCompleted) * 100)
      : 70
  };
}
