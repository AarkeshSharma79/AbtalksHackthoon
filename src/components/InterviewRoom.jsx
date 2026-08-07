import React, { useState, useEffect, useRef } from 'react';
import { InterviewerAvatar } from './InterviewerAvatar';
import { CurriculumTracker } from './CurriculumTracker';
import { VoiceRecorder } from './VoiceRecorder';
import { LiveCodingSandbox } from './LiveCodingSandbox';
import { ResumeUploader } from './ResumeUploader';
import { Send, Sparkles, RefreshCw, Volume2, Lightbulb, Code, FileText, MessageSquare } from 'lucide-react';

export function InterviewRoom({ candidate, sessionState, onSendMessage, onRestart, ttsEnabled }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'code' | 'resume'
  const [resumeContext, setResumeContext] = useState(null);
  const chatEndRef = useRef(null);

  const history = sessionState?.history || [];
  const questionsAskedCount = sessionState?.questionsAskedCount || 1;
  const coveredDays = sessionState?.coveredDays || [];
  const currentQuestion = sessionState?.currentQuestion;

  const activeDay = currentQuestion?.day || 7;
  const activeTopic = currentQuestion?.topic || 'Embeddings & RAG';

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  // Text-to-speech for last assistant message if enabled
  useEffect(() => {
    if (ttsEnabled && history.length > 0) {
      const lastMsg = history[history.length - 1];
      if (lastMsg.role === 'assistant' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [history, ttsEnabled]);

  const handleSend = async (customMessage) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim() || isTyping) return;
    
    setInputText('');
    setIsTyping(true);

    try {
      await onSendMessage(textToSend);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick preset response templates
  const presets = [
    {
      label: "⭐ High-Depth Expert Answer",
      text: `In our project for Day ${activeDay}, we engineered a complete production pipeline using ${currentQuestion?.tools?.slice(0, 2).join(' and ') || 'our core stack'}. We evaluated performance, handled edge cases, and implemented robust parameter validation and error logging.`
    },
    {
      label: "⚡ Brief Answer (Triggers Follow-Up)",
      text: `We used ${currentQuestion?.tools?.[0] || 'Python'} for Day ${activeDay} to handle the basic tasks.`
    },
    {
      label: "❓ Clarifying / Trade-Off Question",
      text: `We chose this architecture to optimize query latency vs indexing costs. Could you elaborate on how enterprise SLA targets affect this choice?`
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', minHeight: '82vh' }}>
      
      {/* Left Chat & Interviewer View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
        
        {/* Top Interviewer Avatar */}
        <InterviewerAvatar
          state={isTyping ? 'thinking' : 'idle'}
          isSpeaking={false}
          currentTopic={`Day ${activeDay}: ${activeTopic}`}
        />

        {/* Mode Selector Navigation (Chat / Live Coding Sandbox / Resume Fusion) */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => setActiveMode('chat')}
            style={{
              background: activeMode === 'chat' ? 'var(--accent-indigo)' : 'transparent',
              color: activeMode === 'chat' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <MessageSquare size={15} />
            Voice & Chat Interview
          </button>

          <button
            onClick={() => setActiveMode('code')}
            style={{
              background: activeMode === 'code' ? 'var(--accent-indigo)' : 'transparent',
              color: activeMode === 'code' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Code size={15} color="var(--accent-cyan)" />
            Live Coding Sandbox Round
          </button>

          <button
            onClick={() => setActiveMode('resume')}
            style={{
              background: activeMode === 'resume' ? 'var(--accent-indigo)' : 'transparent',
              color: activeMode === 'resume' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FileText size={15} color="var(--accent-amber)" />
            Resume-Aware Customizer
          </button>
        </div>

        {/* MODE 1: CHAT & VOICE INTERVIEW */}
        {activeMode === 'chat' && (
          <div className="glass-panel" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            maxHeight: '600px',
            overflow: 'hidden'
          }}>
            {/* Scrollable Transcript */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAssistant ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {isAssistant ? (
                        <>
                          <Sparkles size={12} color="var(--accent-cyan)" />
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>AI Technical Interviewer</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>{candidate?.member?.name || 'Candidate'}</span>
                        </>
                      )}
                    </div>

                    <div style={{
                      maxWidth: '85%',
                      background: isAssistant ? 'rgba(30, 41, 59, 0.85)' : 'linear-gradient(135deg, var(--accent-indigo), #4f46e5)',
                      border: isAssistant ? '1px solid var(--border-light)' : 'none',
                      color: 'white',
                      padding: '0.9rem 1.1rem',
                      borderRadius: isAssistant ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      boxShadow: isAssistant ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 14px rgba(99, 102, 241, 0.3)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.82rem' }}>
                  <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>AI Interviewer is evaluating your response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Presets & Voice STT Bar */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Lightbulb size={12} color="var(--accent-amber)" /> Presets:
                </span>
                {presets.map((p, i) => (
                  <button key={i} className="preset-chip" onClick={() => setInputText(p.text)}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Whisper Voice Recorder Button */}
              <VoiceRecorder onTranscript={(text) => {
                setInputText(text);
              }} />
            </div>

            {/* Input Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or speak your technical answer (Shift+Enter for newline)..."
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />

              <button
                className="btn-primary"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isTyping}
                style={{ padding: '0 1.4rem' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: LIVE CODING SANDBOX */}
        {activeMode === 'code' && (
          <LiveCodingSandbox
            currentDay={activeDay}
            onSubmitCodeSolution={(solutionMsg) => {
              handleSend(solutionMsg);
              setActiveMode('chat');
            }}
          />
        )}

        {/* MODE 3: RESUME CUSTOMIZER */}
        {activeMode === 'resume' && (
          <ResumeUploader
            onResumeParsed={(data) => {
              setResumeContext(data);
              handleSend(`[Resume Updated: ${data.summary}] Candidate has uploaded their custom resume highlighting ${data.skills.join(', ')}.`);
              setActiveMode('chat');
            }}
          />
        )}
      </div>

      {/* Right Sidebar Curriculum & Requirement Tracker */}
      <CurriculumTracker
        candidate={candidate}
        questionsAskedCount={questionsAskedCount}
        coveredDays={coveredDays}
        currentDay={activeDay}
      />
    </div>
  );
}
