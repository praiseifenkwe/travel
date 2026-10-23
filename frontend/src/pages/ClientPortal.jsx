import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  Luggage, 
  Hotel, 
  Clock, 
  Send, 
  AlertCircle,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/shared/Button';

export const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'flights' | 'assistant'
  const [selectedTrip, setSelectedTrip] = useState('dubai');
  const [submittedModal, setSubmittedModal] = useState(false);
  const [uploadToast, setUploadToast] = useState(null);

  // Travel Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Tunde! I am your TravelForge Assistant for your Dubai holiday. Your passport and hotel reservation are verified. Do you have any questions about currency, local SIM cards, or entry rules?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const trips = {
    dubai: {
      title: 'Dubai Vacation Trip',
      flag: '🇦🇪',
      destination: 'Dubai, United Arab Emirates',
      dates: '20 Dec – 28 Dec 2026 (8 Days)',
      route: 'Lagos (LOS) → Dubai (DXB)',
      visa: '30-Day Tourist e-Visa',
      fee: '$120 (~₦185,000)',
      status: 'Documents 100% Ready',
      airline: 'Emirates (Flight EK 784)',
      flightTime: '20 Dec 2026 • 18:30 Departure (Direct)',
      hotel: 'Atlantis, The Palm (Crescent Rd, Dubai)',
      docs: [
        { name: 'International Passport (Bio Page)', detail: 'Valid until Nov 2031 (Satisfies 6-month rule)', status: 'Verified' },
        { name: 'Return Flight Ticket (Emirates)', detail: 'Confirmed return seat LOS-DXB (2 x 23kg bags)', status: 'Verified' },
        { name: 'Hotel Booking Confirmation', detail: 'Atlantis The Palm • 8 nights confirmed', status: 'Verified' }
      ]
    },
    uk: {
      title: 'London Holiday & Tourism',
      flag: '🇬🇧',
      destination: 'London, United Kingdom',
      dates: '14 Nov – 28 Nov 2026 (14 Days)',
      route: 'Lagos (LOS) → London (LHR)',
      visa: 'UK Standard Visitor Visa (6 Months)',
      fee: '£115 (~₦230,000)',
      status: 'Ready for Visa Drop-off',
      airline: 'British Airways (Flight BA 074)',
      flightTime: '14 Nov 2026 • 22:45 Departure (Direct)',
      hotel: 'The Standard London (Kings Cross)',
      docs: [
        { name: 'International Passport (Bio Page)', detail: 'Valid until Nov 2031', status: 'Verified' },
        { name: 'Return Flight Reservation (BA)', detail: 'Confirmed seat hold BA074 (2 x 23kg bags)', status: 'Verified' },
        { name: 'Hotel Accommodation Proof', detail: 'The Standard London • 14 nights', status: 'Verified' },
        { name: '3-Month Bank Statement', detail: 'GTBank ₦4.8M balance verified', status: 'Verified' }
      ]
    }
  };

  const trip = trips[selectedTrip] || trips.dubai;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Regarding "' + userText + '": In Dubai, tourist e-Visas allow multiple or single entry for 30 days. You can obtain a free tourist SIM card at Dubai International Airport (DXB) passport control, and credit cards are widely accepted everywhere.'
        }
      ]);
    }, 500);
  };

  const handleUploadSim = () => {
    setUploadToast('Document uploaded and verified successfully!');
    setTimeout(() => setUploadToast(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {uploadToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-dropdown text-xs font-bold text-slate-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{uploadToast}</span>
        </div>
      )}

      {/* Trip Switcher Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
          Select Trip:
        </span>
        <button
          onClick={() => setSelectedTrip('dubai')}
          className={
            'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ' +
            (selectedTrip === 'dubai'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200')
          }
        >
          <span>🇦🇪</span>
          <span>Dubai Vacation</span>
        </button>

        <button
          onClick={() => setSelectedTrip('uk')}
          className={
            'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ' +
            (selectedTrip === 'uk'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200')
          }
        >
          <span>🇬🇧</span>
          <span>London Holiday</span>
        </button>
      </div>

      {/* Main Trip Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl shadow-sm shrink-0">
              {trip.flag}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {trip.title}
                </h1>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {trip.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {trip.destination}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {trip.dates}
                </span>
                <span>•</span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  {trip.visa}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setSubmittedModal(true)}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Submit Visa Application
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={
              'px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'documents'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700')
            }
          >
            1. Visa Documents Checklist ({trip.docs.length})
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={
              'px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'flights'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700')
            }
          >
            2. Flights & Hotel Stay
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={
              'px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' +
              (activeTab === 'assistant'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700')
            }
          >
            3. AI Travel Assistant
          </button>
        </div>
      </div>

      {/* Tab 1: Documents Checklist */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">Required Travel Documents</h2>
              <p className="text-xs text-slate-500 mb-5">
                Every document is automatically verified to match embassy requirements.
              </p>

              <div className="space-y-3">
                {trip.docs.map((d, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{d.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{d.detail}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">Add or Replace Document</h3>
              <p className="text-xs text-slate-500 mb-4">Upload a clear photo or PDF of your passport or ticket</p>

              <div
                onClick={handleUploadSim}
                className="border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50/70 rounded-2xl p-8 text-center cursor-pointer transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-brand-600 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Click to select file or drag here
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, PDF up to 15MB
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-brand-50/60 border border-brand-200 text-xs text-brand-900 space-y-1">
                <div className="font-bold">Visa Processing Notice:</div>
                <div className="text-brand-800">
                  {trip.destination} e-Visas are typically approved in 3 business days. No embassy visit required.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Flights & Hotel Stay */}
      {activeTab === 'flights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flight Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Plane className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-base text-slate-900">Flight Reservation</h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Confirmed Seat Hold
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <div className="text-sm font-extrabold text-slate-900">{trip.airline}</div>
              <div className="text-xs text-slate-500 mt-0.5">{trip.route}</div>
              <div className="text-xs font-semibold text-brand-700 mt-2">{trip.flightTime}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-5">
              <div className="flex justify-between">
                <span>Baggage Allowance:</span>
                <span className="font-bold text-slate-900">2 × 23kg Checked Bags + 1 Cabin</span>
              </div>
              <div className="flex justify-between">
                <span>Seat Selection:</span>
                <span className="font-bold text-slate-900">14A (Window)</span>
              </div>
              <div className="flex justify-between">
                <span>Ticket Status:</span>
                <span className="font-bold text-emerald-700">72-Hour Fare Lock Active</span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              Change Flight Dates
            </Button>
          </div>

          {/* Hotel Stay Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Hotel className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Hotel Accommodation</h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Reservation Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <div className="text-sm font-extrabold text-slate-900">{trip.hotel}</div>
              <div className="text-xs text-slate-500 mt-0.5">Luxury Ocean View Room</div>
              <div className="text-xs font-semibold text-indigo-700 mt-2">Check-in: 20 Dec 2026 • Check-out: 28 Dec 2026</div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-5">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-bold text-slate-900">8 Nights</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Policy:</span>
                <span className="font-bold text-emerald-700">Free cancellation up to 48 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Embassy Proof:</span>
                <span className="font-bold text-slate-900">Valid Voucher Attached</span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              View Hotel Voucher
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Travel Assistant Chat */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">TravelForge Assistant</div>
                <div className="text-[11px] text-slate-500">Ask anything about your destination, packing, or currency</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={
                    'max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed ' +
                    (msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-800')
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <input
              type="text"
              placeholder="e.g. Do I need cash in Dubai, or can I use my card everywhere?"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Success Modal */}
      {submittedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-md w-full p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Your documents for <strong>{trip.title}</strong> have been packaged and transmitted. Expected processing turnaround: <strong>3 to 5 business days</strong>.
            </p>

            <Button variant="primary" size="md" className="w-full" onClick={() => setSubmittedModal(false)}>
              Back to My Trip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
