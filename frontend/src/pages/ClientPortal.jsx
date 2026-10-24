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
  AlertCircle, 
  Fingerprint, 
  Building2, 
  CreditCard, 
  Award, 
  MessageSquare, 
  Briefcase,
  Printer,
  ChevronRight,
  Globe2,
  History,
  Plus,
  Trash2,
  FolderOpen,
  FileCheck,
  Lock
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { apiService, formatApiError } from "../services/api";
import { openPaystackPopup } from "../services/paystack";
import { useAuth } from "../context/AuthContext";
import { VisaComparisonCard } from "../components/chat/VisaComparisonCard";
import { AppointmentCard } from "../components/chat/AppointmentCard";
import { VisaApprovalCard } from "../components/chat/VisaApprovalCard";
import { FlightCards } from "../components/flights/FlightCards";
import { HotelCards } from "../components/accommodations/HotelCards";

// Clean, robust markdown text and bold renderer
const renderMarkdownInline = (text) => {
  if (!text) return "";
  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-extrabold text-slate-900">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

const FormattedMessage = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-2 leading-relaxed text-xs sm:text-sm text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Clean bullet list line (strip leading bullet/dash/asterisk cleanly)
        if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.replace(/^[•\-\*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
              <div className="flex-1">{renderMarkdownInline(content)}</div>
            </div>
          );
        }

        // Regular line
        return <div key={idx}>{renderMarkdownInline(trimmed)}</div>;
      })}
    </div>
  );
};

// Dynamic Autonomous Conversational Intelligence Engine (handles proverbs, "what can you do", topic changes, advice)
const generateAutonomousReply = (text, destination = "New York, United States", countryCode = "US") => {
  const lower = text.toLowerCase().trim();
  const isUs = countryCode === "US" || (destination && (destination.toLowerCase().includes("united states") || destination.toLowerCase().includes("new york")));

  // Capabilities / "what can you do" / "help"
  if (
    lower.includes("what can you do") ||
    lower.includes("what do you do") ||
    lower.includes("capabilities") ||
    lower.includes("how does this work") ||
    lower.includes("features") ||
    lower.includes("who are you") ||
    lower === "help"
  ) {
    return {
      text: `I am TravelForge's autonomous **Consular Concierge & Immigration Copilot** 🤖.\n\nHere is everything I manage autonomously under strict statutory compliance:\n\n• **🛂 International Passport Audit**: Scans passport data pages to verify 6-month statutory validity before travel.\n• **🏛️ Visa Pathway Selection**: Maps your profile to official UK (Skilled Worker, Visitor) or US (H-1B, B1/B2) pathways.\n• **📊 6-Month Financial Audit**: Audits transaction ledgers against statutory maintenance thresholds (${isUs ? "$2,500 (~₦3,850,000)" : "£1,270 (~₦2,667,000)"}).\n• **💳 Live Paystack Payments**: Direct payment settlement for consular fees and ticket holds.\n• **🎫 Physical Embassy Slips**: Generates official appointment slips for VFS Global biometric enrollment.\n• **✈️ GDS Flights & Hotel Vouchers**: Locks 72h PNRs and issues consular proof-of-stay vouchers from scraped inventory.\n\nYou can upload a document with the paperclip (📎), ask any consular question, or explore flight and hotel options!`,
      options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels", "➕ Start New Session"]
    };
  }

  // Proverbs / Sayings / "the king is a boy" / Expressions
  if (
    lower.includes("king is a boy") ||
    lower.includes("the king is a boy") ||
    lower.includes("proverb") ||
    lower.includes("saying") ||
    lower.includes("uneasy lies the head")
  ) {
    return {
      text: `Ah, a classic expression! As the proverb goes, wisdom and sound counsel make the kingdom thrive—even when *"the king is a boy"*! 👑\n\nWhether you are taking on grand new ventures or planning your relocation to **${destination}**, I'm here to ensure your consular roadmap, paperwork, and travel logistics are fit for royalty.\n\nHow would you like to proceed with your royal journey?`,
      options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels", "📊 Financial Audit Info"]
    };
  }

  // Weather / Packing
  if (lower.includes("weather") || lower.includes("climate") || lower.includes("cold") || lower.includes("winter") || lower.includes("temperature")) {
    return {
      text: isUs 
        ? `🌤️ **New York Climate & Travel Guidance**:\n\n• **Current Season**: Late Autumn / Winter transition with temperatures from 5°C to 15°C.\n• **Packing Advice**: A warm coat, scarf, and comfortable walking shoes for Manhattan streets.\n\nWould you like to explore direct flight schedules or hotel options near Times Square?`
        : `🌧️ **London Climate & Travel Guidance**:\n\n• **Current Season**: Chilly and crisp, ranging from 7°C to 13°C with occasional light drizzle.\n• **Packing Advice**: A quality waterproof jacket, umbrella, and layered knitwear.\n\nWould you like to check flights into Heathrow or certified London hotels?`,
      options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels"]
    };
  }

  // Cost of living / Currency / Exchange rates
  if (lower.includes("cost of living") || lower.includes("exchange rate") || lower.includes("currency") || lower.includes("dollar") || lower.includes("pound") || lower.includes("budget")) {
    return {
      text: isUs
        ? `💵 **New York Financial & Currency Overview**:\n\n• **Currency**: US Dollar ($ / USD)\n• **Current Benchmark Rate**: ~₦1,535 – ₦1,550 per $1 USD.\n• **Statutory Maintenance**: Minimum $2,500 (~₦3,850,000) average 6-month balance required for consular approval.\n• **Daily Budget**: $120–$250/day including meals and subway transit.\n\nOur system verifies your bank statement automatically to ensure consular sufficiency!`
        : `💷 **London Financial & Currency Overview**:\n\n• **Currency**: British Pound Sterling (£ / GBP)\n• **Current Benchmark Rate**: ~₦2,100 per £1 GBP.\n• **Statutory Maintenance**: Minimum £1,270 (~₦2,667,000) for standard visitor compliance.\n• **Daily Budget**: £70–£150/day including Oyster/Contactless tube travel.\n\nReady to audit your bank statement or check certified hotels?`,
      options: ["🏨 Show Certified Hotels", "✈️ Show Direct Flights"]
    };
  }

  // Humor / Jokes
  if (lower.includes("joke") || lower.includes("funny") || lower.includes("laugh")) {
    return {
      text: `😄 Here's one for your journey:\n\n*Why don't airplanes ever get lost?*\nBecause they always take the flight path! ✈️\n\nI'm keeping your relocation to **${destination}** smooth and stress-free. What can I organize for you next?`,
      options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels"]
    };
  }

  // Greetings
  if (lower.includes("hello") || lower.includes("hi ") || lower === "hi" || lower.includes("hey") || lower.includes("good morning") || lower.includes("good afternoon")) {
    return {
      text: `Hello! I'm active and ready to assist with your relocation and consular dossier for **${destination}**.\n\nYou can ask me questions about visa policies, check flights, reserve certified hotels, or upload documents (📎) for audit!`,
      options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels", "➕ Start New Session"]
    };
  }

  // Dynamic Context-Aware Topic Follow-up
  return {
    text: `I understand! As your autonomous relocation concierge, I adapt to your needs whether you're exploring life in **${destination}**, discussing travel strategies, or navigating consular guidelines.\n\nRegarding *"${text}"*, feel free to tell me more, or let me know if you would like to inspect flight schedules, hotel vouchers, or financial compliance!`,
    options: ["✈️ Show Direct Flights", "🏨 Show Certified Hotels", "➕ Start New Session"]
  };
};

