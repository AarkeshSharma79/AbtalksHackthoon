import React from 'react';
import { User, Award, CheckCircle, AlertCircle, Play, Layers } from 'lucide-react';
import { getCandidateStats } from '../data/candidatesData';

export function CandidateCard({ candidate, isSelected, onSelect }) {
  const { member, missions, signals } = candidate;
  const stats = getCandidateStats(candidate);

  const skippedList = missions.filter(m => m.skipped);

  return (
    <div 
      className={`glass-panel ${isSelected ? 'glass-panel-glow' : ''}`}
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid var(--border-light)'
      }}
      onClick={onSelect}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: 800,
          padding: '0.2rem 0.6rem',
          borderBottomLeftRadius: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Active Candidate
        </div>
      )}

      <div>
        {/* Member Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}>
            {member.name.charAt(0)}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              {member.name}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
              {member.jobRole} · {member.yearsExperience} yrs exp
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {member.education}
            </div>
          </div>
        </div>

        {/* Cohort Performance Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.6rem',
          borderRadius: '10px',
          marginBottom: '0.85rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Missions</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {stats.completed}/31
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Commit Days</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {signals?.commitDays || 0}d
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>1st Try Pass</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-violet)' }}>
              {stats.firstTryRate}%
            </div>
          </div>
        </div>

        {/* Skipped Topics warning if any */}
        {skippedList.length > 0 && (
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--accent-amber)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <AlertCircle size={13} />
            <span>Skipped: {skippedList.map(s => s.title).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Select Action Button */}
      <button 
        className={isSelected ? "btn-primary" : "btn-secondary"}
        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <Play size={14} />
        {isSelected ? "Resume Interview" : "Start Technical Interview"}
      </button>
    </div>
  );
}
