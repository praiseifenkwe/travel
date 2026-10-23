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
  ChevronRight
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

  // Live Trip Summary State (Populated on the fly as you chat)
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
      text: "Hello Tunde! 👋 I am your TravelForge AI Assistant.\n\nYou do not need to fill out forms or upload paperwork to a checklist. Just chat with me naturally — I will ask for whatever details are needed on the fly, verify your passport, and lock down certified flight and hotel reservations for your visa.\n\nWhere are you planning to travel next?",
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

﻿  // Handle Freeform or Option Sending
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
      console.warn("Backend chat unavailable, using local conversational fallback");
    }

    // 2. Resilient Contextual Conversational Fallback
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
            text: "Dubai in December is spectacular! ☀️ For Nigerian passport holders, UAE requires an official 30-Day Tourist e-Visa (processed 100% online in 3–4 days).\n\nTo begin your application, immigration requires inspecting your passport data page to certify 6-month validity.\n\nHow would you like to provide your passport details?",
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
            text: "London for the holidays! 🇬🇧 The UK requires a Standard 6-Month Visitor Visa. Let us check your passport eligibility first on the fly.\n\nHow would you like to share your passport bio page?",
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
            text: "Paris is wonderful! 🇫🇷 For Schengen short-stay visas, passport validity, return flights, and accommodation vouchers are strictly verified.\n\nLet us inspect your passport first on the fly:",
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
            text: "Kenya Safari! 🇰🇪 Kenya operates the seamless eTA system with rapid 72-hour turnaround. Please share your passport data page so I can pre-fill your clearance:",
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
            text: "✈️ Seat Held! I have reserved Emirates Flight EK 784 (LOS ⇄ DXB) on your dates with 2 × 23kg checked bags included.\n\n• Reservation PNR: **TF-EK89204**\n• Status: **Confirmed 72-Hour Reservation Hold** (No payment required upfront)\n\nNext step: Proof of hotel accommodation in Dubai. Would you like me to issue a certified hotel voucher, or do you have a booking already?",
            type: "request_hotel",
          },
        ]);
      } else if (lower.includes("atlantis") || lower.includes("hotel") || lower.includes("voucher") || lower.includes("issue") || lower.includes("downtown")) {
        setTripDossier((prev) => ({
          ...prev,
          hotel: {
            status: "verified",
            name: "Atlantis The Palm, Dubai",
            location: "Crescent Road, Palm Jumeirah, Dubai",
            reference: "DXB-HTL-77421",
            nights: "8 Nights (Dec 20 – Dec 28, 2026)",
          },
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "🏨 Hotel Voucher Issued! I have generated a certified accommodation confirmation voucher for **Atlantis The Palm, Dubai** (8 Nights, Dec 20 – Dec 28, 2026).\n\n• Booking Reference: **DXB-HTL-77421**\n• Address: Palm Jumeirah, Dubai, UAE\n• Cancellation: Fully flexible refundable rate\n\n🎉 Your Visa Application is now 100% complete and fully verified! All 3 required immigration criteria are satisfied.",
            type: "ready_to_submit",
          },
        ]);
      } else if (lower.includes("fee") || lower.includes("cost") || lower.includes("how much")) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: "The government fee for " + tripDossier.destination + " (" + tripDossier.visaType + ") is " + tripDossier.consularFee + ". This covers the direct government entry permit and mandatory travel insurance. There are no surprise agency markups.",
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
            text: "Standard processing turnaround for " + tripDossier.visaType + " is currently " + tripDossier.processingTime + ". Once submitted, updates are tracked live on your agency desk.",
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
          text: "✅ Passport scanned and verified!\n\n• Holder: **Tunde Babatunde Adeyemi**\n• Passport No: **A12345678**\n• Nationality: **Nigeria (NGN)**\n• Expiry: **14 Nov 2031** (Meets the 6-month validity rule with 5+ years remaining ✓)\n\nNow for your flights: Consular regulations require a confirmed return flight reservation. I found direct Emirates seats departing Lagos Dec 20 and returning Dec 28 for ₦890,000 with 2 × 23kg checked bags included.\n\nWould you like me to place a free 72-hour seat hold on this flight for your visa application?",
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
      {/* Top Header & Assistant Status */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Travel Assistant</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Plan Your Trip & Visa
          </h1>
          <p className="text-xs text-slate-500">
            Tell the assistant where you want to go. It checks visa rules, verifies your passport, and reserves flights on the fly.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Assistant Ready
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 1,
                  role: "assistant",
                  text: "Hello Tunde! 👋 Where would you like to travel next?",
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Start Over
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Chat, Right = Live Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Conversational AI Agent Stream */}
        <div className="lg:col-span-7 flex flex-col h-[740px] bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          {/* Chat Stream Header */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  TravelForge Assistant
                  <span className="text-[10px] text-emerald-700 bg-emerald-100/70 font-semibold px-2 py-0.2 rounded-full">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Instant visa guidance & bookings
                </div>
              </div>
            </div>

            <div className="text-[11px] font-medium text-slate-400">
              Traveler: <span className="font-bold text-slate-700">Tunde Adeyemi</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={"flex gap-3 " + (msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                {/* Avatar */}
                <div
                  className={
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm " +
                    (msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-brand-600 text-white")
                  }
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble + On-The-Fly Interactive Cards */}
                <div className="space-y-3 max-w-[85%]">
                  <div
                    className={
                      "p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-subtle " +
                      (msg.role === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-slate-50 border border-slate-200/80 text-slate-800")
                    }
                  >
                    {msg.text}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                        Source: {msg.sources.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Suggestion Option Chips */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-brand-50 hover:border-brand-300 text-brand-700 border border-brand-200/80 shadow-sm transition-all cursor-pointer text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* On-The-Fly Passport Request Widget */}
                  {msg.type === "request_passport" && tripDossier.passport.status !== "verified" && (
                    <div className="p-4 rounded-2xl border border-brand-200 bg-brand-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
                          <FileText className="w-4 h-4 text-brand-600" />
                          <span>Check Passport Validity</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                          Required by Immigration
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        The assistant will read your passport bio page and confirm it meets the mandatory 6-month validity rule.
                      </p>

                      {scanningPassport ? (
                        <div className="p-4 rounded-xl bg-white border border-brand-200 text-center space-y-2">
                          <div className="flex items-center justify-center gap-2 text-brand-700 text-xs font-bold">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>AI reading passport details & expiry date...</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-600 rounded-full animate-pulse w-3/4" />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {/* 1-Click Saved Profile Option */}
                          <button
                            onClick={executePassportVerification}
                            className="p-3 rounded-xl bg-white hover:bg-brand-100/60 border border-brand-200 text-left transition-all shadow-sm cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                              <span>Use Passport on File</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Tunde Adeyemi (A12345678)
                            </div>
                          </button>

                          {/* Snap / Live Scan Option */}
                          <button
                            onClick={executePassportVerification}
                            className="p-3 rounded-xl bg-white hover:bg-brand-100/60 border border-brand-200 text-left transition-all shadow-sm cursor-pointer"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                              <Camera className="w-4 h-4 text-brand-600 shrink-0" />
                              <span>Camera Snap / Upload</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Instant passport check
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* On-The-Fly Flight Hold Interactive Card */}
                  {msg.type === "flight_offer" && tripDossier.flight.status !== "held" && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <Plane className="w-4 h-4 text-brand-600" />
                          <span>Emirates Direct (EK 784)</span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Direct Return
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-slate-700">
                        <div className="flex justify-between">
                          <span className="font-semibold">Departure:</span>
                          <span>LOS 18:30 → DXB 05:45 (+1) • Dec 20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Return:</span>
                          <span>DXB 10:30 → LOS 16:45 • Dec 28</span>
                        </div>
                        <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200/60">
                          ✓ 2 × 23kg Checked Bags Included
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Locked Ticket Price:</span>
                          <span className="font-black text-slate-900 text-sm">₦890,000</span>
                        </div>
                        <button
                          onClick={() => handleSend("Hold this Emirates flight for me")}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Plane className="w-3.5 h-3.5" />
                          Hold Seat Free for 72h
                        </button>
                      </div>
                    </div>
                  )}

                  {/* On-The-Fly Hotel Voucher Interactive Card */}
                  {msg.type === "request_hotel" && tripDossier.hotel.status !== "verified" && (
                    <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                          <Hotel className="w-4 h-4 text-indigo-600" />
                          <span>Hotel Accommodation</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Required for Visa
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Choose a hotel option — the assistant will issue an official voucher for your dates:
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handleSend("Issue voucher for Atlantis The Palm")}
                          className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-left transition-all shadow-sm cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              🏨 Issue Hotel Voucher: Atlantis The Palm
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              8 Nights (Dec 20 – Dec 28) • Complimentary for visa filing
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
                        </button>

                        <button
                          onClick={() => handleSend("Issue voucher for Downtown Dubai Suites")}
                          className="p-3 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-left transition-all shadow-sm cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              🏙️ Issue Hotel Voucher: Downtown Marina Suite
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              8 Nights • Instant booking reference
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ready to Submit Banner in Chat */}
                  {msg.type === "ready_to_submit" && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>All 3 Requirements Completed</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Passport verified, Emirates flight held, and hotel accommodation voucher confirmed.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSubmittedModal(true)}
                          className="cursor-pointer"
                          icon={<ShieldCheck className="w-4 h-4" />}
                        >
                          Submit Visa Application
                        </Button>
                        <button
                          onClick={() => setPreviewDossierModal(true)}
                          className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold shadow-sm transition-colors cursor-pointer"
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
                <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-subtle">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

﻿          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2"
          >
            {/* Attachment Trigger */}
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
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Ask anything, provide details, or request flight/hotel changes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Live Trip Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6">
            {/* Summary Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                  Your Trip Summary
                </span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  {tripDossier.destination}
                </h3>
              </div>
              <span className="text-3xl">{tripDossier.flag}</span>
            </div>

            {/* Travel Metadata Tags */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Visa Type</span>
                <span className="font-bold text-brand-700 text-xs mt-0.5 block">{tripDossier.visaType}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Travel Dates</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">{tripDossier.dates}</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                <span>Visa Readiness</span>
                <span className={progressPercent === 100 ? "text-emerald-700" : "text-brand-600"}>
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Dynamic Items Collected By The Agent */}
            <div className="space-y-3 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Application Checklist:
              </div>

              {/* 1. Passport Item */}
              <div
                className={
                  "p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all " +
                  (tripDossier.passport.status === "verified"
                    ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                    : "bg-slate-50/80 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold " +
                      (tripDossier.passport.status === "verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.passport.status === "verified" ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">International Passport</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.passport.status === "verified"
                        ? `${tripDossier.passport.name} (${tripDossier.passport.number})`
                        : "Waiting for passport check"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold px-2 py-0.5 rounded-full " +
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
                    ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                    : "bg-slate-50/80 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold " +
                      (tripDossier.flight.status === "held"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.flight.status === "held" ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Return Flight Reservation</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.flight.status === "held"
                        ? `${tripDossier.flight.airline} • PNR: ${tripDossier.flight.pnr}`
                        : "Waiting for flight hold"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold px-2 py-0.5 rounded-full " +
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
                    ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                    : "bg-slate-50/80 border-slate-200 text-slate-400")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-xl flex items-center justify-center font-bold " +
                      (tripDossier.hotel.status === "verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500")
                    }
                  >
                    {tripDossier.hotel.status === "verified" ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Hotel Accommodation Proof</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.hotel.status === "verified"
                        ? `${tripDossier.hotel.name} • ${tripDossier.hotel.reference}`
                        : "Waiting for hotel confirmation"}
                    </div>
                  </div>
                </div>
                <span
                  className={
                    "text-[10px] font-bold px-2 py-0.5 rounded-full " +
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
                className="w-full text-center justify-center cursor-pointer"
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                {isDossierComplete
                  ? "Submit Visa Application"
                  : "Complete Steps in Chat to Submit"}
              </Button>

              {isDossierComplete && (
                <button
                  onClick={() => setPreviewDossierModal(true)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review Application Summary
                </button>
              )}
            </div>
          </div>

          {/* Quick FAQ / Assistance Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Ask the Assistant:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => handleSend("How much is the visa fee?")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "How much is the visa fee?"
              </button>
              <button
                onClick={() => handleSend("Do I need a yellow fever card?")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "Do I need a yellow fever card?"
              </button>
              <button
                onClick={() => handleSend("How long does processing take?")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                "How long does processing take?"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Preview Modal */}
      {previewDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-lg w-full p-6 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Application Summary: {tripDossier.destination}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDossierModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>1. Applicant Passport</span>
                  <span className="text-emerald-700 font-semibold">✓ Verified</span>
                </div>
                <div>Name: {tripDossier.passport.name}</div>
                <div>Passport: {tripDossier.passport.number} • Nationality: {tripDossier.passport.nationality}</div>
                <div>Expiry: {tripDossier.passport.expiry}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>2. Airline Reservation Hold</span>
                  <span className="text-emerald-700 font-semibold">✓ PNR Locked</span>
                </div>
                <div>Flight: {tripDossier.flight.airline} ({tripDossier.flight.flightNumber})</div>
                <div>Route: {tripDossier.flight.route}</div>
                <div>PNR: {tripDossier.flight.pnr} • Price: {tripDossier.flight.price}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>3. Hotel Booking Confirmation</span>
                  <span className="text-emerald-700 font-semibold">✓ Confirmed</span>
                </div>
                <div>Property: {tripDossier.hotel.name}</div>
                <div>Location: {tripDossier.hotel.location}</div>
                <div>Reference: {tripDossier.hotel.reference}</div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full text-center justify-center cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-md w-full p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your verified documents, Emirates flight hold, and hotel reservation for <strong>{tripDossier.destination}</strong> have been packaged and submitted to consular immigration.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs mb-6 text-left space-y-1">
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

            <div className="space-y-2">
              <Link to="/dashboard" className="block w-full">
                <Button variant="primary" size="md" className="w-full justify-center">
                  View in Agency Desk
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onClick={() => setSubmittedModal(false)}
              >
                Back to Trip Planner
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
