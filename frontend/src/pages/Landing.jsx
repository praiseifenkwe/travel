import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, FileCheck2, Cpu, Check, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const Landing = () => {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '50px 20px 100px' }}>
      {/* Top Release Tag */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          borderRadius: 999,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
          <span>PAU Hackathon Showcase</span>
          <span style={{ color: 'var(--border-medium)' }}>?</span>
          <span style={{ color: '#60a5fa' }}>Skilled Worker Pathway</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 36px' }}>
        <h1 style={{ fontSize: '3.4rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.035em', marginBottom: 18 }}>
          Automated compliance & relocation infrastructure.
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680, margin: '0 auto' }}>
          TravelForge transforms fragmented immigration paperwork into an orchestrated 15-minute compliance workflow using GPT-4o Vision and deterministic consular rule enforcement.
        </p>
      </div>

      {/* Hero CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 54 }}>
        <Link to="/client" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ padding: '10px 20px', fontSize: '0.92rem' }} icon={<ArrowRight size={16} />}>
            Open Applicant Portal
          </Button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" style={{ padding: '10px 20px', fontSize: '0.92rem' }} icon={<ShieldCheck size={16} />}>
            Agency Review Console
          </Button>
        </Link>
      </div>

      {/* Clean Interactive Architecture Window (Linear-style Mockup) */}
      <div className="tf-card" style={{
        padding: '0',
        overflow: 'hidden',
        marginBottom: 70,
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Terminal Header */}
        <div style={{
          background: '#0d0e14',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#262938' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#262938' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#262938' }} />
            </div>
            <span className="mono" style={{ color: 'var(--text-muted)' }}>
              travelforge.engine/session/app_tunde_123
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.75rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            Active WebSocket Session
          </div>
        </div>

        {/* Mockup Body: Clean 2-Column Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0a0b10' }}>
          {/* Left: Applicant View */}
          <div style={{ padding: 24, borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>
              01 / APPLICANT INTAKE
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                "Relocating to London for Bloomberg LP as Senior Software Engineer. Checking maintenance & CoS."
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { name: 'Passport (Bio Page)', status: 'Verified (98%)' },
                { name: 'Certificate of Sponsorship', status: 'Active (Tier-A)' },
                { name: 'IOM TB Test Certificate', status: 'Cleared' },
                { name: '28-Day Bank Statement', status: 'Verified (?14.5M)' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-subtle)', borderRadius: 6, fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ color: '#10b981', fontWeight: 500 }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Consular View */}
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>
              02 / DETERMINISTIC COMPLIANCE AUDIT
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--warning-border)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', marginBottom: 2 }}>
                Rule FIN 2.1: Maintenance Guarantee Verification
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Applicant balance falls under personal ?1,270 threshold. Sponsor certified maintenance under CoS Section A2.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="btn btn-success btn-sm" style={{ fontSize: '0.75rem' }}>
                ? Approve CoS Guarantee
              </span>
              <span className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Inspect OCR Diff
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Architecture Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 60 }}>
        <div className="tf-card" style={{ padding: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Zap size={16} color="#60a5fa" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>Conversational Slot-Filling</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Natural language understanding extracts visa pathway, employer constraints, and timeline into a structured intake record without manual forms.
          </p>
        </div>

        <div className="tf-card" style={{ padding: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <FileCheck2 size={16} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>Deterministic Rules Engine</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Immigration thresholds (funds, validity, clinic accreditation) run on pure, auditable Python logic rather than hallucination-prone LLM calls.
          </p>
        </div>

        <div className="tf-card" style={{ padding: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <ShieldCheck size={16} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>Human-in-the-Loop Gateway</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Licensed agency staff review side-by-side OCR discrepancies, apply legal exemptions, and authorize formal UKVI electronic submission.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '24px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20
      }}>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>15 min</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average Processing Time</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', letterSpacing: '-0.03em' }}>0%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UKVI Section 320 Rejections</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>100%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deterministic Verification</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#60a5fa', letterSpacing: '-0.03em' }}>&lt; 50ms</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time Consular Sync</div>
        </div>
      </div>
    </div>
  );
};
