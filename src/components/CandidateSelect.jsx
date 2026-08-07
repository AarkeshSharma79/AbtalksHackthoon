import React, { useState } from 'react';
import { CandidateCard } from './CandidateCard';
import { candidatesList } from '../data/candidatesData';
import { Search, Filter, Sparkles } from 'lucide-react';

export function CandidateSelect({ selectedCandidate, onSelectCandidate, onStartInterview }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const roles = ['ALL', ...new Set(candidatesList.map(c => c.member.jobRole))];

  const filteredCandidates = candidatesList.filter(c => {
    const matchesSearch = c.member.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.member.jobRole.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || c.member.jobRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,27,75,0.7))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles className="gradient-text" size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Cohort Candidate Directory</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '800px' }}>
          Select any of the 20 enterprise AI cohort candidates below. The Interview Agent will automatically read their completed missions, skipped topics, attempt history, and job role to construct a realistic, adaptive multi-turn interview.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 300px',
          maxWidth: '400px'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search candidate by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Filter size={14} /> Filter Role:
          </span>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? 'var(--accent-indigo)' : 'rgba(30, 41, 59, 0.6)',
                color: roleFilter === r ? 'white' : 'var(--text-muted)',
                border: '1px solid var(--border-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Candidate Cards */}
      <div className="responsive-grid">
        {filteredCandidates.map(candidate => (
          <CandidateCard
            key={candidate.member.id}
            candidate={candidate}
            isSelected={selectedCandidate?.member?.id === candidate.member.id}
            onSelect={() => {
              onSelectCandidate(candidate);
              onStartInterview(candidate);
            }}
          />
        ))}
      </div>
    </div>
  );
}
