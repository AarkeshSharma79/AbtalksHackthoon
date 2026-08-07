import React, { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, Zap } from 'lucide-react';

export function ResumeUploader({ onResumeParsed }) {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await res.json();
      if (data.success) {
        setParsedData(data.resumeData);
        onResumeParsed(data.resumeData);
      }
    } catch (err) {
      console.error("Failed to parse resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetResume = (presetType) => {
    let preset = "";
    if (presetType === 'senior') {
      preset = `Sarah Johnson - Senior AI Architect\n7+ years experience building enterprise RAG, Vector Search (ChromaDB, Pinecone), LangChain agents, Docker/Kubernetes deployment, and PyTorch fine-tuning.`;
    } else if (presetType === 'fullstack') {
      preset = `Alex Turner - Fullstack AI Developer\n4 years experience with React, FastAPI, Python, Ollama local LLMs, Server-Sent Events streaming, and SQLite database optimizations.`;
    }
    setResumeText(preset);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <FileText className="gradient-text" size={20} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Resume-Aware Interview Customizer</h3>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Paste candidate CV / Resume text below. The AI Interview Agent will parse technical skills and fuse CV achievements into tailored technical questions.
      </p>

      {/* Preset CV Chips */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Sample Presets:</span>
        <button className="preset-chip" onClick={() => handlePresetResume('senior')}>
          Senior AI Architect CV
        </button>
        <button className="preset-chip" onClick={() => handlePresetResume('fullstack')}>
          Fullstack AI Developer CV
        </button>
      </div>

      <textarea
        rows={3}
        placeholder="Paste candidate resume text or CV highlights..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          padding: '0.65rem',
          color: 'white',
          fontSize: '0.82rem',
          marginBottom: '0.65rem',
          resize: 'vertical'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn-primary"
          onClick={handleParse}
          disabled={loading || !resumeText.trim()}
          style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
        >
          <Sparkles size={14} />
          {loading ? "Parsing Resume..." : "Parse & Fuse Resume with Interview"}
        </button>

        {parsedData && (
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <CheckCircle size={14} />
            Fused {parsedData.skills.length} skills & {parsedData.yearsExp} yrs exp
          </div>
        )}
      </div>
    </div>
  );
}