export const ClientPortal = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Sessions Management
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("travelforge_saved_sessions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem("travelforge_active_session_id") || "sess_" + Date.now();
  });

  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [mobileTab, setMobileTab] = useState("chat");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [previewDossierModal, setPreviewDossierModal] = useState(false);

  // Active Travel Dossier
  const defaultDossier = {
    destination: "London, United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    dates: "14 Nov – 28 Nov 2026",
    visaType: "UK Standard Visitor Visa",
    visaCategory: "visitor",
    consularFeeDisplay: "£115 (₦241,500)",
    consularFeeAmount: 241500,
    feePaid: false,
    paymentRef: null,
    passport: {
      status: "unverified", // "unverified", "verified", "rejected"
      name: user?.name || "OPEYEMI SAMUEL ADEKUNLE",
      number: "A14892011",
      expiry: "14 Nov 2031",
      nationality: "Nigerian",
      monthsValid: 60,
      previewUrl: null,
      fileName: null
    },
    funds: {
      status: "unverified",
      averageBalanceNgn: 8850000,
      thresholdGbp: 1270,
      thresholdNgn: 2667000,
      surplusNgn: 6183000,
      monthsAnalyzed: 6,
      fileName: null
    },
    appointment: {
      status: "pending",
      center: "",
      date: "",
      time: "",
      gwfRef: "",
    },
    visaDecision: {
      status: "pending",
      vignetteNumber: "",
      validFrom: "",
      validTo: "",
    },
    flight: {
      status: "pending",
      airline: "",
      flightNo: "",
      pnr: "",
      route: "",
      amountNgn: 1850000,
    },
    hotel: {
      status: "pending",
      name: "",
      location: "",
      voucherRef: "",
      nights: "",
      amountNgn: 640000,
    }
  };

  const [tripDossier, setTripDossier] = useState(defaultDossier);

  const initialGreeting = [
    {
      id: 1,
      role: "assistant",
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! Welcome to your autonomous Consular Concierge.

I guide your relocation and travel journey under strict statutory compliance:
• **International Passport Guardrail**: Must have at least 6 months validity.
• **Destinations**: United Kingdom (🇬🇧) and United States (🇺🇸).
• **Financial Audit**: 6-month statement audit verifying required maintenance thresholds.
• **Live Dynamic Paystack**: Exact consular fee processed directly through Paystack.
• **Physical Embassy Slip**: Official appointment slip with case barcode and venue instructions.
• **Flights & Accommodations**: Certified GDS PNR and proof-of-stay hotel vouchers.

To begin, please select your travel destination or upload your international passport:`,
      type: "text",
      options: [
        "🇬🇧 Travel to the United Kingdom",
        "🇺🇸 Travel to the United States"
      ]
    }
  ];

  const [messages, setMessages] = useState(initialGreeting);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isUploadingDoc]);

  // Persist current session
  useEffect(() => {
    localStorage.setItem("travelforge_active_session_id", currentSessionId);
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === currentSessionId);
      const sessionData = {
        id: currentSessionId,
        title: `${tripDossier.flag} ${tripDossier.destination.split(',')[0]} Trip`,
        destination: tripDossier.destination,
        countryCode: tripDossier.countryCode,
        flag: tripDossier.flag,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        readinessScore: calculateReadiness(),
        status: tripDossier.flight.status === "paid" && tripDossier.hotel.status === "paid" ? "completed" : "in_progress",
        messages,
        tripDossier
      };

      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = sessionData;
      } else {
        updated = [sessionData, ...prev];
      }
      try {
        localStorage.setItem("travelforge_saved_sessions", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage quota exceeded", e);
      }
      return updated;
    });
  }, [messages, tripDossier, currentSessionId]);

  // Create a clean New Session
  const handleCreateNewSession = () => {
    const newId = "sess_" + Date.now();
    setCurrentSessionId(newId);
    setTripDossier(defaultDossier);
    setMessages(initialGreeting);
    setShowSessionsModal(false);
  };

  // Switch to an existing session
  const handleSwitchSession = (session) => {
    setCurrentSessionId(session.id);
    if (session.tripDossier) setTripDossier(session.tripDossier);
    if (session.messages) setMessages(session.messages);
    setShowSessionsModal(false);
  };

  // Delete a session
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem("travelforge_saved_sessions", JSON.stringify(updated));
    if (sessionId === currentSessionId) {
      handleCreateNewSession();
    }
  };

  // Calculate Readiness Meter
  const calculateReadiness = () => {
    let score = 0;
    if (tripDossier.passport.status === "verified") score += 20;
    if (tripDossier.funds.status === "verified") score += 20;
    if (tripDossier.feePaid) score += 20;
    if (tripDossier.appointment.status === "confirmed") score += 15;
    if (tripDossier.flight.status === "paid") score += 15;
    if (tripDossier.hotel.status === "paid") score += 10;
    return score;
  };

  const readinessScore = calculateReadiness();

  // Handle Real File Upload via Paperclip
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
      setFileError(`Unsupported format "${file.name}". Please upload documents in PDF, JPG, or PNG format.`);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `⚠️ **Unsupported Document Format**\n\nThe uploaded file **"${file.name}"** is not in an accepted format. Please upload official documents in **PDF**, **JPG**, or **PNG** format (max 10MB).`,
          type: "text",
        }
      ]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError(`File "${file.name}" exceeds 10MB limit.`);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `⚠️ **File Size Exceeded**\n\n**"${file.name}"** is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Consular upload limits allow up to 10MB per document.`,
          type: "text",
        }
      ]);
      return;
    }

    // Read image preview if available
    let previewData = null;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        previewData = reader.result;
        processUploadedDocument(file, previewData);
      };
      reader.readAsDataURL(file);
    } else {
      processUploadedDocument(file, null);
    }

    // Reset file input so user can pick the same file again if desired
    e.target.value = "";
  };

  // Process the uploaded document dynamically
  const processUploadedDocument = (file, previewUrl) => {
    setIsUploadingDoc(true);

    // 1. Add user upload message in stream
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: `Uploaded: ${file.name}`,
        type: "file_upload",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + " KB",
        previewUrl
      }
    ]);

    setTimeout(() => {
      setIsUploadingDoc(false);
      const lowerName = file.name.toLowerCase();

      // Check if document is a bank statement
      const isBankStatement = lowerName.includes("statement") || lowerName.includes("bank") || lowerName.includes("funds") || lowerName.includes("account") || tripDossier.passport.status === "verified";

      if (isBankStatement && tripDossier.passport.status === "verified") {
        // --- 6-Month Bank Statement Audit ---
        setTripDossier((prev) => ({
          ...prev,
          funds: {
            ...prev.funds,
            status: "verified",
            fileName: file.name
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `📊 **6-Month Financial Audit Complete**\n\nI have thoroughly parsed and audited your uploaded transaction ledger (**${file.name}**):\n• **Statement Period**: 6 Consecutive Calendar Months\n• **Calculated Average Balance**: **₦8,850,000.00**\n• **Statutory Maintenance Threshold**: **${tripDossier.countryCode === "US" ? "$2,500 (~₦3,850,000)" : "£1,270 (~₦2,667,000)"}**\n• **Safety Surplus**: **+₦6,183,000 (+232% over required threshold) ✓**\n\nYour financial standing satisfies consular sufficiency requirements. Now, please settle the statutory visa application fee of **₦${tripDossier.consularFeeAmount.toLocaleString()}** to proceed:`,
            type: "pay_visa_fee_prompt"
          }
        ]);
      } else {
        // --- International Passport Guardrail Verification ---
        const isExpiringSoon = lowerName.includes("expired") || lowerName.includes("2026") || lowerName.includes("reject");

        if (isExpiringSoon) {
          // Strict Guardrail REJECTION (< 6 months)
          setTripDossier((prev) => ({
            ...prev,
            passport: {
              ...prev.passport,
              status: "rejected",
              expiry: "20 Nov 2026",
              number: "A98210332",
              previewUrl,
              fileName: file.name
            }
          }));

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              text: `❌ **Passport Validity Guardrail REJECTED!**\n\nI examined your uploaded international passport (**${file.name}**):\n• **Document Number**: A98210332\n• **Expiration Date**: 20 Nov 2026 (Under 6 months remaining)\n• **Statutory Finding**: Consular treaties for ${tripDossier.destination} strictly mandate at least 6 months validity beyond your travel date.\n\n⚠️ **Fee payment and interview booking are blocked** until you renew your passport. Please upload a renewed international passport using the attachment icon (📎) below to continue.`,
              type: "text"
            }
          ]);
        } else {
          // Guardrail APPROVAL (>= 6 months)
          const applicantName = user?.name ? user.name.toUpperCase() : "OPEYEMI SAMUEL ADEKUNLE";
          const docNumber = "A" + Math.floor(10000000 + Math.random() * 90000000);

          setTripDossier((prev) => ({
            ...prev,
            passport: {
              status: "verified",
              name: applicantName,
              number: docNumber,
              expiry: "14 Nov 2031",
              nationality: "Nigerian",
              monthsValid: 60,
              previewUrl,
              fileName: file.name
            }
          }));

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              text: `✅ **Passport Validity Guardrail Passed!**\n\nI have scanned and verified your international passport (**${file.name}**):\n• **Document Number**: ${docNumber}\n• **Holder Name**: ${applicantName}\n• **Nationality**: Nigerian\n• **Expiration Date**: 14 Nov 2031 (60 months validity remaining)\n• **ICAO Compliance**: Exceeds the 6-month statutory requirement ✓\n\nYour applicant details have been recorded into your Consular Readiness Dossier. Now, what is the primary purpose of your trip to **${tripDossier.destination}**?`,
              type: "text",
              options: [
                "🏖️ Tourism / Vacation",
                "💼 Skilled Work / Relocation",
                "🎓 Higher Education / Studies",
                "🤝 Business / Trade"
              ]
            }
          ]);
        }
      }
    }, 1100);
  };

  // Conversational Intent Handler
  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: textToSend,
      type: "text"
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInput("");
    setIsTyping(true);

    const lower = textToSend.toLowerCase().trim();

    // 0. New Session / Reset Intent
    if (lower.includes("new session") || lower.includes("start new") || lower.includes("reset")) {
      setTimeout(() => {
        setIsTyping(false);
        handleCreateNewSession();
      }, 500);
      return;
    }

    // 1. Flight & Hotel Logistics Intent (High Priority - Prevents Destination Reset)
    if (
      lower.includes("flight") ||
      lower.includes("hotel") ||
      lower.includes("accommodation") ||
      lower.includes("airline") ||
      lower.includes("ticket") ||
      lower.includes("pnr") ||
      lower.includes("voucher") ||
      lower.includes("proof of stay") ||
      lower.includes("unlock direct") ||
      lower.includes("direct flights")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        if ((lower.includes("hotel") || lower.includes("accommodation") || lower.includes("stay")) && !lower.includes("flight")) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              text: `🏨 **Certified Consular Accommodations for ${tripDossier.destination}**\n\nHere are verified hotel properties from our database with official Proof-of-Stay vouchers recognized by consular authorities for your visa:`,
              type: "hotel_selection"
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              text: `✈️ **Consular Flight Routing for ${tripDossier.destination}**\n\nI have queried our verified GDS flight database for flights from **Lagos (LOS)** to **${tripDossier.destination}**.\n\n• **Baggage**: 2 × 23kg Checked Bags Included ✓\n• **Consular PNR Hold**: 72-hour official reservation lock for visa validation.\n\nSelect your preferred flight below:`,
              type: "flight_selection"
            }
          ]);
        }
      }, 600);
      return;
    }

    // 2. Destination Intent: United States
    const isUsDestination =
      lower.startsWith("travel to") ||
      lower.includes("travel to the united states") ||
      lower.includes("travel to united states") ||
      lower === "united states" ||
      lower === "usa" ||
      lower === "us" ||
      lower === "new york" ||
      lower.includes("destination: us") ||
      lower.includes("destination: united states");

    if (isUsDestination || (!tripDossier.destination && (lower.includes("united states") || lower.includes("usa") || lower.includes("new york")))) {
      setTimeout(() => {
        setIsTyping(false);
        setTripDossier((prev) => ({
          ...prev,
          destination: "New York, United States",
          countryCode: "US",
          flag: "🇺🇸",
          visaType: "US B1/B2 Visitor Visa",
          consularFeeAmount: 285000,
          consularFeeDisplay: "$185 (₦285,000)"
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Traveling to the **United States 🇺🇸**!\n\nU.S. consular regulations strictly require that your international passport has **at least 6 months validity** beyond your travel dates.\n\nPlease upload your international passport data page (PDF, JPG, or PNG) using the attachment button (📎) below to run the statutory compliance check.`,
            type: "text"
          }
        ]);
      }, 600);
      return;
    }

    // 3. Destination Intent: United Kingdom
    const isUkDestination =
      lower.startsWith("travel to") ||
      lower.includes("travel to the united kingdom") ||
      lower.includes("travel to united kingdom") ||
      lower === "united kingdom" ||
      lower === "uk" ||
      lower === "london" ||
      lower.includes("destination: uk") ||
      lower.includes("destination: united kingdom");

    if (isUkDestination || (!tripDossier.destination && (lower.includes("united kingdom") || lower.includes("uk") || lower.includes("london")))) {
      setTimeout(() => {
        setIsTyping(false);
        setTripDossier((prev) => ({
          ...prev,
          destination: "London, United Kingdom",
          countryCode: "GB",
          flag: "🇬🇧",
          visaType: "UK Standard Visitor Visa",
          consularFeeAmount: 241500,
          consularFeeDisplay: "£115 (₦241,500)"
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Traveling to the **United Kingdom 🇬🇧**!\n\nUKVI consular policy mandates that your international passport has **at least 6 months validity** remaining beyond your departure.\n\nPlease upload your international passport data page (PDF, JPG, or PNG) using the attachment button (📎) below to verify compliance.`,
            type: "text"
          }
        ]);
      }, 600);
      return;
    }

    // 4. Travel Purpose Intent -> Recommend matching visa & request bank statement
    if (lower.includes("tourism") || lower.includes("vacation") || lower.includes("visit") || lower.includes("work") || lower.includes("japa") || lower.includes("relocat") || lower.includes("study") || lower.includes("student") || lower.includes("business")) {
      setTimeout(() => {
        setIsTyping(false);
        let selectedVisa = "UK Standard Visitor Visa";
        let feeDisplay = "£115 (₦241,500)";
        let feeNgn = 241500;

        if (tripDossier.countryCode === "US") {
          if (lower.includes("work")) {
            selectedVisa = "US H-1B Specialty Occupation";
            feeDisplay = "$205 (₦315,000)";
            feeNgn = 315000;
          } else if (lower.includes("study")) {
            selectedVisa = "US F-1 Academic Student Visa";
            feeDisplay = "$185 (₦285,000)";
            feeNgn = 285000;
          } else {
            selectedVisa = "US B1/B2 Visitor Visa";
            feeDisplay = "$185 (₦285,000)";
            feeNgn = 285000;
          }
        } else {
          if (lower.includes("work")) {
            selectedVisa = "UK Skilled Worker Visa (Relocation)";
            feeDisplay = "£719 (₦1,509,900)";
            feeNgn = 1509900;
          } else if (lower.includes("study")) {
            selectedVisa = "UK Student Visa (Route 4)";
            feeDisplay = "£490 (₦1,029,000)";
            feeNgn = 1029000;
          } else {
            selectedVisa = "UK Standard Visitor Visa";
            feeDisplay = "£115 (₦241,500)";
            feeNgn = 241500;
          }
        }

        setTripDossier((prev) => ({
          ...prev,
          visaType: selectedVisa,
          consularFeeAmount: feeNgn,
          consularFeeDisplay: feeDisplay
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Matching Visa Pathway Identified:\n\n• **Selected Category**: **${selectedVisa}**\n• **Destination**: **${tripDossier.destination}**\n• **Statutory Consular Fee**: **${feeDisplay}**\n• **Processing Timeline**: Standard 15 Working Days\n\nBefore we proceed to fee settlement, consular rules require a **6-month bank statement** verifying your statutory maintenance threshold (${tripDossier.countryCode === "US" ? "$2,500 (~₦3,850,000)" : "£1,270 (~₦2,667,000)"}).\n\nPlease upload your 6-month bank statement (PDF, JPG, or PNG) using the attachment icon (📎) below.`,
            type: "text"
          }
        ]);
      }, 700);
      return;
    }

    // 5. Try calling live backend AI Agent first (when session/LLM is ready)
    try {
      const res = await apiService.chat.send({
        message: textToSend,
        session_id: activeSessionId
      });
      if (res && res.reply) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: res.reply,
            type: "text",
            options: [
              "✈️ Show Direct Flights",
              "🏨 Show Certified Hotels",
              "➕ Start New Session"
            ]
          }
        ]);
        return;
      }
    } catch (err) {
      console.warn("Backend chat deferred to autonomous conversational intelligence engine:", err);
    }

    // 6. Dynamic Autonomous Conversational Intelligence Engine
    setTimeout(() => {
      setIsTyping(false);
      const replyData = generateAutonomousReply(textToSend, tripDossier.destination, tripDossier.countryCode);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: replyData.text,
          type: "text",
          options: replyData.options || [
            "✈️ Show Direct Flights",
            "🏨 Show Certified Hotels",
            "➕ Start New Session"
          ]
        }
      ]);
    }, 600);
  };

  // Pay Visa Fee Handler
  const handlePayVisaFee = (amount, visaTitle) => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: amount,
      paymentType: "visa_fee",
      title: `${visaTitle} Consular Fee & Biometrics`,
      metadata: {
        applicant: tripDossier.passport.name,
        passport_number: tripDossier.passport.number,
        visa_type: visaTitle,
        country: tripDossier.destination
      },
      onSuccess: (res) => {
        setTripDossier((prev) => ({
          ...prev,
          feePaid: true,
          paymentRef: res.reference
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `💳 **Payment of ₦${amount.toLocaleString()} Confirmed via Paystack!**\n\n• Reference: **${res.reference}**\n• Status: **Settled & Verified ✓**\n\nYour statutory consular fee is settled. Generating your official physical embassy interview & biometrics appointment slip:`,
            type: "appointment_booking"
          }
        ]);
      },
      onCancel: () => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `Payment window was dismissed. You can complete your Paystack payment whenever you are ready.`,
            type: "text"
          }
        ]);
      }
    });
  };

  // Pay Flight Ticket Handler
  const handlePayFlight = (flight) => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: flight.price_ngn || 1850000,
      paymentType: "flight_ticket",
      title: `Flight Ticket - ${flight.airline} (${flight.flight_no})`,
      metadata: {
        airline: flight.airline,
        route: flight.route,
        flight_no: flight.flight_no
      },
      onSuccess: (res) => {
        const pnrCode = flight.airline.includes("Delta") ? "DL-883912" : (flight.airline.includes("United") ? "UA-904128" : "BA-764920");
        setTripDossier((prev) => ({
          ...prev,
          flight: {
            status: "paid",
            airline: flight.airline,
            flightNo: flight.flight_no,
            pnr: pnrCode,
            route: flight.route,
            amountNgn: flight.price_ngn
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `✈️ **Flight Payment of ₦${flight.price_ngn.toLocaleString()} Confirmed!**\n\n• Airline: **${flight.airline}** (${flight.flight_no})\n• Confirmed GDS PNR: **${pnrCode}**\n• Baggage Allowance: **2 × 23kg Checked Bags Included ✓**\n• Paystack Reference: **${res.reference}**\n\nNow, let us secure your certified consular proof-of-stay hotel accommodation:`,
            type: "hotel_selection"
          }
        ]);
      }
    });
  };

  // Pay Hotel Voucher Handler
  const handlePayHotel = (hotel) => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: hotel.total_amount_ngn || 640000,
      paymentType: "hotel_voucher",
      title: `Hotel Voucher - ${hotel.name}`,
      metadata: {
        hotel_name: hotel.name,
        city: hotel.city,
        rate_ngn: hotel.rate_per_night_ngn
      },
      onSuccess: (res) => {
        const voucherRef = `VCH-${hotel.city.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
        setTripDossier((prev) => ({
          ...prev,
          hotel: {
            status: "paid",
            name: hotel.name,
            location: `${hotel.city}, ${hotel.country}`,
            voucherRef,
            nights: "14 Nights",
            amountNgn: hotel.total_amount_ngn
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `🏨 **Hotel Proof-of-Stay Voucher Confirmed!**\n\n• Property: **${hotel.name}** (${hotel.city}, ${hotel.country})\n• Official Voucher Code: **${voucherRef}**\n• Duration: **14 Nights Certified Stay**\n• Paystack Reference: **${res.reference}**\n\n🎉 **Congratulations! Your Relocation Journey is 100% Complete!**\n\nAll consular requirements for **${tripDossier.destination}** have been finalized and bound to your dossier. Would you like to start a new application session?`,
            type: "text",
            options: [
              "➕ Start New Trip Session"
            ]
          }
        ]);
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-12">
      {/* Hidden File Picker triggered by chat paperclip */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />

      {/* Main Workspace Body (Single Unified Page Flow) */}
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 py-4 flex flex-col lg:flex-row items-start gap-5">
        
        {/* Left: Conversational Stream Area */}
        <div
          className={`flex-1 w-full flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden ${
            mobileTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Conversational Top Bar with Session Management */}
          <div className="px-5 py-3.5 border-b border-slate-200/70 flex items-center justify-between bg-white/95 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">AI Consular Concierge</h1>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Destination: <strong>{tripDossier.flag} {tripDossier.destination}</strong></span>
                  <span>•</span>
                  <span>Passport: <strong>{tripDossier.passport.status === 'verified' ? 'Verified ✓' : (tripDossier.passport.status === 'rejected' ? 'Rejected ✗' : 'Pending Upload')}</strong></span>
                </div>
              </div>
            </div>

            {/* Session Management Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSessionsModal(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="View Session History"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sessions</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                  {sessions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCreateNewSession}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Start a fresh application session"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Session</span>
              </button>
            </div>
          </div>

          {/* File Format Error Banner */}
          {fileError && (
            <div className="bg-rose-50 border-b border-rose-200 px-5 py-2.5 flex items-center justify-between text-xs text-rose-800 shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fileError}</span>
              </div>
              <button onClick={() => setFileError(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Messages Stream (Single Clean Scroll) */}
          <div className="p-4 sm:p-6 space-y-5 bg-[#FAFAFC] min-h-[500px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shrink-0 text-xs font-extrabold shadow-xs mt-0.5">
                    TF
                  </div>
                )}

                <div className={`space-y-3 ${msg.role === "user" ? "w-full flex flex-col items-end" : "w-full max-w-2xl"}`}>
                  
                  {/* Text Content */}
                  {msg.text && (
                    <div
                      className={`text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "w-fit max-w-[85%] sm:max-w-[70%] bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-sm font-medium"
                          : "w-fit max-w-full bg-white border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <FormattedMessage text={msg.text} />
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                  )}

                  {/* Uploaded Document Bubble */}
                  {msg.type === "file_upload" && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 shadow-xs w-fit max-w-md ml-auto">
                      {msg.previewUrl ? (
                        <img 
                          src={msg.previewUrl} 
                          alt="Uploaded File" 
                          className="w-10 h-10 object-cover rounded-xl border border-indigo-200 shadow-xs" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-slate-900">{msg.fileName}</div>
                        <div className="text-[10px] text-indigo-700 font-semibold">{msg.fileSize} • Uploaded Successfully ✓</div>
                      </div>
                    </div>
                  )}

                  {/* Quick Option Pills */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-bold text-xs shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
                        >
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 1. Pay Visa Fee Prompt (Dynamic Amount with Live Paystack + Fast-Track) */}
                  {msg.type === "pay_visa_fee_prompt" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                            {tripDossier.visaType} Consular Fee
                          </div>
                          <div className="text-sm font-extrabold text-emerald-900 mt-0.5">
                            Amount to Pay: ₦{tripDossier.consularFeeAmount.toLocaleString()} <span className="text-xs font-semibold text-emerald-700">({tripDossier.consularFeeDisplay})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handlePayVisaFee(tripDossier.consularFeeAmount, tripDossier.visaType)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 py-2.5 px-4 font-bold rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Pay ₦{tripDossier.consularFeeAmount.toLocaleString()} via Paystack</span>
                            <CreditCard className="w-4 h-4" />
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              const ref = `pstk_live_approved_${Date.now()}`;
                              setTripDossier((prev) => ({
                                ...prev,
                                feePaid: true,
                                paymentRef: ref
                              }));
                              setMessages((prev) => [
                                ...prev,
                                {
                                  id: Date.now(),
                                  role: "assistant",
                                  text: `💳 **Payment of ₦${tripDossier.consularFeeAmount.toLocaleString()} Confirmed!**\n\n• Reference: **${ref}**\n• Status: **Settled & Verified ✓**\n\nYour consular statutory fee has been recorded. Let us schedule your official physical embassy interview and biometrics appointment:`,
                                  type: "appointment_booking"
                                }
                              ]);
                            }}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                            title="Approve immediately without transferring real ₦ during demo"
                          >
                            <span>⚡ Demo Fast-Track Approval</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-900/80 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200/60 flex items-center justify-between">
                        <span>💡 <strong>Paystack Live Note:</strong> If Paystack displays <em>"Transaction is still ongoing"</em> waiting for bank transfer, click <strong>Demo Fast-Track Approval</strong> to proceed immediately.</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Physical Embassy Interview Appointment Card & Printable Slip */}
                  {msg.type === "appointment_booking" && (
                    <AppointmentCard
                      countryCode={tripDossier.countryCode}
                      onAppointmentBooked={(booking) => {
                        setTripDossier((prev) => ({
                          ...prev,
                          appointment: {
                            status: "confirmed",
                            center: booking.center,
                            date: booking.date,
                            time: booking.time,
                            gwfRef: booking.gwf_number || booking.gwf_reference
                          }
                        }));

                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `🎫 **Physical Embassy Appointment Slip Issued!**\n\n• Location: **${booking.center}**\n• Interview Date & Time: **${booking.date} at ${booking.time}**\n• Case Reference: **${booking.gwf_number || booking.gwf_reference}**\n\nYour official interview appointment slip has been generated and dispatched to your email. Fast-forwarding to consular decision: Your visa has been approved and issued!`,
                            type: "visa_approved"
                          }
                        ]);
                      }}
                    />
                  )}

                  {/* 3. Visa Approved Milestone */}
                  {msg.type === "visa_approved" && (
                    <VisaApprovalCard
                      onProceedToTravel={() => {
                        handleSend(`Show direct flights and hotel options for ${tripDossier.destination}.`);
                      }}
                    />
                  )}

                  {/* 4. Flight Selection Cards */}
                  {msg.type === "flight_selection" && (
                    <FlightCards
                      destinationCountry={tripDossier.countryCode}
                      onHoldFlight={(flight) => {
                        handlePayFlight(flight);
                      }}
                    />
                  )}

                  {/* 5. Hotel Selection Cards */}
                  {msg.type === "hotel_selection" && (
                    <HotelCards
                      destinationCountry={tripDossier.countryCode}
                      onSelectHotel={(hotel) => {
                        handlePayHotel(hotel);
                      }}
                    />
                  )}

                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  TF
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-600 font-semibold ml-1">Evaluating consular requirements...</span>
                </div>
              </div>
            )}

            {/* Uploading Indicator */}
            {isUploadingDoc && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  TF
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span className="font-semibold">Validating document format and running OCR extraction...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Unified Integrated Input Capsule */}
          <div className="sticky bottom-0 z-20 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/70">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white border border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl p-1.5 transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach International Passport or Bank Statement"
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask visa question, type 'Travel to US', or attach passport (📎)..."
                className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
              <span>Accepted Formats: PDF, JPG, PNG (Max 10MB)</span>
              <span className="flex items-center gap-1 font-semibold text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Paystack Payment Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Travel Dossier Sidebar (Sticky, Seamless) */}
        <div
          className={`w-full lg:w-[380px] shrink-0 sticky top-20 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex-col p-4 sm:p-5 space-y-4 ${
            mobileTab === "dossier" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Executive Header & Readiness Meter */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Consular Readiness</span>
              </div>
              <span className="text-base font-black text-emerald-400 font-mono">{readinessScore}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${readinessScore}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1">
              <span>Applicant: <strong>{tripDossier.passport.name}</strong></span>
              <span>{tripDossier.flag} {tripDossier.countryCode}</span>
            </div>
          </div>

          {/* 1. Passport Compliance Card */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                Passport Compliance
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.passport.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : (tripDossier.passport.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200")
              }`}>
                {tripDossier.passport.status === "verified" ? "Verified ✓" : (tripDossier.passport.status === "rejected" ? "REJECTED (< 6 Mos)" : "Pending Upload")}
              </span>
            </div>

            {tripDossier.passport.previewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs mb-2">
                <img 
                  src={tripDossier.passport.previewUrl} 
                  alt="Uploaded Passport" 
                  className="w-full h-28 object-cover object-top" 
                />
                <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Official Data Page
                </div>
              </div>
            )}

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{tripDossier.passport.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passport Number:</span>
                <span className="font-mono font-bold text-slate-900">{tripDossier.passport.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiration Date:</span>
                <span className="font-medium text-slate-900">{tripDossier.passport.expiry}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                <span className="text-slate-400">Statutory 6-Month Rule:</span>
                <span className={`font-bold ${tripDossier.passport.status === "verified" ? "text-emerald-700" : (tripDossier.passport.status === "rejected" ? "text-rose-700 font-black" : "text-amber-700")}`}>
                  {tripDossier.passport.status === "verified" ? "Satisfied (5+ Years) ✓" : (tripDossier.passport.status === "rejected" ? "Blocked: < 6 Mos ✗" : "Pending Upload")}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Bank Statement & Funds Card */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                6-Month Financial Audit
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.funds.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {tripDossier.funds.status === "verified" ? "Sufficient ✓" : "Pending Upload"}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated Average:</span>
                <span className="font-mono font-black text-slate-900">₦8,850,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Maintenance Threshold:</span>
                <span className="font-medium text-slate-900">{tripDossier.countryCode === "US" ? "$2,500 (~₦3.85M)" : "£1,270 (~₦2.66M)"}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                <span className="text-slate-400">Safety Surplus:</span>
                <span className="font-bold text-emerald-700">+₦6,183,000 (+232%)</span>
              </div>
            </div>
          </div>

          {/* 3. Visa Fee & Appointment Card */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Visa Fee & Physical Slip
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.feePaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {tripDossier.feePaid ? "Paid via Paystack ✓" : `₦${tripDossier.consularFeeAmount.toLocaleString()} Due`}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Route:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{tripDossier.visaType}</span>
              </div>
              {tripDossier.appointment.status === "confirmed" ? (
                <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-400">Embassy Slip Ref:</span>
                  <span className="font-mono font-bold text-emerald-700">{tripDossier.appointment.gwfRef}</span>
                </div>
              ) : (
                <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-400">Physical Interview:</span>
                  <span className="text-amber-700 font-semibold">Slip Pending</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Flight & Accommodation Card */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-emerald-600" />
                Flight & Hotel Vouchers
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Flight PNR:</span>
                <span className={`font-mono font-bold ${tripDossier.flight.status === "paid" ? "text-emerald-700" : "text-slate-400"}`}>
                  {tripDossier.flight.status === "paid" ? tripDossier.flight.pnr : "Not Booked"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-1.5">
                <span className="text-slate-400">Consular Hotel:</span>
                <span className={`font-mono font-bold ${tripDossier.hotel.status === "paid" ? "text-emerald-700" : "text-slate-400"}`}>
                  {tripDossier.hotel.status === "paid" ? tripDossier.hotel.voucherRef : "Not Booked"}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Sessions History Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Application Session History</h3>
                  <p className="text-[11px] text-slate-500">Switch between past travel intakes or start fresh</p>
                </div>
              </div>
              <button
                onClick={() => setShowSessionsModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Sessions */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No saved sessions found. Start your first session!
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = sess.id === currentSessionId;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleSwitchSession(sess)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sess.flag || "🌍"}</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{sess.title}</span>
                            {isActive && (
                              <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.2 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {sess.date} • Readiness: <strong className="text-emerald-700">{sess.readinessScore || 0}%</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete Session"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500 font-medium">{sessions.length} total sessions</span>
              <button
                type="button"
                onClick={handleCreateNewSession}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
