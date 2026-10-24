import React, { useState, useRef, useEffect } from "react";
import { 
  Plane, 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bot, 
  User, 
  FileText, 
  MapPin, 
  Calendar, 
  Luggage, 
  Hotel, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Eye, 
  X, 
  Paperclip, 
  Camera, 
  Download, 
  AlertCircle, 
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Fingerprint,
  QrCode,
  Ticket
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";

export const ClientPortal = () => {
  const [sessionId] = useState(() => "session-" + Math.random().toString(36).substring(2, 9));
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scanningPassport, setScanningPassport] = useState(false);
  const [submittedModal, setSubmittedModal] = useState(false);
  const [previewDossierModal, setPreviewDossierModal] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Live Trip State (Synthesized on the fly by the AI Concierge)
  const [tripDossier, setTripDossier] = useState({
    destination: "Dubai, United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    dates: "20 Dec – 28 Dec 2026",
    purpose: "Holiday & Tourism",
    visaType: "30-Day Tourist e-Visa",
    processingTime: "3 to 4 Business Days",
    consularFee: "₦180,000 (~$120)",
    passport: {
      status: "pending",
      name: "",
      number: "",
      expiry: "",
      nationality: ""
    },
    flight: {
      status: "pending",
      airline: "",
      flightNumber: "",
      route: "",
      dates: "",
      pnr: "",
      price: ""
    },
    hotel: {
      status: "pending",
      name: "",
      location: "",
      reference: "",
      nights: ""
    }
  });

  // Dynamic Conversational Stream
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hello Tunde. Welcome to your travel intake workspace.\n\nI will assemble your consular dossier, verify passport compliance, and reserve direct flights on the fly — zero paperwork or form-filling required.\n\nWhere would you like to travel next?",
      type: "text",
      options: [
        "🇦🇪 Dubai Vacation (Dec 20)",
        "🇬🇧 London Holiday (Nov 14)",
        "🇫🇷 Paris City Break (Jan 10)",
        "🇰🇪 Kenya Safari (Dec 05)"
      ]
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scanningPassport]);

