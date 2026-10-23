import React from 'react';
import { X, CheckCircle2, Download, Printer, ShieldCheck, FileText, Building2 } from 'lucide-react';
import { Button } from './Button';

export const DossierModal = ({ isOpen, onClose, appData = {}, documents = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-dropdown max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-5">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Immigration Compliance Verification Record
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            UKVI Electronic Audit Dossier (Tier 2 / Skilled Worker)
          </h2>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Verification Key: SHA-256: 9e4f...b721 • Deterministic Clearance ID: UKVI-TF-2026-981
          </div>
        </div>

        {/* Applicant Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs mb-6">
          <div>
            <span className="text-slate-500 text-[11px] font-medium">Applicant Legal Name</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{appData.client_name || 'Tunde Babatunde Adeyemi'}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-medium">Sponsoring Body</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{appData.employer || 'Bloomberg LP (London)'}</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-medium">UKVI Visa Pathway</span>
            <div className="font-bold text-brand-700 text-sm mt-0.5">Skilled Worker (Appendix Finance Passed)</div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-medium">Filing Destination</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">TLScontact Victoria Island, Lagos</div>
          </div>
        </div>

        {/* Verified Evidential Checklist */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Satisfied Evidential Requirements
          </h4>
          <div className="space-y-2">
            {[
              {
                rule: 'UKVI Appendix Skilled Worker — SW 4.1',
                detail: 'Valid Certificate of Sponsorship issued by Tier-A Licensed Sponsor (Bloomberg LP)',
                status: 'Passed'
              },
              {
                rule: 'UKVI Appendix Finance — FIN 2.1',
                detail: 'Maintenance Requirement Guarantee certified by Sponsor under CoS Section A2',
                status: 'Passed'
              },
              {
                rule: 'UKVI Appendix Tuberculosis — TB 1.1',
                detail: 'IOM-accredited clinic medical screening certificate confirmed negative',
                status: 'Passed'
              },
              {
                rule: 'UKVI Immigration Act 1971 — Part 9',
                detail: 'Biometric optical passport diff reconciled (0 discrepancies, 0 criminal records)',
                status: 'Passed'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-emerald-950 font-mono">{item.rule}</div>
                  <div className="text-emerald-800 text-[11px] mt-0.5">{item.detail}</div>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Electronically Signed by <strong className="text-slate-700">TravelForge Engine</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} icon={<Printer className="w-3.5 h-3.5" />}>
              Print Record
            </Button>
            <Button variant="primary" size="sm" onClick={onClose} icon={<Download className="w-3.5 h-3.5" />}>
              Download Official PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
