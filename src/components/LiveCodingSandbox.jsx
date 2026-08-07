import React, { useState } from 'react';
import { Code, Play, CheckCircle, AlertTriangle, Terminal, Send, Sparkles } from 'lucide-react';

const STARTER_SNIPPETS = {
  javascript: `// Technical Challenge: Implement Vector Cosine Similarity
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Test case
const v1 = [0.2, 0.8, 0.5];
const v2 = [0.1, 0.9, 0.4];
const score = cosineSimilarity(v1, v2);
console.log("Vector Similarity Score:", score.toFixed(4));
`,
  python: `# Technical Challenge: Grounded RAG System Prompt Builder
def build_rag_prompt(user_query, retrieved_chunks):
    context_text = "\\n\\n".join([f"[{i+1}] {chunk}" for i, chunk in enumerate(retrieved_chunks)])
    
    system_prompt = f"""You are an enterprise AI assistant. Answer the question strictly using the provided context blocks.
If the answer cannot be determined from context, state: 'Information not available in knowledge base.'

Context Blocks:
{context_text}

User Question: {user_query}
Answer:"""
    return system_prompt

# Test prompt generation
chunks = [
    "ABTalks AI Cohort Day 8 covers vector database indexing strategies.",
    "ChromaDB handles local vector search, whereas Pinecone scales in the cloud."
]
prompt = build_rag_prompt("How does ChromaDB compare to Pinecone?", chunks)
print("--- GENERATED GROUNDED PROMPT ---")
print(prompt)
`
};

export function LiveCodingSandbox({ currentDay = 7, onSubmitCodeSolution }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_SNIPPETS.javascript);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_SNIPPETS[lang] || '');
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const res = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      setExecutionResult({
        success: false,
        output: '',
        error: err.message || 'Failed to connect to code execution engine'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    const outputText = executionResult?.output || "Executed cleanly";
    const solutionMessage = `Here is my live coding solution in ${language.toUpperCase()}:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nExecution Output:\n\`\`\`\n${outputText}\n\`\`\``;
    onSubmitCodeSolution(solutionMessage);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header & Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} className="gradient-text-cyan" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Coding Sandbox (Day {currentDay})</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => handleLanguageChange('javascript')}
            style={{
              background: language === 'javascript' ? 'var(--accent-indigo)' : 'rgba(30, 41, 59, 0.6)',
              color: 'white',
              border: '1px solid var(--border-light)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            JavaScript (Node)
          </button>
          <button
            onClick={() => handleLanguageChange('python')}
            style={{
              background: language === 'python' ? 'var(--accent-indigo)' : 'rgba(30, 41, 59, 0.6)',
              color: 'white',
              border: '1px solid var(--border-light)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Python 3
          </button>
        </div>
      </div>

      {/* Code Textarea Editor */}
      <div style={{ position: 'relative' }}>
        <textarea
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%',
            background: '#090d16',
            border: '1px solid var(--border-glow)',
            borderRadius: '10px',
            padding: '1rem',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Run & Submit Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <button
          className="btn-secondary"
          onClick={handleRunCode}
          disabled={isRunning}
          style={{ fontSize: '0.82rem' }}
        >
          <Play size={14} color="var(--accent-emerald)" />
          {isRunning ? "Executing in Sandbox..." : "Run Code Sandbox"}
        </button>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          style={{ fontSize: '0.82rem' }}
        >
          <Send size={14} />
          Submit Code Solution to Interviewer
        </button>
      </div>

      {/* Live Execution Output Terminal */}
      {executionResult && (
        <div style={{
          background: '#05070f',
          border: executionResult.success ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '10px',
          padding: '0.85rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.3rem' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 700,
              color: executionResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'
            }}>
              <Terminal size={14} />
              {executionResult.success ? 'Sandbox Execution Passed' : 'Execution Error'}
            </span>
            {executionResult.executionTimeMs && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {executionResult.executionTimeMs}ms execution
              </span>
            )}
          </div>

          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: executionResult.success ? '#a7f3d0' : '#fecdd3' }}>
            {executionResult.output || executionResult.error}
          </pre>
        </div>
      )}
    </div>
  );
}
