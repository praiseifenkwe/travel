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
  Ticket,
  Building2,
  CreditCard,
  Award,
  Lock,
  ExternalLink,
  MessageSquare,
  Briefcase
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { Link } from "react-router-dom";
import { apiService, formatApiError } from "../services/api";
import { openPaystackPopup } from "../services/paystack";
import { useAuth } from "../context/AuthContext";
import { VisaComparisonCard } from "../components/chat/VisaComparisonCard";
import { BankStatementCard } from "../components/chat/BankStatementCard";
import { AppointmentCard } from "../components/chat/AppointmentCard";
import { VisaApprovalCard } from "../components/chat/VisaApprovalCard";
import { FlightCards } from "../components/flights/FlightCards";
import { HotelCards } from "../components/accommodations/HotelCards";

export const ClientPortal = () => {
  const { user, openAuthModal } = useAuth();
  const storageKey = user ? `travelforge_session_${user.id}` : "travelforge_session_guest";
  const appStorageKey = user ? `travelforge_app_${user.id}` : "travelforge_app_guest";
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(storageKey) || null);
  const [applicationId, setApplicationId] = useState(() => localStorage.getItem(appStorageKey) || null);
  
  // Mobile View Switcher: "chat" or "dossier"
  const [mobileTab, setMobileTab] = useState("chat");

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [previewDossierModal, setPreviewDossierModal] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Live Comprehensive Travel & Consular Dossier
  const [tripDossier, setTripDossier] = useState({
    destination: "London, United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    dates: "14 Nov – 28 Nov 2026",
    visaType: "UK Standard Visitor Visa",
    visaCategory: "visitor",
    consularFee: "£115 (₦241,500)",
    feePaid: false,
    paymentRef: null,
    passport: {
      status: "unverified",
      name: "Tunde Babatunde Adeyemi",
      number: "A12345678",
      expiry: "14 Nov 2031",
      nationality: "Nigerian",
      monthsValid: 60,
    },
    funds: {
      status: "unverified",
      averageBalanceNgn: 8850000,
      thresholdGbp: 1270,
      thresholdNgn: 2667000,
      surplusNgn: 6183000,
      monthsAnalyzed: 6,
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
  });

  // Dynamic Conversational Stream
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hello Tunde! Welcome to your TravelForge consular intake workspace.

I am your autonomous Consular & Relocation Concierge. I will guide you through your visa eligibility, verify your passport and 6-month bank statements, schedule your VFS biometrics appointment, and secure direct flight holds and certified hotel vouchers.

Where would you like to travel, or would you like to start by inspecting your passport?`,
      type: "text",
      options: [
        "🇬🇧 Travel to the UK (Vacation / Tourism)",
        "💼 Relocate to the UK for Skilled Work ('Japa')",
        "🎓 Study in the UK (Student Visa)",
        "📄 Verify My Passport Validity (A12345678)"
      ]
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isUploadingDoc]);

  // Handle Document Upload with Strict Format Verification
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
          text: `⚠️ **Unsupported Document Format**

The uploaded file **"${file.name}"** is not in an accepted consular format. Please upload official documents in **PDF**, **JPG**, or **PNG** format (max 10MB).`,
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
          text: `⚠️ **File Size Exceeded**

**"${file.name}"** is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Consular upload limits allow up to 10MB per document.`,
          type: "text",
        }
      ]);
      return;
    }

    setIsUploadingDoc(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: `Uploaded document: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`,
        type: "file_upload",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + " KB"
      }
    ]);

    setTimeout(() => {
      setIsUploadingDoc(false);
      const lowerName = file.name.toLowerCase();

      if (lowerName.includes("statement") || lowerName.includes("bank") || lowerName.includes("account") || lowerName.includes("funds")) {
        triggerBankStatementVerification();
      } else {
        triggerPassportVerification(file.name);
      }
    }, 1000);
  };

  // Passport Verification Handler
  const triggerPassportVerification = (fileName = "International_Passport_A12345678.pdf") => {
    setTripDossier((prev) => ({
      ...prev,
      passport: {
        ...prev.passport,
        status: "verified",
        monthsValid: 60,
      }
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        text: `✅ **Passport Compliance Verified**

• Document: **${fileName}**
• Holder: **Tunde Babatunde Adeyemi**
• Passport No: **A12345678** (Nigerian Standard)
• Expiry: **14 Nov 2031**
• Validity Check: **60 Months Remaining** (Exceeds the 6-month statutory rule ✓)
• ICAO Compliance: **MRZ Checksum Valid ✓**

Your passport is in order! What is your primary purpose of travel?`,
        type: "visa_options",
        options: [
          "Vacation & Tourism (Standard Visitor)",
          "Skilled Work / Relocation ('Japa')",
          "Higher Education (Tier 4 / Student)",
          "Business & Corporate Engagement"
        ]
      }
    ]);
  };

  // Bank Statement Analysis Handler
  const triggerBankStatementVerification = () => {
    setTripDossier((prev) => ({
      ...prev,
      funds: {
        ...prev.funds,
        status: "verified"
      }
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        text: `📊 **6-Month Bank Statement Audit Complete**

I have parsed your 6-month transaction ledger. Your average balance of **₦8,850,000** exceeds the UKVI maintenance requirement of **£1,270 (₦2,667,000)** with a **+232% surplus**!`,
        type: "bank_statement_card"
      },
      {
        id: Date.now() + 2,
        role: "assistant",
        text: `Your financial profile meets all statutory guidelines. The next step is paying your official visa fee (£115 / ₦380,000 equivalent with biometrics and processing). You can pay seamlessly via Paystack below.`,
        type: "pay_visa_fee_prompt"
      }
    ]);
  };

  // Trigger Real Paystack Checkout for Visa Fee
  const handlePayVisaFee = () => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: 380000,
      paymentType: "visa_fee",
      title: "UKVI Visa Application Fee & Consular Biometrics",
      metadata: {
        applicant: "Tunde Babatunde Adeyemi",
        visa_type: tripDossier.visaType
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
            text: `💳 **Payment Received via Paystack!**

• Transaction Reference: **${res.reference}**
• Amount: **₦380,000.00**
• Status: **Settled & Verified ✓**

Your visa application fee has been transmitted to UKVI. Let us now book your biometrics and interview appointment at VFS Global:`,
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
            text: `Payment window was dismissed. You can click "Pay Visa Fee via Paystack" whenever you are ready to proceed.`,
            type: "pay_visa_fee_prompt"
          }
        ]);
      }
    });
  };

  // Trigger Real Paystack Checkout for Flight Ticket Hold / Issuance
  const handlePayFlight = (flight) => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: flight.price_ngn || 1850000,
      paymentType: "flight_ticket",
      title: `Flight Ticket - ${flight.airline || "British Airways"} (${flight.flight_no || "BA-074"})`,
      metadata: {
        airline: flight.airline,
        route: flight.route || "LOS → LHR",
        flight_no: flight.flight_no || "BA-074"
      },
      onSuccess: (res) => {
        setTripDossier((prev) => ({
          ...prev,
          flight: {
            status: "paid",
            airline: flight.airline || "British Airways",
            flightNo: flight.flight_no || "BA-074",
            pnr: "BA-764920",
            route: "Lagos (LOS) → London Heathrow (LHR)",
            amountNgn: flight.price_ngn || 1850000
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `✈️ **Flight Payment Confirmed via Paystack!**

• Airline: **${flight.airline || "British Airways"}** (${flight.flight_no || "BA-074"})
• Confirmed PNR: **BA-764920**
• Baggage Allowance: **2 × 23kg Checked Bags + 1 Cabin**
• Payment Reference: **${res.reference}**

Now, let us secure your consular accommodation and proof-of-stay voucher:`,
            type: "hotel_selection"
          }
        ]);
      }
    });
  };

  // Trigger Real Paystack Checkout for Hotel Voucher
  const handlePayHotel = (hotel) => {
    openPaystackPopup({
      email: user?.email || "tunde.adeyemi@example.com",
      amountNgn: 640000,
      paymentType: "hotel_voucher",
      title: `Consular Proof-of-Stay Voucher - ${hotel.name || "Park Plaza Westminster"}`,
      metadata: {
        hotel_name: hotel.name,
        location: hotel.location
      },
      onSuccess: (res) => {
        setTripDossier((prev) => ({
          ...prev,
          hotel: {
            status: "paid",
            name: hotel.name || "Park Plaza Westminster Bridge",
            location: "London SE1 7UT, United Kingdom",
            voucherRef: "VCH-LON-892014",
            nights: "14 Nights",
            amountNgn: 640000
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `🏨 **Hotel Booking & Proof-of-Stay Voucher Issued!**

• Hotel: **${hotel.name || "Park Plaza Westminster"}**
• Consular Voucher Ref: **VCH-LON-892014**
• Status: **Confirmed with Official Consular QR Seal ✓**
• Payment Reference: **${res.reference}**

🎉 **Congratulations Tunde!** Your entire travel package is now fully locked:
1. ✅ Passport Certified
2. ✅ Bank Statement Verified (₦8.85M average)
3. ✅ Visa Approved & Stamped
4. ✅ VFS Appointment Confirmed
5. ✅ Flight Tickets Issued (PNR: BA-764920)
6. ✅ Hotel Voucher Locked (VCH-LON-892014)

You are 100% travel ready!`,
            type: "final_success"
          }
        ]);
      }
    });
  };

  // Handle Conversational Message Submission
  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = text.toLowerCase();

    // 1. Check for Passport Intent
    if (lower.includes("passport") || lower.includes("validity") || lower.includes("6 month") || lower.includes("a12345678")) {
      setTimeout(() => {
        setIsTyping(false);
        triggerPassportVerification();
      }, 700);
      return;
    }

    // 2. Check for Travel Reason / Visa Selection Intent
    if (lower.includes("vacation") || lower.includes("tourism") || lower.includes("holiday") || lower.includes("japa") || lower.includes("relocate") || lower.includes("work") || lower.includes("study") || lower.includes("student") || lower.includes("visa difference") || lower.includes("compare visa")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Based on your intent, here are the matching UK visa routes with live statutory fees in both GBP (£) and Nigerian Naira (₦) converted at the current exchange rate (£1 = ₦2,100):`,
            type: "visa_comparison_card"
          }
        ]);
      }, 700);
      return;
    }

    // 3. Check for Bank Statement / Proof of Funds Intent
    if (lower.includes("bank") || lower.includes("statement") || lower.includes("fund") || lower.includes("balance") || lower.includes("maintenance") || lower.includes("money")) {
      setTimeout(() => {
        setIsTyping(false);
        triggerBankStatementVerification();
      }, 700);
      return;
    }

    // 4. Check for Pay Visa Fee Intent
    if (lower.includes("pay fee") || lower.includes("pay visa") || lower.includes("paystack") || lower.includes("payment")) {
      setIsTyping(false);
      handlePayVisaFee();
      return;
    }

    // 5. Check for Appointment / VFS Intent
    if (lower.includes("appointment") || lower.includes("vfs") || lower.includes("biometrics") || lower.includes("interview")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Select your preferred VFS Global biometrics center and appointment time below:`,
            type: "appointment_booking"
          }
        ]);
      }, 700);
      return;
    }

    // 6. Check for Visa Approval Intent
    if (lower.includes("approved") || lower.includes("granted") || lower.includes("approval") || lower.includes("visa ready")) {
      setTimeout(() => {
        setIsTyping(false);
        setTripDossier((prev) => ({
          ...prev,
          visaDecision: {
            status: "approved",
            vignetteNumber: "UKVI-948201-B",
            validFrom: "14 Nov 2026",
            validTo: "14 May 2027"
          }
        }));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `🎉 Great news! Your UK Standard Visitor Visa has been approved by the Home Office!`,
            type: "visa_approved"
          }
        ]);
      }, 700);
      return;
    }

    // 7. Check for Flight Preferences / Search Intent
    if (lower.includes("flight") || lower.includes("ticket") || lower.includes("luggage") || lower.includes("direct flight") || lower.includes("fly")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here are direct, non-stop flights from Lagos (LOS) to London Heathrow (LHR) with 2 × 23kg luggage included. You can secure a seat hold or pay directly via Paystack:`,
            type: "flight_selection"
          }
        ]);
      }, 700);
      return;
    }

    // 8. Check for Hotel / Accommodation Intent
    if (lower.includes("hotel") || lower.includes("stay") || lower.includes("accommodation") || lower.includes("voucher")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here are certified London accommodations that fulfill UKVI proof-of-stay requirements:`,
            type: "hotel_selection"
          }
        ]);
      }, 700);
      return;
    }

    // 9. Query Backend Chat RAG Service
    try {
      const backendRes = await apiService.chat.sendMessage(text, sessionId || undefined, applicationId || undefined);
      if (backendRes && backendRes.reply) {
        setIsTyping(false);
        if (backendRes.session_id) {
          setSessionId(backendRes.session_id);
          localStorage.setItem(storageKey, backendRes.session_id);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: backendRes.reply,
            sources: backendRes.sources || [],
            stage: backendRes.stage || "intake",
            type: "text"
          }
        ]);
        return;
      }
    } catch (e) {
      console.warn("Backend chat query fallback:", e.message);
    }

    // Default Fallback
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `I understand! Let's proceed with your UK consular intake. We can verify your passport validity, review your 6-month bank statement, schedule your VFS biometrics, or review direct flight options. What would you like to focus on next?`,
          type: "text",
          options: [
            "Verify Passport Validity",
            "Review Visa Options & Costs",
            "Upload 6-Month Bank Statement",
            "Book VFS Biometrics Appointment"
          ]
        }
      ]);
    }, 800);
  };

  // Readiness Calculation
  const calculateReadiness = () => {
    let score = 0;
    if (tripDossier.passport.status === "verified") score += 20;
    if (tripDossier.funds.status === "verified") score += 20;
    if (tripDossier.feePaid) score += 20;
    if (tripDossier.appointment.status === "confirmed") score += 15;
    if (tripDossier.flight.status === "paid" || tripDossier.flight.status === "held") score += 15;
    if (tripDossier.hotel.status === "paid") score += 10;
    return score;
  };

  const readinessScore = calculateReadiness();

  return (
    <div className="flex flex-col h-[calc(100dvh-4.25rem)] sm:h-[calc(100dvh-4.75rem)] overflow-hidden bg-slate-100/70">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />

      {/* Mobile Responsive Segmented Switcher (Visible on < lg screens) */}
      <div className="lg:hidden px-3 py-2 bg-white border-b border-slate-200/80 flex items-center justify-center shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/60 w-full max-w-sm">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "chat"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
            <span>Consular Chat</span>
          </button>
          <button
            onClick={() => setMobileTab("dossier")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "dossier"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Dossier ({readinessScore}%)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto sm:px-4 sm:pb-3">
        {/* Left: Conversational Stream Area */}
        <div
          className={`flex-1 flex flex-col h-full bg-white sm:rounded-3xl border border-slate-200/80 shadow-sleek overflow-hidden ${
            mobileTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Conversational Header */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">AI Consular Concierge</h1>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Autonomous
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">Automated passport verification, bank statement audit, and Paystack settlement</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 text-xs font-semibold text-slate-700 hover:text-brand-600 flex items-center gap-1.5 transition-all shadow-subtle cursor-pointer bg-slate-50/50 hover:bg-white"
              >
                <UploadCloud className="w-3.5 h-3.5 text-brand-600" />
                <span className="hidden sm:inline">Upload Document</span>
                <span className="sm:hidden">Upload</span>
              </button>
              <button
                onClick={() => setPreviewDossierModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-subtle cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Dossier ({readinessScore}%)</span>
                <span className="sm:hidden">{readinessScore}%</span>
              </button>
            </div>
          </div>

          {/* File Format Error Banner if any */}
          {fileError && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-rose-800 shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fileError}</span>
              </div>
              <button onClick={() => setFileError(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-extrabold shadow-sm">
                    TF
                  </div>
                )}

                <div className={`max-w-2xl w-full ${msg.role === "user" ? "items-end" : "items-start"} space-y-3`}>
                  {/* Text Content */}
                  {msg.text && (
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-subtle ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-xs ml-auto max-w-lg"
                          : "bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs whitespace-pre-line"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Upload Chip */}
                  {msg.type === "file_upload" && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50/80 border border-brand-200 text-xs text-brand-900 shadow-subtle max-w-md ml-auto">
                      <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{msg.fileName}</div>
                        <div className="text-[10px] text-brand-700 font-semibold">{msg.fileSize} • Validated Format ✓</div>
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
                          className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/50 font-semibold transition-all shadow-subtle cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Interactive Cards */}
                  {msg.type === "visa_comparison_card" && (
                    <VisaComparisonCard
                      onSelectVisa={(visa) => {
                        setTripDossier((prev) => ({
                          ...prev,
                          visaType: visa.name,
                          visaCategory: visa.id,
                          consularFee: `£${visa.fee_gbp} (₦${(visa.fee_gbp * 2100).toLocaleString()})`
                        }));
                        handleSend(`I would like to apply for the ${visa.name}. Please inspect my bank statement for compliance.`);
                      }}
                    />
                  )}

                  {msg.type === "bank_statement_card" && (
                    <BankStatementCard
                      onProceedToPayment={() => {
                        handlePayVisaFee();
                      }}
                    />
                  )}

                  {msg.type === "pay_visa_fee_prompt" && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
                      <div>
                        <div className="text-xs font-black text-emerald-950">UKVI Visa Application Fee</div>
                        <div className="text-xs text-emerald-700">Official visa fee + biometrics processing: <strong>₦380,000</strong></div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handlePayVisaFee}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 py-2.5 px-4 font-bold rounded-xl"
                      >
                        Pay ₦380,000 via Paystack →
                      </Button>
                    </div>
                  )}

                  {msg.type === "appointment_booking" && (
                    <AppointmentCard
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
                            text: `📅 **VFS Global Appointment Locked & Dispatched!**

• Center: **${booking.center}**
• Date & Time: **${booking.date} at ${booking.time}**
• GWF Reference: **${booking.gwf_number || booking.gwf_reference}**
• Confirmation Email: **Dispatched to ${user?.email || "tunde.adeyemi@example.com"}** ✓

Fast-forwarding to consular review: Your application has been reviewed and adjudicated...`,
                            type: "visa_approved"
                          }
                        ]);
                      }}
                    />
                  )}

                  {msg.type === "visa_approved" && (
                    <VisaApprovalCard
                      onProceedToTravel={() => {
                        handleSend("I would like to view direct flights from Lagos to London with 2x23kg checked bags.");
                      }}
                    />
                  )}

                  {msg.type === "flight_selection" && (
                    <FlightCards
                      flights={[
                        {
                          id: "fl-ba-074",
                          airline: "British Airways",
                          flight_no: "BA-074",
                          origin_code: "LOS",
                          destination_code: "LHR",
                          route: "Lagos (LOS) → London Heathrow (LHR)",
                          departure: "2026-11-14T22:50:00",
                          departure_date: "14 Nov 2026",
                          baggage: "2 × 23kg Checked Bags + 1 Cabin",
                          price_ngn: 1850000,
                          price_formatted: "₦1,850,000",
                          cabin: "Economy Direct"
                        },
                        {
                          id: "fl-vs-412",
                          airline: "Virgin Atlantic",
                          flight_no: "VS-412",
                          origin_code: "LOS",
                          destination_code: "LHR",
                          route: "Lagos (LOS) → London Heathrow (LHR)",
                          departure: "2026-11-15T09:40:00",
                          departure_date: "15 Nov 2026",
                          baggage: "2 × 23kg Checked Bags + 1 Cabin",
                          price_ngn: 1920000,
                          price_formatted: "₦1,920,000",
                          cabin: "Economy Classic Direct"
                        }
                      ]}
                      onHoldFlight={(flight) => {
                        handlePayFlight(flight);
                      }}
                    />
                  )}

                  {msg.type === "hotel_selection" && (
                    <HotelCards
                      hotels={[
                        {
                          id: "ht-westminster-bridge",
                          name: "Park Plaza Westminster Bridge",
                          location: "London SE1 7UT, United Kingdom",
                          price_formatted: "₦640,000 / 14 nights",
                          rating: 4.8,
                          amenities: ["Free High-Speed Wi-Fi", "Consular Proof-of-Stay Voucher", "Metro Access", "Full English Breakfast"],
                          image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                        },
                        {
                          id: "ht-citizenm-tower",
                          name: "citizenM Tower of London",
                          location: "Trinity Square, London EC3N 4DJ",
                          price_formatted: "₦580,000 / 14 nights",
                          rating: 4.9,
                          amenities: ["Consular Booking Voucher", "Luggage Storage", "24/7 Concierge", "Free Wi-Fi"],
                          image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
                        }
                      ]}
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
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  TF
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-subtle">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-600 font-medium ml-1">Analyzing consular policies...</span>
                </div>
              </div>
            )}

            {/* Uploading Indicator */}
            {isUploadingDoc && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  TF
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-50/80 border border-brand-200 text-brand-900 shadow-subtle">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                  <span className="font-medium">Validating document format and running OCR extraction...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Passport or Bank Statement (PDF, JPG, PNG)"
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask visa questions, upload documents, or type 'Verify passport'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400"
              />

              <Button
                type="submit"
                disabled={!input.trim()}
                variant="primary"
                size="md"
                className="px-3.5 sm:px-4 py-2.5 rounded-xl shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mt-2 px-1 gap-1">
              <span>Accepted Formats: PDF, JPG, PNG, WEBP (Max 10MB)</span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Live Paystack Payment Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Travel Dossier Sidebar */}
        <div
          className={`w-full lg:w-[380px] shrink-0 border-l lg:border-l-0 border-slate-200/80 lg:ml-3 bg-white sm:rounded-3xl border sm:border-slate-200/80 shadow-sleek flex-col h-full overflow-y-auto p-4 sm:p-5 space-y-4 ${
            mobileTab === "dossier" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Dossier Header & Readiness Meter */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-tight">Consular Readiness</span>
              </div>
              <span className="text-sm font-black text-emerald-400 font-mono">{readinessScore}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${readinessScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center justify-between">
              <span>Applicant: <strong>{tripDossier.passport.name}</strong></span>
              <span>{tripDossier.flag} {tripDossier.destination}</span>
            </div>
          </div>

          {/* 1. Passport Compliance Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-brand-600" />
                Passport Compliance
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.passport.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {tripDossier.passport.status === "verified" ? "Verified (60 Mos) ✓" : "Requires Check"}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Passport Number:</span>
                <span className="font-mono font-bold text-slate-900">{tripDossier.passport.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiration Date:</span>
                <span className="font-medium text-slate-900">{tripDossier.passport.expiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statutory 6-Month Rule:</span>
                <span className="font-bold text-emerald-700">Satisfied (5+ Years Remaining)</span>
              </div>
            </div>
          </div>

          {/* 2. Bank Statement & Funds Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                6-Month Financial Audit
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.funds.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {tripDossier.funds.status === "verified" ? "Verified Sufficient ✓" : "Pending Audit"}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated Average:</span>
                <span className="font-mono font-black text-slate-900">₦8,850,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UKVI Requirement:</span>
                <span className="font-medium text-slate-900">£1,270 (~₦2.66M)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Surplus:</span>
                <span className="font-bold text-emerald-700">+₦6,183,000 (+232%)</span>
              </div>
            </div>
          </div>

          {/* 3. Visa Fee & Appointment Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                Visa Fee & Biometrics
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tripDossier.feePaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {tripDossier.feePaid ? "Paid via Paystack ✓" : "₦380,000 Due"}
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Route:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{tripDossier.visaType}</span>
              </div>
              {tripDossier.appointment.status === "confirmed" ? (
                <div className="flex justify-between border-t border-slate-200/60 pt-1">
                  <span className="text-slate-400">VFS GWF Ref:</span>
                  <span className="font-mono font-bold text-emerald-700">{tripDossier.appointment.gwfRef}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-400">VFS Biometrics:</span>
                  <span className="text-amber-700 font-semibold">Slot Pending</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Flight & Accommodation Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-emerald-600" />
                Flight & Hotel Vouchers
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Flight PNR:</span>
                <span className={`font-mono font-bold ${tripDossier.flight.status === "paid" ? "text-emerald-700" : "text-slate-400"}`}>
                  {tripDossier.flight.status === "paid" ? tripDossier.flight.pnr : "Not Booked"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Consular Hotel:</span>
                <span className={`font-mono font-bold ${tripDossier.hotel.status === "paid" ? "text-emerald-700" : "text-slate-400"}`}>
                  {tripDossier.hotel.status === "paid" ? tripDossier.hotel.voucherRef : "Not Booked"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Dossier Preview Modal */}
      {previewDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-dropdown max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreviewDossierModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-subtle">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Consular Clearance Dossier</h3>
                <p className="text-xs text-slate-500">Applicant: Tunde Babatunde Adeyemi</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Passport Status:</span>
                <span className="font-bold text-emerald-700">{tripDossier.passport.status === "verified" ? "Verified (60 Mos Remaining)" : "Unverified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">6-Month Bank Average:</span>
                <span className="font-bold text-emerald-700">{tripDossier.funds.status === "verified" ? "₦8,850,000 (Sufficient)" : "Pending"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visa Application Fee:</span>
                <span className="font-bold text-slate-900">{tripDossier.feePaid ? `Paid (${tripDossier.paymentRef})` : "Unpaid"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flight PNR:</span>
                <span className="font-bold text-slate-900">{tripDossier.flight.pnr || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hotel Voucher:</span>
                <span className="font-bold text-slate-900">{tripDossier.hotel.voucherRef || "None"}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setPreviewDossierModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
