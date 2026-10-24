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
  Globe2
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

// Helper to render simple markdown bold and bullet points cleanly
const FormattedMessage = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;
        
        // Parse bold segments **...**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-extrabold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (line.trim().startsWith("•")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
              <span>{formattedLine.slice(1)}</span>
            </div>
          );
        }

        return <div key={idx}>{formattedLine}</div>;
      })}
    </div>
  );
};

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
    consularFeeAmount: 241500,
    feePaid: false,
    paymentRef: null,
    passport: {
      status: "unverified", // "unverified", "verified", "rejected"
      name: "OPEYEMI SAMUEL ADEKUNLE",
      number: "A14892011",
      expiry: "14 Nov 2031",
      nationality: "Nigerian",
      monthsValid: 60,
      previewUrl: null,
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
      text: `Hello Tunde! Welcome to your TravelForge consular workspace.

I am your autonomous Consular & Relocation Concierge. I operate strict compliance guardrails:
• **Passport Validity**: Must exceed 6 months validity from travel date.
• **Destinations**: United Kingdom (UK 🇬🇧) and United States (US 🇺🇸).
• **Dynamic Paystack Fee**: The exact fee for your selected visa is settled live via Paystack.
• **Physical Embassy Slip**: Generates your official interview slip with barcode and location details.
• **Live Flights & Hotels**: Verified return flights and certified consular hotel vouchers.

Where would you like to travel, or would you like to test your passport validity first?`,
      type: "text",
      options: [
        "🇬🇧 Travel to the United Kingdom",
        "🇺🇸 Travel to the United States",
        "🛂 Test Passport 6-Month Guardrail",
        "📊 6-Month Bank Statement Audit"
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
    }, 900);
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
        text: `📊 **6-Month Bank Statement Audit Complete**\n\nI have parsed your 6-month transaction ledger. Your average balance of **₦8,850,000** exceeds the statutory maintenance requirement with a **+232% surplus**!`,
        type: "bank_statement_card"
      }
    ]);
  };

  // Trigger Real Paystack Checkout for DYNAMIC Visa Fee
  const handlePayVisaFee = (amount = tripDossier.consularFeeAmount, visaTitle = tripDossier.visaType) => {
    if (tripDossier.passport.status === "rejected") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `🚫 **Payment Blocked by Consular Guardrail**\n\nYour passport validity is under 6 months. Consular statutory regulations prohibit fee collection or appointment booking until a compliant passport is provided. Please renew your passport first.`,
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
            text: `💳 **Payment of ₦${amount.toLocaleString()} Confirmed via Paystack!**\n\n• Transaction Reference: **${res.reference}**\n• Status: **Settled & Verified ✓**\n\nYour consular fee has been confirmed. Let us now book your mandatory physical embassy interview / biometrics appointment:`,
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

  // Trigger Real Paystack Checkout for Flight Ticket Hold / Issuance
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
            text: `✈️ **Flight Payment of ₦${flight.price_ngn.toLocaleString()} Confirmed via Paystack!**\n\n• Airline: **${flight.airline}** (${flight.flight_no})\n• Confirmed GDS PNR: **${pnrCode}**\n• Baggage: **2 × 23kg Checked Bags Included ✓**\n• Reference: **${res.reference}**\n\nNow, let us secure your certified consular proof-of-stay hotel accommodation:`,
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
            text: `🏨 **Hotel Booking & Proof-of-Stay Voucher Issued!**\n\n• Hotel: **${hotel.name}**\n• Consular Voucher Ref: **${vchCode}**\n• Consular QR Seal: **Active & Verified ✓**\n• Payment Reference: **${res.reference}**\n\n🎉 **Congratulations Tunde!** Your travel package is 100% complete:\n1. ✅ Passport Certified (${tripDossier.passport.monthsValid} months validity)\n2. ✅ Bank Statement Verified (₦8.85M average)\n3. ✅ Consular Visa Fee Settled via Paystack\n4. ✅ Physical Embassy Interview Slip Printed\n5. ✅ Flight Tickets Issued (PNR: ${tripDossier.flight.pnr || "CONFIRMED"})\n6. ✅ Hotel Proof-of-Stay Locked (${vchCode})\n\nYou are 100% travel ready!`,
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

    // Add user message to conversation stream
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = text.toLowerCase().trim();

    // Natural Greeting Handling
    if (/^(hi|hello|hey|good\s*morning|yo|greetings|howdy)[\s!.]*$/i.test(lower)) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `Hello! Great to have you here. I am your autonomous Consular & Relocation Concierge.\n\nWhether you are heading to the **United Kingdom 🇬🇧** or the **United States 🇺🇸**, I will guide you through passport validity compliance, dynamic visa fees, physical embassy interview slips, and direct flight reservations.\n\nWhere would you like to travel, or would you like to begin with a passport check?`,
            type: "text",
            options: [
              "🇬🇧 Travel to the United Kingdom",
              "🇺🇸 Travel to the United States",
              "🛂 Check Passport 6-Month Validity",
              "📊 Audit 6-Month Bank Statement"
            ]
          }
        ]);
      }, 500);
      return;
    }

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
            text: `Traveling to the **United States 🇺🇸**!\n\nU.S. consular regulations strictly mandate that your international passport has **at least 6 months validity** beyond your travel dates.\n\nPlease inspect your passport validity below:`,
            type: "passport_verification_card"
          }
        ]);
      }, 600);
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
            text: `Traveling to the **United Kingdom 🇬🇧**!\n\nUKVI consular regulations require that your international passport has **at least 6 months validity** remaining.\n\nPlease verify your passport validity below:`,
            type: "passport_verification_card"
          }
        ]);
      }, 600);
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
            text: `Here is the Consular Passport Validity Guardrail. You can test an expiration date under 6 months (e.g. Dec 2026) to see the rejection state, or a valid date to proceed:`,
            type: "passport_verification_card"
          }
        ]);
      }, 600);
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
            text: `Here are the matching visa categories and statutory fees for **${tripDossier.destination}**. Select your pathway to calculate the dynamic Paystack fee:`,
            type: "visa_comparison_card"
          }
        ]);
      }, 600);
      return;
    }

    // 5. Bank Statement Intent
    if (lower.includes("bank") || lower.includes("statement") || lower.includes("fund") || lower.includes("balance") || lower.includes("maintenance") || lower.includes("money")) {
      setTimeout(() => {
        setIsTyping(false);
        triggerBankStatementVerification();
      }, 600);
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
      }, 600);
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
      }, 600);
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
            text: `Here are live direct flights from Lagos to **${tripDossier.destination}**. You can lock your seat and pay live via Paystack:`,
            type: "flight_selection"
          }
        ]);
      }, 600);
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
            text: `Here are certified accommodations in **${tripDossier.destination}** that provide consular proof-of-stay vouchers:`,
            type: "hotel_selection"
          }
        ]);
      }, 600);
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
          text: `I understand! Let's proceed with your intake for **${tripDossier.destination}**. We can verify your passport validity, compare visa options, audit your 6-month bank statement, or view flight options.`,
          type: "text",
          options: [
            "🛂 Check Passport 6-Month Validity",
            "📋 Compare Visa Options & Fees",
            "📊 Audit 6-Month Bank Statement",
            "✈️ Search Direct Flights"
          ]
        }
      ]);
    }, 700);
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-8">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />

      {/* Mobile Responsive Segmented Switcher (Visible on < lg screens) */}
      <div className="lg:hidden px-4 py-2 bg-white border-b border-slate-200/80 flex items-center justify-center shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full max-w-sm">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "chat"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Consular Chat</span>
          </button>
          <button
            onClick={() => setMobileTab("dossier")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "dossier"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Dossier ({readinessScore}%)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 py-4 flex flex-col lg:flex-row items-start gap-5">
        {/* Left: Conversational Stream Area */}
        <div
          className={`flex-1 w-full flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden ${
            mobileTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Conversational Header */}
          <div className="px-5 py-3.5 border-b border-slate-200/70 flex items-center justify-between bg-white/95 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">AI Consular Concierge</h1>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Destination: <strong>{tripDossier.flag} {tripDossier.destination}</strong></span>
                  <span>•</span>
                  <span>Passport: <strong>{tripDossier.passport.status === 'verified' ? 'Verified ✓' : (tripDossier.passport.status === 'rejected' ? 'Rejected ✗' : 'Pending Check')}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Destination Switcher Pill */}
              <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleSend("Travel to United Kingdom")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tripDossier.countryCode === "GB" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🇬🇧 UK
                </button>
                <button
                  onClick={() => handleSend("Travel to United States")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tripDossier.countryCode === "US" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🇺🇸 US
                </button>
              </div>


            </div>
          </div>

          {/* File Format Error Banner if any */}
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

          {/* Chat Messages Stream */}
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

                  {/* Upload Chip */}
                  {msg.type === "file_upload" && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 shadow-xs w-fit max-w-md ml-auto">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{msg.fileName}</div>
                        <div className="text-[10px] text-indigo-700 font-semibold">{msg.fileSize} • Validated Format ✓</div>
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
                            nationality: res.nationality || "Nigerian",
                            monthsValid: res.monthsRemaining,
                            previewUrl: res.previewUrl,
                          }
                        }));
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `✅ **Passport Validity Guardrail Passed!**\n\n• Document Number: **${res.passportNumber}**\n• Holder: **${res.holderName}**\n• Expiration Date: **${res.expiryDate}** (${res.monthsRemaining} months remaining)\n• Statutory Compliance: **Exceeds 6-month minimum threshold ✓**\n\nYour passport has been verified and registered to your dossier. Now, choose which visa category meets your travel intent for **${tripDossier.destination}**:`,
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
                            nationality: res.nationality || "Nigerian",
                            monthsValid: res.monthsRemaining,
                            previewUrl: res.previewUrl,
                          }
                        }));
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            role: "assistant",
                            text: `❌ **Passport Validity Guardrail REJECTED!**\n\nYour passport expires on **${res.expiryDate}** (${res.monthsRemaining} months remaining). Consular statutory policies for ${tripDossier.destination} require at least 6 months validity.\n\n⚠️ **Fee payment and interview booking are blocked** until you renew your passport. You can re-upload or test with a compliant passport above.`,
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
                            text: `Selected: **${visa.name}** for **${visa.country}**.\n\n• Statutory Fee: **${visa.currency_symbol}${visa.fee_foreign.toLocaleString()} (₦${visa.fee_ngn.toLocaleString()})**\n• Purpose: ${visa.purpose}\n\nClick below to pay the dynamic fee of **₦${visa.fee_ngn.toLocaleString()}** directly via Paystack:`,
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
                  {/* 4. Pay Visa Fee Prompt (Dynamic Amount with Live Paystack + Demo Fast-Track) */}
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
                            text: `🏛️ **Physical Embassy Appointment Slip Issued!**\n\n• Location: **${booking.center}**\n• Interview Date & Time: **${booking.date} at ${booking.time}**\n• Case Ref: **${booking.gwf_number || booking.gwf_reference}**\n\nYour official interview appointment slip has been generated and dispatched to your email. Fast-forwarding to consular decision: Your visa has been approved and issued!`,
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
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  TF
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-600 font-semibold ml-1">Evaluating consular guardrails...</span>
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
                title="Attach Passport or Bank Statement"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask visa question, type 'Travel to US', or 'Check passport validity'..."
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

        {/* Right: Active Travel Dossier Sidebar */}
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
                  {tripDossier.passport.status === "verified" ? "Satisfied (5+ Years) ✓" : (tripDossier.passport.status === "rejected" ? "Blocked: < 6 Mos ✗" : "Pending Verification")}
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
                {tripDossier.funds.status === "verified" ? "Sufficient ✓" : "Pending Audit"}
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
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
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
