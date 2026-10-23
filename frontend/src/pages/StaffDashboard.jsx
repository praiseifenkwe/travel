import React, { useState } from "react";
import { 
  Users, 
  Plane, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileText, 
  Calendar, 
  Luggage, 
  AlertCircle,
  Eye,
  X,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "../components/shared/Button";

export const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "rules"
  const [selectedClientId, setSelectedClientId] = useState("c1");
  const [toastMessage, setToastMessage] = useState(null);
  const [agentNote, setAgentNote] = useState("");
  const [approvedModal, setApprovedModal] = useState(false);

  const clients = [
    {
      id: "c1",
      name: "Tunde Babatunde Adeyemi",
      email: "tunde.adeyemi@gmail.com",
      phone: "+234 803 123 4567",
      destination: "Dubai, United Arab Emirates",
      flag: "🇦🇪",
      tripType: "Vacation & Tourism (8 Days)",
      dates: "20 Dec – 28 Dec 2026",
      flight: "Emirates (Flight EK 784)",
      status: "Ready to Submit",
      docs: [
        { name: "Passport Bio Page", detail: "Valid until Nov 2031 (Verified)", status: "Approved" },
        { name: "Return Flight Ticket", detail: "Emirates EK 784 confirmed (Verified)", status: "Approved" },
        { name: "Hotel Booking", detail: "Atlantis The Palm confirmed (Verified)", status: "Approved" }
      ]
    },
    {
      id: "c2",
      name: "Amaka Obi",
      email: "amaka.obi@outlook.com",
      phone: "+234 812 987 6543",
      destination: "London, United Kingdom",
      flag: "🇬🇧",
      tripType: "Family Holiday (14 Days)",
      dates: "14 Nov – 28 Nov 2026",
      flight: "British Airways (Flight BA 074)",
      status: "Awaiting Document",
      docs: [
        { name: "Passport Bio Page", detail: "Valid until Feb 2029 (Verified)", status: "Approved" },
        { name: "Flight Seat Hold", detail: "BA 074 72-hour hold active (Verified)", status: "Approved" },
        { name: "Hotel Confirmation", detail: "Pending traveler confirmation", status: "Pending" }
      ]
    },
    {
      id: "c3",
      name: "Chidi Nwosu",
      email: "chidi.nwosu@kpmg.com",
      phone: "+234 809 555 1234",
      destination: "Paris, France",
      flag: "🇫🇷",
      tripType: "Business Conference (6 Days)",
      dates: "02 Dec – 08 Dec 2026",
      flight: "Air France (Flight AF 854)",
      status: "Visa Approved",
      docs: [
        { name: "Passport Bio Page", detail: "Valid until Oct 2028 (Verified)", status: "Approved" },
        { name: "Return Flight Ticket", detail: "Air France AF 854 issued (Verified)", status: "Approved" },
        { name: "Conference Invitation", detail: "Paris Tech Summit 2026 (Verified)", status: "Approved" }
      ]
    }
  ];

  const activeRules = [
    {
      id: "uk_maintenance",
      visa: "UK Standard Visitor",
      rule: "Proof of sufficient funds to cover all trip expenses without recourse to public funds (3-6 months personal bank statement).",
      source: "Wakanow UK Visa Policy Excerpt",
      status: "Active Rule"
    },
    {
      id: "uae_validity",
      visa: "UAE 30-Day Tourist e-Visa",
      rule: "Passport must possess a minimum of 6 months validity from intended date of entry into the UAE.",
      source: "Dubai GDRFA / Wakanow Dump",
      status: "Active Rule"
    },
    {
      id: "schengen_insurance",
      visa: "Schengen Short-Stay",
      rule: "Mandatory medical travel insurance with minimum coverage of €30,000 valid across all 27 member states.",
      source: "EU Consular Code / Wakanow Policy",
      status: "Active Rule"
    }
  ];

  const current = clients.find((c) => c.id === selectedClientId) || clients[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = () => {
    setApprovedModal(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!agentNote.trim()) return;
    showToast(`Note sent to ${current.name}`);
    setAgentNote("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-dropdown text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Staff Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agency Review Desk
          </h1>
          <p className="text-xs text-slate-500">
            Review traveler applications assembled by the AI assistant before consular submission.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("bookings")}
            className={
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all " +
              (activeTab === "bookings"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            Traveler Queue ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 " +
              (activeTab === "rules"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Knowledge Rules ({activeRules.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "bookings" ? (
        /* Tab 1: Traveler Queue */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Traveler Queue List */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-card p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Incoming Traveler Files
            </div>

            <div className="space-y-2">
              {clients.map((c) => {
                const isSelected = selectedClientId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className={
                      "p-4 rounded-2xl border transition-all cursor-pointer " +
                      (isSelected
                        ? "bg-brand-50/70 border-brand-300 ring-1 ring-brand-400/20"
                        : "bg-white hover:bg-slate-50 border-slate-200")
                    }
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {c.name}
                      </div>
                      <span className="text-sm">{c.flag}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      {c.destination}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">
                        {c.tripType.split("(")[0]}
                      </span>
                      <span
                        className={
                          "text-[10px] font-bold px-2 py-0.5 rounded-full " +
                          (c.status === "Ready to Submit"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "Visa Approved"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-amber-100 text-amber-800")
                        }
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Traveler Workspace */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
              {/* Traveler Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-900">
                      {current.name}
                    </h2>
                    <span className="text-xl">{current.flag}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>{current.email}</span>
                    <span>•</span>
                    <span>{current.phone}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApprove}
                  className="cursor-pointer"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Approve & Issue Itinerary
                </Button>
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Destination</span>
                  <span className="font-bold text-slate-900 text-sm">{current.destination}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Travel Dates</span>
                  <span className="font-bold text-slate-900 text-sm">{current.dates}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Trip Category</span>
                  <span className="font-bold text-brand-700 text-sm">{current.tripType}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Reserved Flight</span>
                  <span className="font-bold text-slate-900 text-sm">{current.flight}</span>
                </div>
              </div>

              {/* Verified Documents */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Verified Traveler Documents ({current.docs.length})
                </div>
                <div className="space-y-2">
                  {current.docs.map((d, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{d.detail}</div>
                      </div>
                      <span
                        className={
                          "font-bold px-2.5 py-0.5 rounded-full text-[11px] " +
                          (d.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")
                        }
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Consultant Message */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Send Direct Update to Traveler
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Message appears directly in the traveler's chat assistant.
                </p>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Your Dubai e-Visa documents are verified. We have submitted your application to UAE immigration."
                    value={agentNote}
                    onChange={(e) => setAgentNote(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: AI Knowledge Rules (RAG) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Active Consular Knowledge Rules (Wakanow RAG Store)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These rules are extracted by the AI from official embassy policies and verified by agency staff.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              3 Active Rules
            </span>
          </div>

          <div className="space-y-3">
            {activeRules.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    {r.visa}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {r.rule}
                </p>
                <div className="text-[11px] text-slate-400">
                  Source: <span className="text-slate-600 font-semibold">{r.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approvedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-md w-full p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Trip Verified & Approved!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Official travel itinerary and document package generated for <strong>{current.name}</strong> ({current.destination}).
            </p>

            <Button variant="primary" size="md" className="w-full justify-center" onClick={() => setApprovedModal(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
