import React, { useState } from 'react';
import { CheckCircle2, Clock, Eye, X, AlertCircle } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';

export const DocumentCard = ({ doc }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isFlagged = doc.status === 'flagged';

  const getDocSummary = () => {
    switch (doc.doc_type) {
      case 'passport':
        return 'Passport No: A12345678 • Valid until 14 Nov 2031 (5+ years validity)';
      case 'flight_ticket':
        return 'British Airways Return Ticket • Lagos (LOS) ⇄ London (LHR) • 14 - 28 Nov';
      case 'hotel_booking':
        return 'The Standard London (Kings Cross) • 14 Nights Confirmed';
      case 'bank_statement':
        return 'GTBank Nigeria • ₦4,850,000 closing balance (Meets living expense threshold)';
      default:
        return 'Document uploaded and verified by AI verification engine.';
    }
  };

  const getDocTitle = () => {
    switch (doc.doc_type) {
      case 'passport':
        return 'International Passport (Bio Page)';
      case 'flight_ticket':
        return 'Confirmed Return Flight Ticket';
      case 'hotel_booking':
        return 'Hotel Reservation Proof';
      case 'bank_statement':
        return 'Proof of Funds (Bank Statement)';
      default:
        return doc.doc_type ? doc.doc_type.replace(/_/g, ' ') : 'Travel Document';
    }
  };

  return (
    <>
      <div className={
        'rounded-2xl border p-4 transition-all bg-white ' +
        (isFlagged ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300')
      }>
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className={
              'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ' +
              (isFlagged ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')
            }>
              {isFlagged ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{getDocTitle()}</h4>
              <p className="text-[11px] text-slate-500">{doc.original_filename || 'Uploaded Document'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge status={doc.status} label={isFlagged ? 'Under Review' : 'Verified'} />
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
          {getDocSummary()}
        </div>
      </div>

      {/* Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-900 mb-1">{getDocTitle()}</h3>
            <p className="text-xs text-slate-500 mb-4">{doc.original_filename}</p>

            <div className="space-y-2 mb-6">
              {doc.extracted_data && Object.entries(doc.extracted_data).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                  <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-slate-900">{String(v)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
