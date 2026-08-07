import React from 'react';
import { CheckCircle, AlertOctagon, ArrowRight, Download, Copy, RefreshCw, Award, Sparkles } from 'lucide-react';

export function FeedbackView({ feedback, candidate, onRestart }) {
  if (!feedback) return null;

  const member = candidate?.member || {};
  const { summary, strengths = [], gaps = [], next = [] } = feedback;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(feedback, null, 2));
    alert("Feedback JSON copied to clipboard!");
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedback, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Interview_Feedback_${member.name || 'Candidate'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '2rem', marginBottom: '2rem', textAlignment: 'center', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.85))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={36} color="var(--accent-amber)" />
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">
                Technical Interview Evaluation Report
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Candidate: <strong style={{ color: 'white' }}>{member.name}</strong> ({member.jobRole || 'AI Cohort'})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={handleCopyJSON} style={{ fontSize: '0.8rem' }}>
              <Copy size={15} /> Copy JSON
            </button>
            <button className="btn-primary" onClick={handleDownloadJSON} style={{ fontSize: '0.8rem' }}>
              <Download size={15} /> Export JSON Report
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-cyan)',
          marginTop: '1rem'
        }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Executive Assessment Summary
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            {summary}
          </p>
        </div>
      </div>

      {/* Grid of Strengths, Gaps & Next Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Strengths */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-emerald)' }}>
            <CheckCircle size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Key Technical Strengths</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {strengths.map((item, idx) => (
              <li key={idx} style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                lineHeight: 1.5
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-amber)' }}>
            <AlertOctagon size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Identified Knowledge Gaps</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {gaps.map((item, idx) => (
              <li key={idx} style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                lineHeight: 1.5
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Next Steps */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-indigo)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-indigo)' }}>
            <ArrowRight size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recommended Next Steps</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {next.map((item, idx) => (
              <li key={idx} style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                lineHeight: 1.5
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ textAlignment: 'center', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button className="btn-primary" onClick={onRestart} style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem' }}>
          <RefreshCw size={18} /> Start Another Technical Interview
        </button>
      </div>
    </div>
  );
}
