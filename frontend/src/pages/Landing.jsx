import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, FileCheck2, Plane } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const Landing = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
      {/* Hero Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 999,
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <Sparkles size={14} />
          PAU Hackathon ? Re-imagining the AI-Native Digital Universe
        </div>
      </div>

      {/* Hero Title */}
      <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 28px' }}>
        <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          The AI-Native OS for <br />
          <span className="text-gradient">Visa & Relocation Logistics</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Transforming a manual, 3-week, high-stress visa application ordeal into an intelligent, transparent, 15-minute orchestrated workflow with GPT-4o Vision and deterministic compliance gatekeeping.
        </p>
      </div>

      {/* CTA Dual Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 60 }}>
        <Link to="/client" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ padding: '14px 28px', fontSize: '1rem' }} icon={<ArrowRight size={18} />}>
            Launch Client Portal (/client)
          </Button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" style={{ padding: '14px 28px', fontSize: '1rem' }} icon={<ShieldCheck size={18} />}>
            Agency Control Tower (/dashboard)
          </Button>
        </Link>
      </div>

      {/* 3 Core Value Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
        <div className="glass-panel" style={{ padding: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <Zap size={24} color="#fff" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Conversational Intake</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Multimodal natural language intake fine-tuned for Nigerian English phrasing. Extracts visa pathway, employer, and dates into structured checklists.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <FileCheck2 size={24} color="#fff" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Vision OCR & Rules Engine</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            GPT-4o Vision parses passports, CoS, and 28-day bank balances. A deterministic Python engine enforces official UKVI thresholds with zero hallucinations.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 28 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Human-in-the-Loop Control</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Licensed consultants review discrepancy audits, conduct side-by-side OCR diff inspections, and override sponsor guarantees with live WebSocket sync.
          </p>
        </div>
      </div>
    </div>
  );
};
