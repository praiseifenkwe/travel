import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, FileCheck2, Plane, Clock, CheckCircle2, Lock, Cpu } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const Landing = () => {
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Hackathon Header Tag */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 18px',
          borderRadius: 999,
          background: 'rgba(99, 102, 241, 0.14)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: '#818cf8',
          fontSize: '0.84rem',
          fontWeight: 600,
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.2)'
        }}>
          <Sparkles size={15} />
          PAU Hackathon ? Re-imagining the AI-Native Digital Universe
        </div>
      </div>

      {/* Hero Headline */}
      <div style={{ textAlign: 'center', maxWidth: 940, margin: '0 auto 32px' }}>
        <h1 style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.12, marginBottom: 20 }}>
          The AI-Native Operating System for <br />
          <span className="text-gradient">Visa & Relocation Logistics</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 800, margin: '0 auto' }}>
          Transforming a manual 3-week, high-stress visa application ordeal into an intelligent, transparent, 15-minute orchestrated workflow powered by GPT-4o Vision and deterministic compliance gatekeeping.
        </p>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 50, flexWrap: 'wrap' }}>
        <Link to="/client" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ padding: '14px 30px', fontSize: '1.05rem' }} icon={<ArrowRight size={18} />}>
            Launch Client Portal (/client)
          </Button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" style={{ padding: '14px 30px', fontSize: '1.05rem' }} icon={<ShieldCheck size={18} />}>
            Agency Control Tower (/dashboard)
          </Button>
        </Link>
      </div>

      {/* Interactive Mockup Container */}
      <div className="glass-panel-glow" style={{
        borderRadius: 24,
        padding: '24px 28px',
        marginBottom: 70,
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(16, 23, 42, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        {/* Top Window Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            travelforge.internal/relocation-orchestrator ? Live WebSocket Session
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#34d399' }}>
            <span className="pulse-dot" />
            Sub-50ms Sync
          </div>
        </div>

        {/* Dual Screen Mockup Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
          {/* Left Preview: Client Portal */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 14,
            padding: 18,
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>Client Conversational Intake</span>
              <span className="badge badge-passed" style={{ fontSize: '0.7rem' }}>Natural Nigerian English</span>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              borderRadius: 10,
              padding: 12,
              fontSize: '0.82rem',
              color: '#e2e8f0',
              lineHeight: 1.5,
              marginBottom: 10
            }}>
              "I am relocating to London next month to join Bloomberg as a Senior Software Engineer. I have my CoS and passport ready."
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 10,
              padding: 12,
              fontSize: '0.8rem',
              color: '#c7d2fe'
            }}>
              ? AI Identified: <strong>UK Skilled Worker (Main)</strong> ? 4 mandatory checklist artifacts generated.
            </div>
          </div>

          {/* Right Preview: Staff HITL Audit */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 14,
            padding: 18,
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>Consultant Audit & Gatekeeping</span>
              <span className="badge badge-flagged" style={{ fontSize: '0.7rem' }}>HITL Action Required</span>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 10,
              padding: 12,
              fontSize: '0.8rem',
              color: '#fef08a',
              marginBottom: 10
            }}>
              ?? Passport validity 4.5 months (&lt; 6 months threshold). Maintenance certified by Bloomberg under Section A2.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="btn btn-success btn-sm" style={{ fontSize: '0.74rem', padding: '6px 12px' }}>
                ? One-Click Employer Clearance
              </span>
              <span className="btn btn-secondary btn-sm" style={{ fontSize: '0.74rem', padding: '6px 12px' }}>
                Inspect OCR Diff
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 60 }}>
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

      {/* Hackathon Stats Bar */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>15 min</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average Processing Time (vs 3 weeks)</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>0%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UKVI Section 320 Refusals</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8' }}>100%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deterministic Rule Verification</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>HITL</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Consultant Approval Gatekeeper</div>
        </div>
      </div>
    </div>
  );
};
