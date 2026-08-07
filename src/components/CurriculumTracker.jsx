import React from 'react';
import { CheckCircle2, Circle, AlertTriangle, Layers, BookOpen, UserCheck } from 'lucide-react';
import { daysList } from '../data/curriculumData';

export function CurriculumTracker({ candidate, questionsAskedCount = 0, coveredDays = [], currentDay = 7 }) {
  const member = candidate?.member || {};
  const missions = candidate?.missions || [];
  
  const coveredSet = new Set(coveredDays);
  
  // Requirement checkers
  const minQuestionsMet = questionsAskedCount >= 8;
  const minDaysMet = coveredSet.size >= 4;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Candidate Profile Widget */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '0.85rem',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'var(--accent-indigo)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: 'white'
        }}>
          {member.name ? member.name.charAt(0) : 'C'}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{member.name || 'Candidate'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{member.jobRole || 'AI Engineer'}</div>
        </div>
      </div>

      {/* Minimum Requirements Live Status */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid var(--border-light)'
      }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Tech Spec Requirements
        </h4>

        {/* Metric 1: Min 8 Questions */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
            <span>Total Questions Asked</span>
            <span style={{ fontWeight: 700, color: minQuestionsMet ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {questionsAskedCount} / 8 (min)
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (questionsAskedCount / 8) * 100)}%`,
              background: minQuestionsMet ? 'var(--accent-emerald)' : 'linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Metric 2: Min 4 Curriculum Days */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
            <span>Curriculum Days Covered</span>
            <span style={{ fontWeight: 700, color: minDaysMet ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {coveredSet.size} / 4 (min)
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (coveredSet.size / 4) * 100)}%`,
              background: minDaysMet ? 'var(--accent-emerald)' : 'linear-gradient(90deg, var(--accent-violet), var(--accent-cyan))',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Cohort Missions Checklist */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.3rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <BookOpen size={15} /> Candidate Mission Map
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {missions.map(m => {
            const isCurrent = m.day === currentDay;
            const isCovered = coveredSet.has(m.day);
            const isSkipped = m.skipped;

            let badgeBg = 'rgba(255, 255, 255, 0.05)';
            let badgeBorder = 'var(--border-light)';
            let textColor = 'var(--text-muted)';
            let icon = <Circle size={14} color="var(--text-dim)" />;

            if (isCurrent) {
              badgeBg = 'rgba(6, 182, 212, 0.15)';
              badgeBorder = 'var(--accent-cyan)';
              textColor = 'var(--accent-cyan)';
              icon = <Layers size={14} color="var(--accent-cyan)" />;
            } else if (isCovered) {
              badgeBg = 'rgba(16, 185, 129, 0.15)';
              badgeBorder = 'rgba(16, 185, 129, 0.4)';
              textColor = 'var(--accent-emerald)';
              icon = <CheckCircle2 size={14} color="var(--accent-emerald)" />;
            } else if (isSkipped) {
              badgeBg = 'rgba(245, 158, 11, 0.1)';
              badgeBorder = 'rgba(245, 158, 11, 0.3)';
              textColor = 'var(--accent-amber)';
              icon = <AlertTriangle size={14} color="var(--accent-amber)" />;
            }

            return (
              <div key={m.day} style={{
                background: badgeBg,
                border: `1px solid ${badgeBorder}`,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: textColor, fontWeight: isCurrent ? 700 : 500 }}>
                  {icon}
                  <span>Day {m.day}: {m.title}</span>
                </div>

                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  {isSkipped ? 'Skipped' : `${m.attempts || 1} att`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
