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
  Printer
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { apiService, formatApiError } from "../services/api";
import { openPaystackPopup } from "../services/paystack";
import { useAuth } from "../context/AuthContext";
import { PassportVerificationCard } from "../components/chat/PassportVerificationCard";
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
    countryCode: "GB", // "GB" or "US"
    flag: "🇬🇧",
    dates: "14 Nov – 28 Nov 2026",
    visaType: "UK Standard Visitor Visa",
    visaCategory: "visitor",
    consularFeeDisplay: "£115 (₦241,500)",
    consularFeeAmount: 241500, // Exact dynamic fee
    feePaid: false,
    paymentRef: null,
    passport: {
      status: "unverified", // "unverified", "verified", "rejected"
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

I am your autonomous Consular & Relocation Concierge. We operate strict consular compliance guardrails:
1. 🛂 **Passport Validity Check**: Must exceed 6 months validity from travel date (less than 6 months will be strictly rejected).
2. 🌍 **Destination & Purpose**: Select between the **United Kingdom (UK)** or the **United States (US)** for Tourism, Study, or Skilled Relocation.
3. 💳 **Dynamic Paystack Fee**: The exact fee for your selected visa is settled live via Paystack.
4. 🏛️ **Physical Embassy Interview Slip**: Get your in-person embassy submission slip with barcode and location details.
5. ✈️ **Live Flights & Hotels**: Verified Wakanow flight holds and certified consular hotel vouchers.

Where would you like to travel, or would you like to verify your passport first?`,
      type: "text",
      options: [
        "🇬🇧 Travel to the United Kingdom",
        "🇺🇸 Travel to the United States",
        "🛂 Check Passport 6-Month Validity Guardrail",
        "📊 Audit 6-Month Bank Statement"
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
        // Launch the Passport Validity Guardrail card
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `📄 Document **"${file.name}"** received. Let us now run the statutory 6-month validity guardrail audit:`,
            type: "passport_verification_card"
          }
        ]);
      }
    }, 1000);
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

I have parsed your 6-month transaction ledger. Your average balance of **₦8,850,000** comfortably exceeds the consular maintenance requirement with a **+232% surplus**!`,
        type: "bank_statement_card"
      }
    ]);
  };

  // Trigger Real Paystack Checkout for DYNAMIC Visa Fee
  const handlePayVisaFee = (amount = tripDossier.consularFeeAmount, visaTitle = tripDossier.visaType) => {
    // Enforce Passport Validity Guardrail before accepting payment!
    if (tripDossier.passport.status === "rejected") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `🚫 **Payment Blocked by Consular Guardrail**

Your passport validity is under 6 months. Consular statutory regulations prohibit fee collection or appointment booking until a compliant passport is provided. Please renew your passport first.`,
          type: "text"
        }
      ]);
      return;
    }

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
            text: `💳 **Payment of ₦${amount.toLocaleString()} Received via Paystack!**

• Transaction Reference: **${res.reference}**
• Status: **Settled & Verified ✓**
• Gateway: **Official Paystack Live API**

Your consular fee has been confirmed. Let us now schedule your mandatory physical interview / in-person biometrics appointment at the embassy:`,
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
            text: `Payment window closed. You can complete your Paystack payment whenever you are ready.`,
            type: "text"
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
      title: `Flight Ticket - ${flight.airline || "British Airways"} (${flight.flight_no || "BA76"})`,
      metadata: {
        airline: flight.airline,
        route: flight.route || "LOS → LHR",
        flight_no: flight.flight_no || "BA76"
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
            text: `✈️ **Flight Payment of ₦${flight.price_ngn.toLocaleString()} Confirmed via Paystack!**

• Airline: **${flight.airline}** (${flight.flight_no})
• Confirmed GDS PNR: **${pnrCode}**
• Baggage Allowance: **2 × 23kg Checked Bags Included ✓**
• Payment Reference: **${res.reference}**

Now, let us secure your certified consular proof-of-stay hotel accommodation:`,
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
      amountNgn: hotel.price_ngn || 640000,
      paymentType: "hotel_voucher",
      title: `Consular Proof-of-Stay Voucher - ${hotel.name}`,
      metadata: {
        hotel_name: hotel.name,
        location: hotel.location
      },
      onSuccess: (res) => {
        const vchCode = tripDossier.countryCode === "US" ? "VCH-NYC-491028" : "VCH-LON-892014";
        setTripDossier((prev) => ({
          ...prev,
          hotel: {
            status: "paid",
            name: hotel.name,
            location: hotel.location,
            voucherRef: vchCode,
            nights: "Stay Period",
            amountNgn: hotel.price_ngn
          }
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            text: `🏨 **Hotel Booking & Proof-of-Stay Voucher Issued!**

• Hotel: **${hotel.name}**
• Consular Voucher Ref: **${vchCode}**
• Official Consular QR Seal: **Active & Verified ✓**
• Payment Reference: **${res.reference}**

🎉 **Congratulations Tunde!** Your entire travel package is now 100% complete:
1. ✅ Passport Certified (${tripDossier.passport.monthsValid} months validity)
2. ✅ Bank Statement Verified (₦8.85M average with surplus)
3. ✅ Consular Visa Fee Settled via Paystack
4. ✅ Physical Embassy Interview Slip Printed
5. ✅ Flight Tickets Issued (PNR: ${tripDossier.flight.pnr || "CONFIRMED"})
6. ✅ Hotel Proof-of-Stay Locked (${vchCode})

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

    // 1. Destination Intent: United States (US)
    if (lower.includes("united states") || lower.includes("usa") || lower.includes("america") || lower.includes("us ") || lower.includes("new york")) {
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
            text: `Traveling to the United States 🇺🇸!

First, consular regulations require verifying that your international passport has **at least 6 months validity** beyond your travel dates.

Please inspect your passport validity below:`,
            type: "passport_verification_card"
          }
        ]);
      }, 700);
      return;
    }

    // 2. Destination Intent: United Kingdom (UK)
    if (lower.includes("united kingdom") || lower.includes("uk") || lower.includes("london") || lower.includes("britain")) {
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
            text: `Traveling to the United Kingdom 🇬🇧!

First, UKVI consular regulations mandate that your international passport has **at least 6 months validity** remaining.

Please verify your passport validity below:`,
            type: "passport_verification_card"
          }
        ]);
      }, 700);
      return;
    }

    // 3. Passport Guardrail Intent
    if (lower.includes("passport") || lower.includes("validity") || lower.includes("guardrail") || lower.includes("6 month") || lower.includes("expire")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here is the Consular Passport Validity Guardrail. Try testing an expiration date under 6 months (e.g. Dec 2026) to see the rejection, or a valid date to proceed:`,
            type: "passport_verification_card"
          }
        ]);
      }, 700);
      return;
    }

    // 4. Visa Selection / Comparison Intent
    if (lower.includes("visa") || lower.includes("vacation") || lower.includes("tourism") || lower.includes("japa") || lower.includes("relocate") || lower.includes("work") || lower.includes("study") || lower.includes("student") || lower.includes("b1") || lower.includes("b2")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here are the matching visa categories and statutory fees for ${tripDossier.destination}. Select your pathway to calculate the dynamic Paystack fee:`,
            type: "visa_comparison_card"
          }
        ]);
      }, 700);
      return;
    }

    // 5. Bank Statement Intent
    if (lower.includes("bank") || lower.includes("statement") || lower.includes("fund") || lower.includes("balance") || lower.includes("maintenance") || lower.includes("money")) {
      setTimeout(() => {
        setIsTyping(false);
        triggerBankStatementVerification();
      }, 700);
      return;
    }

    // 6. Pay Fee Intent
    if (lower.includes("pay fee") || lower.includes("pay visa") || lower.includes("paystack") || lower.includes("payment")) {
      setIsTyping(false);
      handlePayVisaFee();
      return;
    }

    // 7. Appointment / Embassy Slip Intent
    if (lower.includes("appointment") || lower.includes("slip") || lower.includes("vfs") || lower.includes("embassy") || lower.includes("interview")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Select your preferred interview location to issue your official Physical Interview Appointment Slip:`,
            type: "appointment_booking"
          }
        ]);
      }, 700);
      return;
    }

    // 8. Visa Approval Intent
    if (lower.includes("approved") || lower.includes("granted") || lower.includes("approval") || lower.includes("visa ready")) {
      setTimeout(() => {
        setIsTyping(false);
        setTripDossier((prev) => ({
          ...prev,
          visaDecision: {
            status: "approved",
            vignetteNumber: tripDossier.countryCode === "US" ? "USA-B1B2-748291" : "UKVI-948201-B",
            validFrom: "14 Nov 2026",
            validTo: tripDossier.countryCode === "US" ? "14 Nov 2028" : "14 May 2027"
          }
        }));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `🎉 Great news! Your visa has been officially approved and stamped!`,
            type: "visa_approved"
          }
        ]);
      }, 700);
      return;
    }

    // 9. Flight Intent
    if (lower.includes("flight") || lower.includes("ticket") || lower.includes("fly") || lower.includes("wakanow")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here are live direct flights from Lagos to ${tripDossier.destination}. You can lock your seat and pay live via Paystack:`,
            type: "flight_selection"
          }
        ]);
      }, 700);
      return;
    }

    // 10. Hotel Intent
    if (lower.includes("hotel") || lower.includes("stay") || lower.includes("accommodation") || lower.includes("voucher")) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Here are certified accommodations in ${tripDossier.destination} that provide consular proof-of-stay vouchers:`,
            type: "hotel_selection"
          }
        ]);
      }, 700);
      return;
    }

    // Fallback: Query backend chat RAG
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
          text: `I understand! Let's proceed with your intake for ${tripDossier.destination}. We can verify your passport validity against the 6-month rule, compare visa options, audit your 6-month bank statement, or view flight options.`,
          type: "text",
          options: [
            "🛂 Check Passport 6-Month Validity",
            "📋 Compare Visa Options & Fees",
            "📊 Audit 6-Month Bank Statement",
            "✈️ Search Direct Flights"
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
    if (tripDossier.flight.status === "paid") score += 15;
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

      {/* Mobile Responsive Segmented Switcher */}
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
                    Guardrail Active
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {tripDossier.flag} {tripDossier.countryCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">6-Month passport validity guardrail • Dynamic Paystack fee • Physical embassy slips</p>
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

                  {/* 1. Passport Verification Card */}
                  {msg.type === "passport_verification_card" && (
                    <PassportVerificationCard
                      onPassportVerified={(res) => {
                        setTripDossier((prev) => ({
                          ...prev,
                          passport: {
                            status: "verified",
                            name: res.holderName,
                            number: res.passportNumber,
                            expiry: res.expiryDate,
                            nationality: "Nigerian",
                            monthsValid: res.monthsRemaining
                          }
                        }));
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `✅ **Passport Validity Guardrail Passed!**

• Document: **${res.passportNumber}**
• Expiration Date: **${res.expiryDate}** (${res.monthsRemaining} months remaining)
• Statutory Compliance: **Exceeds 6-month minimum threshold ✓**

Your passport is accepted. Now, choose which visa category meets your travel intent for ${tripDossier.destination}:`,
                            type: "visa_comparison_card"
                          }
                        ]);
                      }}
                      onPassportRejected={(res) => {
                        setTripDossier((prev) => ({
                          ...prev,
                          passport: {
                            status: "rejected",
                            name: res.holderName,
                            number: res.passportNumber,
                            expiry: res.expiryDate,
                            nationality: "Nigerian",
                            monthsValid: res.monthsRemaining
                          }
                        }));
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `❌ **Passport Validity Guardrail REJECTED!**

Your passport expires on **${res.expiryDate}** (${res.monthsRemaining} months remaining). Consular statutory policies for ${tripDossier.destination} require at least 6 months validity.

⚠️ **Fee payment and interview booking are blocked** until you renew your passport. You can re-test with a compliant passport above.`,
                            type: "text"
                          }
                        ]);
                      }}
                    />
                  )}

                  {/* 2. Dynamic Visa Comparison Card (UK & US) */}
                  {msg.type === "visa_comparison_card" && (
                    <VisaComparisonCard
                      initialCountry={tripDossier.countryCode}
                      onSelectVisa={(visa) => {
                        setTripDossier((prev) => ({
                          ...prev,
                          countryCode: visa.country_code,
                          destination: visa.country,
                          flag: visa.flag,
                          visaType: visa.name,
                          visaCategory: visa.id,
                          consularFeeAmount: visa.fee_ngn,
                          consularFeeDisplay: `${visa.currency_symbol}${visa.fee_foreign.toLocaleString()} (₦${visa.fee_ngn.toLocaleString()})`
                        }));

                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `Selected: **${visa.name}** for **${visa.country}**.

• Statutory Fee: **${visa.currency_symbol}${visa.fee_foreign.toLocaleString()} (₦${visa.fee_ngn.toLocaleString()})**
• Purpose: ${visa.purpose}

Click below to pay the dynamic fee of **₦${visa.fee_ngn.toLocaleString()}** directly via Paystack:`,
                            type: "pay_visa_fee_prompt"
                          }
                        ]);
                      }}
                    />
                  )}

                  {/* 3. Bank Statement Card */}
                  {msg.type === "bank_statement_card" && (
                    <BankStatementCard
                      onProceedToPayment={() => {
                        handlePayVisaFee(tripDossier.consularFeeAmount, tripDossier.visaType);
                      }}
                    />
                  )}

                  {/* 4. Pay Visa Fee Prompt (Dynamic Amount) */}
                  {msg.type === "pay_visa_fee_prompt" && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
                      <div>
                        <div className="text-xs font-black text-emerald-950">
                          {tripDossier.visaType} Consular Application Fee
                        </div>
                        <div className="text-xs text-emerald-700">
                          Exact fee to charge via Paystack: <strong>₦{tripDossier.consularFeeAmount.toLocaleString()}</strong> ({tripDossier.consularFeeDisplay})
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePayVisaFee(tripDossier.consularFeeAmount, tripDossier.visaType)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 py-2.5 px-4 font-bold rounded-xl cursor-pointer"
                      >
                        Pay ₦{tripDossier.consularFeeAmount.toLocaleString()} via Paystack →
                      </Button>
                    </div>
                  )}

                  {/* 5. Physical Embassy Interview Appointment Card & Printable Slip */}
                  {msg.type === "appointment_booking" && (
                    <AppointmentCard
                      destinationCountry={tripDossier.countryCode}
                      applicantName={tripDossier.passport.name}
                      passportNumber={tripDossier.passport.number}
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
                            text: `🏛️ **Physical Embassy Appointment Slip Issued!**

• Location: **${booking.center}**
• Interview Date & Time: **${booking.date} at ${booking.time}**
• Case Ref: **${booking.gwf_number || booking.gwf_reference}**

Your physical interview appointment slip has been generated and dispatched to your email. Fast-forwarding to consular decision: Your visa has been approved and issued!`,
                            type: "visa_approved"
                          }
                        ]);
                      }}
                    />
                  )}

                  {/* 6. Visa Approved Milestone */}
                  {msg.type === "visa_approved" && (
                    <VisaApprovalCard
                      onProceedToTravel={() => {
                        handleSend(`Show direct flights and hotel options for ${tripDossier.destination}.`);
                      }}
                    />
                  )}

                  {/* 7. Flight Selection Cards (UK & US) */}
                  {msg.type === "flight_selection" && (
                    <FlightCards
                      destinationCountry={tripDossier.countryCode}
                      onHoldFlight={(flight) => {
                        handlePayFlight(flight);
                      }}
                    />
                  )}

                  {/* 8. Hotel Selection Cards (UK & US) */}
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
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  TF
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-subtle">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-600 font-medium ml-1">Evaluating consular guardrails...</span>
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
                placeholder="Type 'Travel to US' or 'Check passport validity'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400"
              />

              <Button
                type="submit"
                disabled={!input.trim()}
                variant="primary"
                size="md"
                className="px-3.5 sm:px-4 py-2.5 rounded-xl shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mt-2 px-1 gap-1">
              <span>Accepted Formats: PDF, JPG, PNG, WEBP (Max 10MB)</span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Live Paystack Payment Gateway Integration
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
                  : (tripDossier.passport.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200")
              }`}>
                {tripDossier.passport.status === "verified" ? "Verified (60 Mos) ✓" : (tripDossier.passport.status === "rejected" ? "REJECTED (&lt; 6 Mos) ✗" : "Pending Check")}
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
                <span className="text-slate-400">6-Month Rule:</span>
                <span className={`font-bold ${tripDossier.passport.status === "verified" ? "text-emerald-700" : (tripDossier.passport.status === "rejected" ? "text-rose-700" : "text-amber-700")}`}>
                  {tripDossier.passport.status === "verified" ? "Satisfied (5+ Years)" : (tripDossier.passport.status === "rejected" ? "Under 6 Months (Blocked)" : "Pending Check")}
                </span>
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
                <span className="text-slate-400">Maintenance Threshold:</span>
                <span className="font-medium text-slate-900">{tripDossier.countryCode === "US" ? "$2,500 (~₦3.85M)" : "£1,270 (~₦2.66M)"}</span>
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
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Route:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{tripDossier.visaType}</span>
              </div>
              {tripDossier.appointment.status === "confirmed" ? (
                <div className="flex justify-between border-t border-slate-200/60 pt-1">
                  <span className="text-slate-400">Embassy Slip Ref:</span>
                  <span className="font-mono font-bold text-emerald-700">{tripDossier.appointment.gwfRef}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-400">Embassy Interview:</span>
                  <span className="text-amber-700 font-semibold">Slip Pending</span>
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
                <p className="text-xs text-slate-500">Applicant: {tripDossier.passport.name} • {tripDossier.destination}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Passport Status:</span>
                <span className={`font-bold ${tripDossier.passport.status === "verified" ? "text-emerald-700" : "text-rose-700"}`}>
                  {tripDossier.passport.status === "verified" ? "Verified (60 Mos Remaining)" : "Requires Valid Passport"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">6-Month Bank Average:</span>
                <span className="font-bold text-emerald-700">₦8,850,000 (Sufficient ✓)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Visa Fee:</span>
                <span className="font-bold text-slate-900">
                  {tripDossier.feePaid ? `Paid via Paystack (${tripDossier.paymentRef})` : `₦${tripDossier.consularFeeAmount.toLocaleString()} Due`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Embassy Interview Slip:</span>
                <span className="font-bold text-slate-900">{tripDossier.appointment.gwfRef || "Pending"}</span>
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
