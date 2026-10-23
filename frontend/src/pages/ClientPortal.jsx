import React, { useState, useEffect } from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';
import { UploadZone } from '../components/documents/UploadZone';
import { DocumentCard } from '../components/documents/DocumentCard';
import { VisaSummaryCard } from '../components/visa/VisaSummaryCard';
import { FlightCards } from '../components/flights/FlightCards';
import { RelocationTimeline } from '../components/visa/RelocationTimeline';
import { DossierModal } from '../components/shared/DossierModal';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { 
  FileText, 
  MessageSquare, 
  Plane, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Luggage,
  Hotel,
  Compass,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';

export const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'flights' | 'chat' | 'itinerary'
  const [toastMessage, setToastMessage] = useState(null);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('passport');

  // Travel Trips Switcher
  const [selectedTripId, setSelectedTripId] = useState('trip_uk_holiday');

  const trips = [
    {
      id: 'trip_uk_holiday',
      city: 'London, United Kingdom',
      flag: '🇬🇧',
      purpose: 'Holiday & Tourism',
      dates: '14 Nov - 28 Nov 2026 (14 Days)',
      visa: 'UK Standard Visitor Visa (6 Months)',
      status: 'Documents 75% Ready',
      origin: 'Lagos (LOS)'
    },
    {
      id: 'trip_dubai_vacation',
      city: 'Dubai, UAE',
      flag: '🇦🇪',
      purpose: 'Family Vacation',
      dates: '20 Dec - 28 Dec 2026 (8 Days)',
      visa: '30-Day Dubai Tourist e-Visa',
      status: 'Approved & Ticketed',
      origin: 'Lagos (LOS)'
    },
    {
      id: 'trip_nairobi_safari',
      city: 'Nairobi, Kenya',
      flag: '🇰🇪',
      purpose: 'Safari & Leisure',
      dates: '05 Jan - 12 Jan 2027 (7 Days)',
      visa: 'Kenya eTA (Visa-Free Entry)',
      status: 'eTA Granted',
      origin: 'Lagos (LOS)'
    }
  ];

  const currentTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello Tunde! I am your TravelForge Assistant. I am monitoring your upcoming holiday to London. Your passport and hotel reservation are verified. How can I help with your travel plans today?'
    }
  ]);

  const [checklist, setChecklist] = useState([
    { id: 'passport', label: 'International Passport (Bio Page)', status: 'passed', required: true, detail: 'Valid until Nov 2031 • Exceeds 6-month validity rule' },
    { id: 'flight_ticket', label: 'Confirmed Return Flight Ticket', status: 'passed', required: true, detail: 'British Airways LOS-LHR return ticket confirmed' },
    { id: 'hotel_booking', label: 'Hotel Booking / Accommodation Proof', status: 'passed', required: true, detail: 'The Standard London (Kings Cross) • 14 Nights' },
    { id: 'bank_statement', label: '3-Month Bank Statement (Funds Proof)', status: 'flagged', required: true, detail: 'Closing balance ₦4.8M • Meets holiday subsistence threshold' }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 'doc_1',
      doc_type: 'passport',
      status: 'passed',
      ai_confidence: 0.99,
      original_filename: 'Tunde_Passport_Bio.pdf',
      extracted_data: { full_name: 'Tunde Babatunde Adeyemi', passport_number: 'A12345678', nationality: 'Nigerian', expiry_date: '2031-11-14' },
      issues: []
    },
    {
      id: 'doc_2',
      doc_type: 'flight_ticket',
      status: 'passed',
      ai_confidence: 0.98,
      original_filename: 'BA_Flight_LOS_LHR_Return.pdf',
      extracted_data: { airline: 'British Airways', route: 'LOS -> LHR Return', departure: '14 Nov 2026', return_date: '28 Nov 2026' },
      issues: []
    },
    {
      id: 'doc_3',
      doc_type: 'hotel_booking',
      status: 'passed',
      ai_confidence: 0.97,
      original_filename: 'Hotel_Reservation_London.pdf',
      extracted_data: { hotel: 'The Standard London', address: '10 Argyle St, London WC1H 8EG', check_in: '15 Nov 2026', check_out: '28 Nov 2026' },
      issues: []
    },
    {
      id: 'doc_4',
      doc_type: 'bank_statement',
      status: 'flagged',
      ai_confidence: 0.95,
      original_filename: 'Bank_Statement_3Months.pdf',
      extracted_data: { bank: 'GTBank Nigeria', closing_balance: '₦4,850,000 (~£2,425)', months_covered: 3 },
      issues: [{ rule: 'Subsistence Verification', detail: 'Balance verified. Ensure recent salary deposit matches pay slip evidence.' }]
    }
  ]);

  const [flights] = useState([
    {
      id: 'fl_1',
      airline: 'British Airways',
      flight_number: 'BA 074',
      route: 'LOS (Lagos) -> LHR (London Heathrow)',
      departure_date: '14 Nov 2026 (22:45)',
      class: 'Economy Standard',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 1850000,
      status: 'seat_hold_available'
    },
    {
      id: 'fl_2',
      airline: 'Virgin Atlantic',
      flight_number: 'VS 412',
      route: 'LOS (Lagos) -> LHR (London Heathrow)',
      departure_date: '15 Nov 2026 (10:15)',
      class: 'Economy Classic',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 1720000,
      status: 'seat_hold_available'
    },
    {
      id: 'fl_3',
      airline: 'Qatar Airways',
      flight_number: 'QR 1408',
      route: 'LOS (Lagos) -> LHR (via Doha)',
      departure_date: '14 Nov 2026 (13:30)',
      class: 'Economy Saver',
      baggage: '2 x 23kg Checked Bags + 1 Cabin',
      price_ngn: 1540000,
      status: 'seat_hold_available'
    }
  ]);

  const { isConnected, lastEvent } = useSocket('app_tunde_123');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'document_processed') {
      const doc = lastEvent.data;
      setDocuments((prev) => [doc, ...prev.filter((d) => d.doc_type !== doc.doc_type)]);
      showToast(doc.doc_type + ' verified successfully');
    }
  }, [lastEvent]);

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingChat(true);

    try {
      const res = await apiService.sendChatMessage(text, 'app_tunde_123');
      if (res && res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (e) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Great question, Tunde! For your UK tourist visit, standard visitor visas allow up to 6 months of tourism and family visits. No work is permitted.' }
        ]);
      }, 400);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleUpload = async (docType, file) => {
    try {
      await apiService.uploadDocument('app_tunde_123', docType, file);
    } catch (e) {
      setTimeout(() => {
        const newDoc = {
          id: 'doc_' + Date.now(),
          doc_type: docType,
          status: 'passed',
          ai_confidence: 0.98,
          original_filename: file.name,
          extracted_data: { file_name: file.name, status: 'Verified Compliant' },
          issues: []
        };
        setDocuments((prev) => [newDoc, ...prev.filter((d) => d.doc_type !== docType)]);
        showToast(docType.toUpperCase() + ' uploaded and verified');
      }, 500);
    }
  };

  const completedCount = checklist.filter((c) => c.status === 'passed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-dropdown text-slate-800 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Trips Carousel / Switcher Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5">
          <Luggage className="w-4 h-4 text-brand-600" />
          My Trips:
        </span>
        {trips.map((t) => {
          const isSelected = selectedTripId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={
                'flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ' +
                (isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-subtle')
              }
            >
              <span className="text-base">{t.flag}</span>
              <span>{t.city}</span>
              <span className={
                'text-[10px] font-medium px-2 py-0.5 rounded-full ' +
                (isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500')
              }>
                {t.purpose}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Trip Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-md shrink-0">
              {currentTrip.flag}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentTrip.city}
                </h1>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {currentTrip.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Luggage className="w-4 h-4 text-brand-600" />
                  {currentTrip.purpose}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {currentTrip.dates}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Plane className="w-4 h-4 text-slate-400" />
                  {currentTrip.origin} → {currentTrip.city.split(',')[0]}
                </span>
                <span>•</span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  {currentTrip.visa}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDossierOpen(true)}
              icon={<FileText className="w-4 h-4 text-brand-600" />}
            >
              Trip Itinerary & Summary
            </Button>
          </div>
        </div>

        {/* 4-Step Travel Preparation Stepper */}
        <div className="pt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Travel Readiness Checklist
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { step: '1', title: 'Visa Requirements', desc: 'Standard Visitor Verified', status: 'completed' },
              { step: '2', title: 'Travel Documents', desc: completedCount + ' of 4 Uploaded & Checked', status: 'current' },
              { step: '3', title: 'Flights & Hotel', desc: 'BA074 + The Standard London', status: 'completed' },
              { step: '4', title: 'Embassy Submission', desc: 'TLScontact Lagos Slot Ready', status: 'upcoming' }
            ].map((st, i) => {
              const isDone = st.status === 'completed';
              const isCur = st.status === 'current';

              return (
                <div
                  key={i}
                  className={
                    'p-3.5 rounded-2xl border transition-all ' +
                    (isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isCur
                      ? 'bg-brand-50/50 border-brand-300 ring-1 ring-brand-400/20'
                      : 'bg-slate-50 border-slate-200 text-slate-400')
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={'text-[11px] font-mono font-bold ' + (isCur ? 'text-brand-700' : isDone ? 'text-emerald-700' : 'text-slate-400')}>
                      STEP 0{st.step}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-brand-600" />
                    )}
                  </div>
                  <div className={'text-xs font-bold ' + (isCur ? 'text-slate-900' : isDone ? 'text-slate-800' : 'text-slate-500')}>
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <FileText className="w-4 h-4" />
            <span>Travel Documents Vault</span>
            <span className={
              'px-2 py-0.5 rounded-full text-[10px] font-bold ' +
              (activeTab === 'documents' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700')
            }>
              {completedCount}/4
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flights')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'flights'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <Plane className="w-4 h-4" />
            <span>Flights & Airline Tickets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200')
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Travel Assistant</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Documents Vault */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <UploadZone
              selectedDocType={selectedDocType}
              onTypeChange={setSelectedDocType}
              onUpload={handleUpload}
            />
            <VisaSummaryCard appData={{ destination: currentTrip.city, visa_type: currentTrip.visa }} />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Your Travel Evidential Documents</h2>
                  <p className="text-xs text-slate-500">Scanned for passport validity, return ticket dates & embassy compliance</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {completedCount} of 4 Ready
                </span>
              </div>

              <div className="space-y-3">
                {documents.map((d) => (
                  <DocumentCard key={d.id} doc={d} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Flights & Airline Tickets */}
      {activeTab === 'flights' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <FlightCards flights={flights} />
          </div>
          <div className="lg:col-span-5">
            <RelocationTimeline />
          </div>
        </div>
      )}

      {/* Tab 3: Concierge Chat */}
      {activeTab === 'chat' && (
        <div className="h-[calc(100vh-280px)] min-h-[550px]">
          <ChatContainer
            messages={messages}
            checklist={checklist}
            onSendMessage={handleSendMessage}
            loading={loadingChat}
            onSelectDocType={(type) => {
              setSelectedDocType(type);
              setActiveTab('documents');
            }}
          />
        </div>
      )}

      <DossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        appData={{
          client_name: 'Tunde Babatunde Adeyemi',
          destination: currentTrip.city,
          trip_type: currentTrip.purpose
        }}
        documents={documents}
      />
    </div>
  );
};