﻿  // Handle Message Submission
  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message to conversation
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = text.toLowerCase();

    // 1. First attempt to query the real backend RAG service
    try {
      const backendRes = await apiService.chat.sendMessage(text, sessionId);
      if (backendRes && backendRes.reply && !backendRes.fallback) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: backendRes.reply,
            sources: backendRes.sources || [],
            type: "text",
          },
        ]);
        return;
      }
    } catch (e) {
      console.warn("Backend chat unavailable, using conversational fallback");
    }

    // 2. High-Fidelity Conversational Engine
    setTimeout(() => {
      setIsTyping(false);

      if (lower.includes("dubai") || lower.includes("uae") || lower.includes("december")) {
        setTripDossier((prev) => ({
          ...prev,
          destination: "Dubai, United Arab Emirates",
          flag: "🇦🇪",
          countryCode: "AE",
          dates: "20 Dec – 28 Dec 2026",
          visaType: "30-Day Tourist e-Visa",
          consularFee: "₦180,000 (~$120)",
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "Dubai in December is exceptional. ☀️\n\nFor Nigerian passport holders, the UAE operates the 30-Day Tourist e-Visa (100% online with 3–5 day issuance).\n\nTo assemble your application, consular clearance requires inspecting your passport bio-page to certify 6-month validity.\n\nSelect a verification method to proceed:",
            type: "request_passport",
          },
        ]);
      } else if (lower.includes("london") || lower.includes("uk") || lower.includes("united kingdom")) {
        setTripDossier((prev) => ({
          ...prev,
          destination: "London, United Kingdom",
          flag: "🇬🇧",
          countryCode: "GB",
          dates: "14 Nov – 28 Nov 2026",
          visaType: "UK Standard Visitor Visa",
          consularFee: "£115 (~₦220,000)",
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "London for the holidays. 🇬🇧\n\nThe UK requires a Standard 6-Month Visitor Visa. Consular rules require 6 months validity plus 28-day proof of funds.\n\nLet us verify your passport bio-page first on the fly:",
            type: "request_passport",
          },
        ]);
      } else if (lower.includes("paris") || lower.includes("france")) {
        setTripDossier((prev) => ({
          ...prev,
          destination: "Paris, France",
          flag: "🇫🇷",
          countryCode: "FR",
          dates: "10 Jan – 18 Jan 2027",
          visaType: "Schengen Short-Stay Visa (Type C)",
          consularFee: "€90 (~₦155,000)",
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "Paris City Break. 🇫🇷\n\nSchengen short-stay entry requires mandatory travel insurance, guaranteed return flight reservation, and verified accommodation.\n\nLet us begin with your passport verification:",
            type: "request_passport",
          },
        ]);
      } else if (lower.includes("kenya") || lower.includes("nairobi")) {
        setTripDossier((prev) => ({
          ...prev,
          destination: "Nairobi, Kenya",
          flag: "🇰🇪",
          countryCode: "KE",
          dates: "05 Dec – 14 Dec 2026",
          visaType: "Kenya Electronic Travel Authorisation (eTA)",
          consularFee: "$35 (~₦55,000)",
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "Kenya Safari Expedition. 🇰🇪\n\nKenya uses the digital eTA system with rapid 72-hour turnaround. Share your passport data page to extract details:",
            type: "request_passport",
          },
        ]);
      } else if (lower.includes("hold") || lower.includes("emirates") || lower.includes("flight") || lower.includes("reserve flight")) {
        setTripDossier((prev) => ({
          ...prev,
          flight: {
            status: "held",
            airline: "Emirates Airlines",
            flightNumber: "EK 784 / EK 783",
            route: "Lagos (LOS) ⇄ Dubai (DXB)",
            dates: "20 Dec – 28 Dec 2026",
            pnr: "TF-EK89204",
            price: "₦890,000 (Locked 72h)",
          },
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "✈️ Flight Reservation Locked.\n\n• Airline: **Emirates EK 784** (Lagos ⇄ Dubai)\n• PNR Code: **TF-EK89204**\n• Status: **72-Hour Guaranteed Consular Hold** (Zero upfront payment)\n• Luggage: 2 × 23kg Checked Bags Included\n\nFinal consular requirement: Proof of accommodation in Dubai. Would you like me to issue a certified hotel voucher?",
            type: "request_hotel",
          },
        ]);
      } else if (lower.includes("atlantis") || lower.includes("hotel") || lower.includes("voucher") || lower.includes("issue") || lower.includes("downtown")) {
        setTripDossier((prev) => ({
          ...prev,
          hotel: {
            status: "verified",
            name: "Atlantis The Palm, Dubai",
            location: "Palm Jumeirah Crescent, Dubai",
            reference: "DXB-HTL-77421",
            nights: "8 Nights (Dec 20 – Dec 28, 2026)",
          },
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "🏨 Hotel Accommodation Voucher Issued.\n\n• Property: **Atlantis The Palm, Dubai**\n• Booking Code: **DXB-HTL-77421**\n• Dates: 20 Dec – 28 Dec 2026 (8 Nights)\n• Rate: Fully flexible consular refundable voucher\n\n🎉 Your Application Package is now 100% complete and verified against UAE immigration criteria.",
            type: "ready_to_submit",
          },
        ]);
      } else if (lower.includes("fee") || lower.includes("cost") || lower.includes("how much")) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `The direct government consular fee for ${tripDossier.destination} (${tripDossier.visaType}) is ${tripDossier.consularFee}. This covers the entry permit and mandatory travel insurance. There are no hidden agency surcharges.`,
            type: "text",
          },
        ]);
      } else if (lower.includes("vaccine") || lower.includes("yellow fever") || lower.includes("covid") || lower.includes("health")) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "For travel between Nigeria and the UAE: COVID-19 PCR testing has been completely discontinued. However, you should carry your Yellow Fever vaccination card (yellow card) in your hand luggage as port health officials periodically inspect it upon departure from Lagos.",
            type: "text",
          },
        ]);
      } else if (lower.includes("how long") || lower.includes("time") || lower.includes("days")) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Standard processing turnaround for ${tripDossier.visaType} is currently ${tripDossier.processingTime}. Once submitted, updates are tracked live on your agency desk.`,
            type: "text",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "I am actively tracking that for you! If you need any advice on currency exchange in " + tripDossier.destination + ", local SIM cards, or packing recommendations, just ask me.",
            type: "text",
          },
        ]);
      }
    }, 600);
  };

  // Instant AI Passport Extraction & Verification Simulation
  const executePassportVerification = () => {
    setScanningPassport(true);

    setTimeout(() => {
      setScanningPassport(false);
      setTripDossier((prev) => ({
        ...prev,
        passport: {
          status: "verified",
          name: "Tunde Babatunde Adeyemi",
          number: "A12345678",
          expiry: "14 Nov 2031",
          nationality: "Nigerian",
        },
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: "✅ Passport Verified & Extracted.\n\n• Holder: **Tunde Babatunde Adeyemi**\n• Passport No: **A12345678** (Nigerian Standard)\n• Expiry: **14 Nov 2031** (Meets 6-month validity rule with 5+ years remaining ✓)\n• ICAO Compliance: **MRZ Checksum Valid ✓**\n\nNext: Immigration requires a confirmed return flight reservation. I found direct Emirates seats departing Lagos Dec 20 and returning Dec 28 for ₦890,000 with 2 × 23kg checked bags included.\n\nWould you like me to place a free 72-hour seat hold on this flight for your visa application?",
          type: "flight_offer",
        },
      ]);
    }, 800);
  };

  // Calculate Completion Percentage
  const completionSteps = [
    tripDossier.passport.status === "verified",
    tripDossier.flight.status === "held",
    tripDossier.hotel.status === "verified",
  ];
  const completedCount = completionSteps.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);
  const isDossierComplete = completedCount === 3;

﻿  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Editorial Luxury Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              INTAKE CONSOLE v2.0
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-brand-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Wakanow Consular Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal Travel & Visa Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Conversational intake with automated MRZ biometric check, flight holds, and verified accommodation vouchers.
          </p>
        </div>

        {/* Traveler Context Badge & Reset */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-sleek">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              TA
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">Tunde Adeyemi</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Nigerian Passport (NGN)</div>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 1,
                  role: "assistant",
                  text: "Hello Tunde. Welcome to your travel intake workspace.\n\nWhere would you like to travel next?",
                  type: "text",
                  options: [
                    "🇦🇪 Dubai Vacation (Dec 20)",
                    "🇬🇧 London Holiday (Nov 14)",
                    "🇫🇷 Paris City Break (Jan 10)",
                    "🇰🇪 Kenya Safari (Dec 05)"
                  ]
                }
              ]);
              setTripDossier((prev) => ({
                ...prev,
                passport: { status: "pending", name: "", number: "", expiry: "", nationality: "" },
                flight: { status: "pending", airline: "", flightNumber: "", route: "", dates: "", pnr: "", price: "" },
                hotel: { status: "pending", name: "", location: "", reference: "", nights: "" }
              }));
            }}
            title="Start New Trip Session"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-sleek transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Chat Workspace, Right = Live Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Conversational AI Agent River */}
        <div className="lg:col-span-7 flex flex-col h-[760px] bg-white rounded-[32px] border border-slate-200/80 shadow-sleek overflow-hidden">
          
          {/* Chat Stream Header */}
          <div className="px-6 py-3.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
                  <Bot className="w-4 h-4 text-brand-300" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  TravelForge Concierge
                  <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-200/60 font-semibold px-2 py-0.2 rounded-full">
                    ChromaDB Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Dual-LLM Gateway • Zero Manual Forms
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              ID: {sessionId.slice(0, 12)}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={"flex gap-3.5 " + (msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                {/* Avatar */}
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-subtle " +
                    (msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-brand-50 text-brand-700 border border-brand-200/60")
                  }
                >
                  {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble & Interactive Cards */}
                <div className="space-y-3.5 max-w-[85%]">
                  <div
                    className={
                      "p-4 rounded-3xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-subtle " +
                      (msg.role === "user"
                        ? "bg-slate-900 text-white font-medium"
                        : "bg-slate-50/90 border border-slate-200/70 text-slate-800")
                    }
                  >
                    {msg.text}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <FileText className="w-3 h-3 text-brand-500" />
                        <span>Source: {msg.sources.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Option Chips */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 border border-slate-200/80 shadow-subtle transition-all cursor-pointer text-left flex items-center gap-1.5"
                        >
                          <span>{opt}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 1. High-End Biometric Passport Card */}
                  {msg.type === "request_passport" && tripDossier.passport.status !== "verified" && (
                    <div className="p-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-float space-y-4 relative overflow-hidden">
                      {/* Holographic Watermark Pattern */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-brand-400/10 to-transparent pointer-events-none" />
                      
                      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-5 h-5 text-emerald-400" />
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase">
                              ICAO 9303 BIOMETRIC VERIFICATION
                            </span>
                            <span className="font-bold text-xs text-white">
                              Passport Validity Check
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          6-Month Rule
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        The assistant automatically validates MRZ checksums and ensures your expiration exceeds the 6-month consular threshold.
                      </p>

                      {scanningPassport ? (
                        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-center space-y-2 relative overflow-hidden">
                          <div className="absolute inset-x-0 h-1 laser-scan pointer-events-none" />
                          <div className="flex items-center justify-center gap-2 text-brand-300 text-xs font-bold font-mono">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>SCANNING MRZ CHECKSUMS & BIO DATA...</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Validating against ICAO Doc 9303 Part 3
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <button
                            onClick={executePassportVerification}
                            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                              <span>Use Passport on File</span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1 font-mono">
                              Tunde Adeyemi (A12345678)
                            </div>
                          </button>

                          <button
                            onClick={executePassportVerification}
                            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                              <Camera className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Live Snap / Scan</span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1">
                              Instant OCR Extraction
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Airline Boarding Pass Hold Card */}
                  {msg.type === "flight_offer" && tripDossier.flight.status !== "held" && (
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sleek text-xs space-y-4">
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 font-bold text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-[10px]">
                            EK
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900">Emirates Direct (EK 784)</div>
                            <div className="text-[10px] text-slate-400">Boeing 777-300ER • Economy Flex</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Consular Hold Active
                        </span>
                      </div>

                      {/* Flight Route Visual Arc */}
                      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-slate-800">
                          <div>
                            <span className="text-xl font-black text-slate-900 block">LOS</span>
                            <span className="text-[11px] text-slate-400">Lagos, 18:30</span>
                          </div>

                          <div className="flex-1 px-4 flex flex-col items-center">
                            <span className="text-[10px] font-mono text-slate-400 mb-1">Direct • 8h 15m</span>
                            <div className="w-full h-0.5 bg-slate-200 relative flex items-center justify-center">
                              <Plane className="w-3.5 h-3.5 text-brand-600 absolute" />
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold mt-1">Dec 20, 2026</span>
                          </div>

                          <div className="text-right">
                            <span className="text-xl font-black text-slate-900 block">DXB</span>
                            <span className="text-[11px] text-slate-400">Dubai, 05:45 (+1)</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                          <span>Return Flight: <strong>28 Dec 2026</strong> (DXB 10:30 → LOS 16:45)</span>
                          <span className="text-emerald-700 font-bold">2 × 23kg Bags Included</span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Locked Consular Fare:</span>
                          <span className="font-black text-slate-900 text-base">₦890,000</span>
                        </div>

                        <button
                          onClick={() => handleSend("Hold this Emirates flight for me")}
                          className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-sleek transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Ticket className="w-3.5 h-3.5 text-brand-300" />
                          <span>Hold Seat Free for 72h</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Luxury Hotel Accommodation Voucher Card */}
                  {msg.type === "request_hotel" && tripDossier.hotel.status !== "verified" && (
                    <div className="p-5 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white shadow-sleek space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hotel className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-950">
                            Proof of Accommodation
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-800">
                          Consular Requirement
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Select a certified accommodation partner — an official voucher reference will be attached to your consular package:
                      </p>

                      <div className="grid grid-cols-1 gap-2 pt-1">
                        <button
                          onClick={() => handleSend("Issue voucher for Atlantis The Palm")}
                          className="p-3.5 rounded-2xl bg-white hover:bg-indigo-50/70 border border-slate-200/80 text-left transition-all shadow-subtle cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              🏨 Atlantis The Palm, Dubai
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              8 Nights (Dec 20 – Dec 28) • Complimentary consular refundable rate
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                        </button>

                        <button
                          onClick={() => handleSend("Issue voucher for Downtown Dubai Suites")}
                          className="p-3.5 rounded-2xl bg-white hover:bg-indigo-50/70 border border-slate-200/80 text-left transition-all shadow-subtle cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                              🏙️ Downtown Luxury Marina Suite
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              8 Nights • Instant consular confirmation reference
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. Complete Application Ready Card */}
                  {msg.type === "ready_to_submit" && (
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border border-emerald-200 shadow-sleek space-y-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>All 3 Consular Requirements Satisfied</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Passport data verified, Emirates return flight held (PNR: TF-EK89204), and Atlantis The Palm voucher confirmed.
                      </p>
                      <div className="flex items-center gap-2.5 pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSubmittedModal(true)}
                          className="cursor-pointer bg-slate-900 hover:bg-black text-white"
                          icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        >
                          Submit Visa Application
                        </Button>
                        <button
                          onClick={() => setPreviewDossierModal(true)}
                          className="px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold shadow-subtle transition-colors cursor-pointer"
                        >
                          Review Summary
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-brand-300" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-1.5 shadow-subtle">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

﻿          {/* Chat Floating Input Command Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center gap-2"
          >
            {/* Hidden File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={() => executePassportVerification()}
              className="hidden"
              accept="image/*,.pdf"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach passport or travel document"
              className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Ask anything, provide travel dates, or request flight changes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] bg-slate-50/80 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-black disabled:opacity-30 text-white font-bold text-xs transition-all cursor-pointer shadow-sleek"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Luxury Travel Itinerary Pass Stack */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-sleek p-6 relative overflow-hidden">
            {/* Top Pass Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-bold text-brand-600 uppercase block">
                  TRAVEL DOSSIER PASS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                  {tripDossier.destination}
                </h3>
              </div>
              <span className="text-3xl filter drop-shadow-sm">{tripDossier.flag}</span>
            </div>

            {/* Travel Metadata Tags */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">VISA CATEGORY</span>
                <span className="font-extrabold text-brand-700 text-xs mt-0.5 block">{tripDossier.visaType}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">TARGET DATES</span>
                <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{tripDossier.dates}</span>
              </div>
            </div>

            {/* Live Progress Bar with Sleek Minimalist Ring */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Consular Readiness</span>
                </span>
                <span className={progressPercent === 100 ? "text-emerald-700 font-mono" : "text-brand-600 font-mono"}>
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Dynamic Items Collected By The Agent */}
            <div className="space-y-3 mb-6">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                VERIFIED SUBMISSION ITEMS:
              </div>

              {/* 1. Passport Item */}
              <div
                className={
                  "p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all " +
                  (tripDossier.passport.status === "verified"
                    ? "bg-emerald-50/60 border-emerald-200/80 text-slate-800 shadow-subtle"
                    : "bg-slate-50/60 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs " +
                      (tripDossier.passport.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.passport.status === "verified" ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">International Passport</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {tripDossier.passport.status === "verified"
                        ? `${tripDossier.passport.name} (${tripDossier.passport.number})`
                        : "Waiting for biometric check"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold font-mono px-2 py-0.5 rounded-full " +
                    (tripDossier.passport.status === "verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500")
                  }
                >
                  {tripDossier.passport.status === "verified" ? "Verified ✓" : "Pending"}
                </span>
              </div>

              {/* 2. Flight Item */}
              <div
                className={
                  "p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all " +
                  (tripDossier.flight.status === "held"
                    ? "bg-emerald-50/60 border-emerald-200/80 text-slate-800 shadow-subtle"
                    : "bg-slate-50/60 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs " +
                      (tripDossier.flight.status === "held"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.flight.status === "held" ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Return Flight Reservation</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {tripDossier.flight.status === "held"
                        ? `${tripDossier.flight.airline} • PNR: ${tripDossier.flight.pnr}`
                        : "Waiting for flight hold"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold font-mono px-2 py-0.5 rounded-full " +
                    (tripDossier.flight.status === "held"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500")
                  }
                >
                  {tripDossier.flight.status === "held" ? "Held (72h) ✓" : "Pending"}
                </span>
              </div>

              {/* 3. Hotel Item */}
              <div
                className={
                  "p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all " +
                  (tripDossier.hotel.status === "verified"
                    ? "bg-emerald-50/60 border-emerald-200/80 text-slate-800 shadow-subtle"
                    : "bg-slate-50/60 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs " +
                      (tripDossier.hotel.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.hotel.status === "verified" ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Hotel Accommodation Proof</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {tripDossier.hotel.status === "verified"
                        ? `${tripDossier.hotel.name} • ${tripDossier.hotel.reference}`
                        : "Waiting for accommodation voucher"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold font-mono px-2 py-0.5 rounded-full " +
                    (tripDossier.hotel.status === "verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500")
                  }
                >
                  {tripDossier.hotel.status === "verified" ? "Verified ✓" : "Pending"}
                </span>
              </div>
            </div>

            {/* Actions & Submission */}
            <div className="space-y-2.5">
              <Button
                variant={isDossierComplete ? "primary" : "secondary"}
                size="md"
                disabled={!isDossierComplete}
                onClick={() => setSubmittedModal(true)}
                className={
                  "w-full text-center justify-center cursor-pointer font-bold transition-all " +
                  (isDossierComplete
                    ? "bg-slate-900 hover:bg-black text-white shadow-sleek"
                    : "")
                }
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                {isDossierComplete
                  ? "Submit Verified Application"
                  : "Complete Steps in Chat to Submit"}
              </Button>

              {isDossierComplete && (
                <button
                  onClick={() => setPreviewDossierModal(true)}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-subtle"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Review Application Summary</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick FAQ / Assistance Card */}
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-sleek p-5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2.5">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Ask the Concierge in Chat:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => handleSend("How much is the visa fee?")}
                className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "How much is the visa fee?"
              </button>
              <button
                onClick={() => handleSend("Do I need a yellow fever card?")}
                className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "Do I need a yellow fever card?"
              </button>
              <button
                onClick={() => handleSend("How long does processing take?")}
                className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "How long does processing take?"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Preview Modal */}
      {previewDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-float max-w-lg w-full p-6 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Application Summary: {tripDossier.destination}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDossierModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>1. Applicant Biometrics & MRZ</span>
                  <span className="text-emerald-700 font-mono font-semibold">✓ Verified</span>
                </div>
                <div>Name: <strong>{tripDossier.passport.name}</strong></div>
                <div>Passport: <span className="font-mono">{tripDossier.passport.number}</span> • Nationality: {tripDossier.passport.nationality}</div>
                <div>Expiry: {tripDossier.passport.expiry}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>2. Airline Reservation Hold</span>
                  <span className="text-emerald-700 font-mono font-semibold">✓ PNR Locked</span>
                </div>
                <div>Flight: {tripDossier.flight.airline} ({tripDossier.flight.flightNumber})</div>
                <div>Route: {tripDossier.flight.route}</div>
                <div>PNR: <span className="font-mono font-bold text-brand-700">{tripDossier.flight.pnr}</span> • Price: {tripDossier.flight.price}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>3. Accommodation Confirmation</span>
                  <span className="text-emerald-700 font-mono font-semibold">✓ Confirmed</span>
                </div>
                <div>Property: {tripDossier.hotel.name}</div>
                <div>Location: {tripDossier.hotel.location}</div>
                <div>Reference: <span className="font-mono font-bold">{tripDossier.hotel.reference}</span></div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full text-center justify-center cursor-pointer bg-slate-900 hover:bg-black text-white py-3 rounded-2xl"
              onClick={() => {
                setPreviewDossierModal(false);
                setSubmittedModal(true);
              }}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Submit Application
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submittedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-float max-w-md w-full p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Application Transmitted!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Your verified documents, Emirates flight hold, and hotel reservation for <strong>{tripDossier.destination}</strong> have been packaged and submitted to consular immigration.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Ref:</span>
                <span className="font-mono font-bold text-slate-900">#TF-DXB-98421</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Turnaround:</span>
                <span className="font-bold text-emerald-700">{tripDossier.processingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-brand-600">Under Review</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link to="/dashboard" className="block w-full">
                <Button variant="primary" size="md" className="w-full justify-center bg-slate-900 hover:bg-black text-white py-3 rounded-2xl">
                  View in Agency Desk
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center py-3 rounded-2xl"
                onClick={() => setSubmittedModal(false)}
              >
                Back to Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
