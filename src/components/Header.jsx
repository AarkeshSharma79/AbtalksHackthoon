import React from 'react';
import { Bot, Terminal, Users, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

export function Header({ activeTab, setActiveTab, ttsEnabled, setTtsEnabled, currentSessionId, isDone }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-light)',
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Bot size={24} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }} className="gradient-text">
                ABTalks AI Interview Agent
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                Enterprise Cohort
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              31-Day AI Engineering Program · Personalized Multi-Turn Technical Interview
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          gap: '0.3rem'
        }}>
          <button
            onClick={() => setActiveTab('interview')}
            style={{
              background: activeTab === 'interview' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'transparent',
              color: activeTab === 'interview' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            Interview Studio
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            style={{
              background: activeTab === 'candidates' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'transparent',
              color: activeTab === 'candidates' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={16} />
            Candidate Roster
          </button>

          <button
            onClick={() => setActiveTab('api')}
            style={{
              background: activeTab === 'api' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))' : 'transparent',
              color: activeTab === 'api' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Terminal size={16} />
            API Playground
          </button>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* TTS Audio toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? "Text-to-Speech Audio Enabled" : "Text-to-Speech Muted"}
            style={{
              background: ttsEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: ttsEnabled ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-light)',
              color: ttsEnabled ? 'var(--accent-emerald)' : 'var(--text-muted)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{ttsEnabled ? "Voice On" : "Voice Off"}</span>
          </button>

          {/* Session pill */}
          {currentSessionId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
              color: isDone ? 'var(--accent-emerald)' : 'var(--accent-indigo)',
              fontWeight: 600
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isDone ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
              }} />
              {isDone ? 'Completed' : `Session: ${currentSessionId.substring(0, 10)}...`}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
