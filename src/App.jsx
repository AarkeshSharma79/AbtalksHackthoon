import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CandidateSelect } from './components/CandidateSelect';
import { InterviewRoom } from './components/InterviewRoom';
import { FeedbackView } from './components/FeedbackView';
import { ApiTester } from './components/ApiTester';
import { candidatesList } from './data/candidatesData';

export function App() {
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'candidates' | 'api'
  const [selectedCandidate, setSelectedCandidate] = useState(candidatesList[0]);
  const [sessionId, setSessionId] = useState('session-' + Date.now());
  const [sessionState, setSessionState] = useState({
    history: [],
    questionsAskedCount: 0,
    coveredDays: [],
    currentQuestion: null,
    done: false,
    feedback: null
  });
  const [ttsEnabled, setTtsEnabled] = useState(false);

  // Initialize interview session on load or candidate switch
  const startNewInterviewSession = async (candidateToUse) => {
    const candidate = candidateToUse || selectedCandidate;
    const newSessionId = 'session-' + Date.now();
    setSessionId(newSessionId);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newSessionId,
          candidate
        })
      });
      const data = await res.json();
      
      setSessionState({
        history: [{ role: 'assistant', text: data.reply }],
        questionsAskedCount: 1,
        coveredDays: [7], // initial day
        currentQuestion: { day: 7, topic: "Embeddings Explained" },
        done: data.done,
        feedback: data.feedback || null
      });
    } catch (err) {
      console.error("Error starting interview session:", err);
    }
  };

  useEffect(() => {
    startNewInterviewSession(selectedCandidate);
  }, []);

  // Send candidate turn message
  const handleSendMessage = async (msgText) => {
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: msgText
        })
      });
      const data = await res.json();

      setSessionState(prev => {
        const newHistory = [
          ...prev.history,
          { role: 'user', text: msgText },
          { role: 'assistant', text: data.reply }
        ];

        // Fetch current session details from server for real-time accuracy
        fetch(`/api/session/${sessionId}`)
          .then(r => r.json())
          .then(sData => {
            if (sData && !sData.error) {
              setSessionState(st => ({
                ...st,
                questionsAskedCount: sData.questionsAskedCount || st.questionsAskedCount,
                coveredDays: sData.coveredDays || st.coveredDays
              }));
            }
          })
          .catch(e => {});

        return {
          ...prev,
          history: newHistory,
          questionsAskedCount: prev.questionsAskedCount + 1,
          done: data.done,
          feedback: data.feedback || prev.feedback
        };
      });
    } catch (err) {
      console.error("Error in turn message:", err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        currentSessionId={sessionId}
        isDone={sessionState.done}
      />

      <main style={{ flex: 1, paddingBottom: '2rem' }}>
        {activeTab === 'candidates' && (
          <CandidateSelect
            selectedCandidate={selectedCandidate}
            onSelectCandidate={(cand) => {
              setSelectedCandidate(cand);
            }}
            onStartInterview={(cand) => {
              setSelectedCandidate(cand);
              startNewInterviewSession(cand);
              setActiveTab('interview');
            }}
          />
        )}

        {activeTab === 'interview' && (
          sessionState.done && sessionState.feedback ? (
            <FeedbackView
              feedback={sessionState.feedback}
              candidate={selectedCandidate}
              onRestart={() => {
                startNewInterviewSession(selectedCandidate);
              }}
            />
          ) : (
            <InterviewRoom
              candidate={selectedCandidate}
              sessionState={sessionState}
              onSendMessage={handleSendMessage}
              onRestart={() => startNewInterviewSession(selectedCandidate)}
              ttsEnabled={ttsEnabled}
            />
          )
        )}

        {activeTab === 'api' && (
          <ApiTester />
        )}
      </main>
    </div>
  );
}
