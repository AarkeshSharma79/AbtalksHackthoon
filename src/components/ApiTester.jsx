import React, { useState } from 'react';
import { Terminal, Send, Play, Copy, Check, Sparkles } from 'lucide-react';
import { candidatesList } from '../data/candidatesData';

export function ApiTester() {
  const [sessionId, setSessionId] = useState('session-' + Math.floor(Math.random() * 10000));
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [responseLog, setResponseLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentCandidate = candidatesList[candidateIndex] || candidatesList[0];

  const handleStartRequest = async () => {
    setLoading(true);
    const payload = {
      sessionId,
      candidate: currentCandidate
    };

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponseLog(prev => [
        { type: 'REQ', payload, timestamp: new Date().toLocaleTimeString() },
        { type: 'RES', status: res.status, data, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } catch (err) {
      setResponseLog(prev => [
        { type: 'ERR', error: err.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTurnRequest = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const payload = {
      sessionId,
      message
    };

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponseLog(prev => [
        { type: 'REQ', payload, timestamp: new Date().toLocaleTimeString() },
        { type: 'RES', status: res.status, data, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
      setMessage('');
    } catch (err) {
      setResponseLog(prev => [
        { type: 'ERR', error: err.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Terminal size={22} className="gradient-text-cyan" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Technical Specification HTTP Sandbox</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Test the exact <code>POST /api/interview</code> HTTP endpoint specification defined in <code>technical-spec.md</code>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Request Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Request Builder</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Session ID (sessionId)
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Action 1: Start Session */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-light)',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
              1. Initialize Interview Session (POST /api/interview)
            </h4>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select Candidate Profile:</label>
              <select
                value={candidateIndex}
                onChange={e => setCandidateIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid var(--border-light)',
                  color: 'white',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginTop: '0.2rem'
                }}
              >
                {candidatesList.map((c, idx) => (
                  <option key={c.member.id} value={idx}>
                    {c.member.id} - {c.member.name} ({c.member.jobRole})
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary" onClick={handleStartRequest} disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
              <Play size={14} /> Send Session Init Payload
            </button>
          </div>

          {/* Action 2: Conversation Turn */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-light)',
            padding: '1rem',
            borderRadius: '10px'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-indigo)' }}>
              2. Conversation Turn Message (POST /api/interview)
            </h4>
            <textarea
              rows={3}
              placeholder="Candidate response message payload..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.6rem',
                color: 'white',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.5rem',
                resize: 'vertical'
              }}
            />
            <button className="btn-secondary" onClick={handleTurnRequest} disabled={loading || !message.trim()} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
              <Send size={14} /> Send Message Payload
            </button>
          </div>
        </div>

        {/* Live Response Inspector Log */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live HTTP Response Inspector</h3>
            <button
              onClick={() => setResponseLog([])}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Clear Log
            </button>
          </div>

          <div style={{
            flex: 1,
            background: '#05070f',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            overflowY: 'auto',
            maxHeight: '520px'
          }}>
            {responseLog.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', textAlign: 'center', paddingTop: '4rem' }}>
                No HTTP requests executed yet. Click one of the request builder actions to inspect raw JSON payloads.
              </div>
            ) : (
              responseLog.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: log.type === 'REQ' ? 'var(--accent-cyan)' : log.type === 'RES' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                    }}>
                      [{log.type}] {log.status ? `HTTP ${log.status}` : ''}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: log.type === 'REQ' ? '#93c5fd' : '#a7f3d0' }}>
                    {JSON.stringify(log.payload || log.data || log.error, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
