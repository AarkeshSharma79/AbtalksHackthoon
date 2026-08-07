import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

export function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Browser Speech Recognition not supported in this environment. Falling back to simulated Voice-to-Text.");
      const mockVoiceText = "In Day 7, we built vector embeddings using Sentence Transformers with 384 dimensions and evaluated cosine similarity vs euclidean distance.";
      setTranscript(mockVoiceText);
      onTranscript(mockVoiceText);
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      if (transcript) onTranscript(transcript);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <button
        onClick={toggleRecording}
        style={{
          background: isRecording ? 'linear-gradient(135deg, var(--accent-rose), #e11d48)' : 'rgba(99, 102, 241, 0.15)',
          border: isRecording ? '1px solid var(--accent-rose)' : '1px solid var(--border-glow)',
          color: isRecording ? 'white' : 'var(--accent-cyan)',
          padding: '0.5rem 0.9rem',
          borderRadius: '10px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'all 0.2s ease',
          boxShadow: isRecording ? '0 0 15px rgba(244, 63, 94, 0.5)' : 'none'
        }}
      >
        {isRecording ? <MicOff size={16} className="spin" /> : <Mic size={16} />}
        <span>{isRecording ? "Listening (Click to Stop)..." : "Voice Input (Whisper STT)"}</span>
      </button>

      {isRecording && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <div className="wave-bar" />
          <div className="wave-bar" />
          <div className="wave-bar" />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginLeft: '0.3rem', fontWeight: 600 }}>
            Recording Mic Audio
          </span>
        </div>
      )}
    </div>
  );
}
