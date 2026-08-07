import React from 'react';
import { Bot, Sparkles, Mic, Cpu } from 'lucide-react';

export function InterviewerAvatar({ state = 'idle', isSpeaking = false, currentTopic = '' }) {
  // state: 'idle' | 'thinking' | 'speaking' | 'evaluating'

  let glowColor = 'var(--accent-indigo)';
  let statusText = 'Ready';
  
  if (state === 'thinking') {
    glowColor = 'var(--accent-cyan)';
    statusText = 'Evaluating response & reasoning...';
  } else if (state === 'speaking' || isSpeaking) {
    glowColor = 'var(--accent-emerald)';
    statusText = 'Interviewer speaking...';
  } else if (state === 'evaluating') {
    glowColor = 'var(--accent-violet)';
    statusText = 'Formulating next technical question...';
  }

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(28, 25, 75, 0.5))',
      borderColor: glowColor
    }}>
      {/* Animated Persona Circle */}
      <div style={{ position: 'relative' }}>
        <div 
          className={`avatar-pulsing`}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${glowColor}, #0f172a)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${glowColor}`,
            transition: 'all 0.3s ease'
          }}
        >
          <Bot size={32} color="white" />
        </div>

        {/* Orbiting indicator if thinking */}
        {state === 'thinking' && (
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px dashed var(--accent-cyan)',
            animation: 'spin 4s linear infinite'
          }} />
        )}
      </div>

      {/* Info & Status */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            AI Technical Lead Interviewer
          </h3>
          <span style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: glowColor,
            fontWeight: 700,
            border: `1px solid ${glowColor}`
          }}>
            {statusText}
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {currentTopic ? `Active Topic: ${currentTopic}` : 'ABTalks AI Engineering Cohort Assessment'}
        </p>

        {/* Live Audio Wave visualizer when speaking */}
        {(state === 'speaking' || isSpeaking) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '0.5rem' }}>
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginLeft: '0.4rem', fontWeight: 600 }}>
              Audio Streaming
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
