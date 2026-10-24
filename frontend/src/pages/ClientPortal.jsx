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
  Award
} from "lucide-react";
import { Button } from "../components/shared/Button";
import { Link } from "react-router-dom";
import { apiService, formatApiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

import { PaystackModal } from "../components/shared/PaystackModal";
import { DemoFlowBar } from "../components/shared/DemoFlowBar";
import { BankStatementCard } from "../components/chat/BankStatementCard";
import { VisaComparisonCard } from "../components/chat/VisaComparisonCard";
import { AppointmentCard } from "../components/chat/AppointmentCard";
import { VisaApprovalCard } from "../components/chat/VisaApprovalCard";
import { HotelCards } from "../components/accommodations/HotelCards";
import { FlightCards } from "../components/flights/FlightCards";

export const ClientPortal = () => {
  const { user, openAuthModal } = useAuth();
  const storageKey = user ? `travelforge_session_${user.id}` : "travelforge_session_guest";
  const appStorageKey = user ? `travelforge_app_${user.id}` : "travelforge_app_guest";
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(storageKey) || null);
  const [applicationId, setApplicationId] = useState(() => localStorage.getItem(appStorageKey) || null);
  const [activeStep, setActiveStep] = useState(1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scanningPassport, setScanningPassport] = useState(false);

  // Paystack Modal State
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [paystackAmount, setPaystackAmount] = useState(380000);
  const [paystackPurpose, setPaystackPurpose] = useState("visa_fee");
  const [paystackTitle, setPaystackTitle] = useState("UK Standard Visitor Visa Fee");
  const [paystackCallback, setPaystackCallback] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Live Trip Dossier State
  const [tripDossier, setTripDossier] = useState({
    destination: "London, United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    dates: "14 Nov – 28 Nov 2026",
    purpose: "Holiday & Tourism",
    visaType: "UK Standard Visitor Visa",
    processingTime: "3 to 4 Business Weeks",
    consularFeeGbp: 115,
    consularFeeNgn: 241500,
    passport: {
      status: "pending",
      name: "",
      number: "",
      expiry: "",
      nationality: "Nigerian"
    },
    bankStatement: {
      status: "pending",
      averageBalanceNgn: 8550000,
      meetsThreshold: true
    },
    appointment: {
      status: "pending",
      center: "",
      date: "",
      time: "",
      gwfRef: ""
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
      text: `Hello Tunde. Welcome to your TravelForge consular intake workspace.

I will guide you step-by-step through obtaining your visa, verifying your 6-month bank statement, booking your VFS biometrics, and locking your flights and hotels with zero manual forms.

Let us begin with Step 1: Let us inspect your international passport to confirm validity of 6+ months.`,
      type: "step1_passport"
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scanningPassport]);

  // Execute Step 1: Passport Verification
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
          nationality: "Nigerian"
        }
      }));
      setActiveStep(2);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `✅ **Step 1 PASSPORT VERIFIED & ICAO 9303 COMPLIANT**

• **Holder:** Tunde Babatunde Adeyemi
• **Passport No:** A12345678 (Nigerian Standard)
• **Expiry:** 14 Nov 2031
• **Validity Check:** **PASSED** (Exceeds mandatory 6-month rule with 5+ years remaining!)
• **MRZ Checksum:** Valid ✓

--- 
**Step 2: What is your primary reason for travel?**
(Select an option or type your reason below):`,
          type: "step2_reason",
          options: [
            "🏖️ Tourism, Holiday & Family Visit",
            "💼 Skilled Work & Tech Job Relocation (Japa)",
            "🎓 Higher Studies (Undergraduate / Masters)",
            "🤝 Short Business Meetings & Conferences"
          ]
        }
      ]);
    }, 700);
  };

  // Execute Step 2: Handle Travel Reason Selection
  const handleSelectReason = (reason) => {
    setActiveStep(3);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: reason },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: `Understood! You selected: **${reason}**.

**Step 3: Visa Options & Fee Breakdown**
Here is the comparative statutory breakdown for the United Kingdom. I have converted all official Home Office / UKVI fees to their Naira equivalent at our live central bank benchmark (**£1.00 = ₦2,100.00**):`,
        type: "step3_visa_comparison"
      }
    ]);
  };

  // Execute Step 3: Handle Visa Selection
  const handleSelectVisaRoute = (route) => {
    setTripDossier((prev) => ({
      ...prev,
      visaType: route.title,
      consularFeeGbp: route.feeGbp,
      consularFeeNgn: route.feeNgn,
      purpose: route.purpose
    }));
    setActiveStep(4);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: `I choose the ${route.title}` },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: `Excellent selection: **${route.title}**.

• **Official UKVI Consular Fee:** £${route.feeGbp.toLocaleString()} (~₦${route.feeNgn.toLocaleString('en-NG')})
• **Permitted Stay:** ${route.duration}

---
**Step 4: Proof of Funds (6-Month Bank Statement)**
Under UK immigration statutory rules, applicants must show an average balance of at least **£1,270 (₦2,667,000.00)** held consistently over a 28-day / 6-month period without sudden unexplained lump deposits.

Let us analyze your 6-month bank statement to verify your average balance:`,
        type: "step4_bank_statement"
      }
    ]);
  };

  // Execute Step 4: Handle Bank Statement Verification
  const handleBankStatementVerified = (statementData) => {
    setTripDossier((prev) => ({
      ...prev,
      bankStatement: {
        status: "verified",
        averageBalanceNgn: statementData.averageBalance,
        meetsThreshold: true
      }
    }));
    setActiveStep(5);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        text: `✅ **Step 4 PROOF OF FUNDS CERTIFIED**

• **Account Name:** ${statementData.accountName}
• **Bank:** ${statementData.bankName}
• **6-Month Average Balance:** ₦${statementData.averageBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
• **Required Maintenance Threshold:** £1,270 (₦${statementData.requiredThresholdNgn.toLocaleString('en-NG')})
• **Surplus Safety Buffer:** +₦${(statementData.averageBalance - statementData.requiredThresholdNgn).toLocaleString('en-NG')}
• **Status:** **APPROVED FOR VISA LODGEMENT**

---
**Step 5: Visa Application Fee Payment**
The official Home Office consular visa application fee + VFS Global biometrics processing charge is **₦380,000.00**.

Please complete payment via our secure Paystack checkout modal to submit your dossier to the consular queue:`,
        type: "step5_paystack_visa_trigger"
      }
    ]);
  };

  // Trigger Paystack Modal for Visa Fee
  const triggerVisaFeePaystack = () => {
    setPaystackAmount(380000);
    setPaystackPurpose("visa_fee");
    setPaystackTitle("UK Standard Visitor Visa & VFS Biometrics Fee");
    setPaystackCallback(() => (receipt) => {
      setActiveStep(6);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `💳 **PAYMENT CONFIRMED VIA PAYSTACK**

• **Amount Paid:** ₦380,000.00
• **Paystack Transaction Ref:** \`${receipt.reference}\`
• **Receipt No:** \`${receipt.receipt_number}\`
• **Channel:** Mastercard / Card Settlement

---
**Step 6: Book Visa Interview & Biometrics Appointment**
Your payment has been logged with the Home Office. Now select your preferred VFS Global biometric appointment center and date in Lagos or Abuja:`,
          type: "step6_appointment"
        }
      ]);
    });
    setPaystackOpen(true);
  };

  // Execute Step 6: Handle Appointment Booking
  const handleAppointmentBooked = (apptData) => {
    setTripDossier((prev) => ({
      ...prev,
      appointment: {
        status: "confirmed",
        center: apptData.center,
        date: apptData.date,
        time: apptData.time,
        gwfRef: apptData.gwf_reference
      }
    }));
    setActiveStep(7);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        text: `📅 **VFS GLOBAL APPOINTMENT BOOKED**

• **GWF Reference:** \`${apptData.gwf_reference}\`
• **Center:** ${apptData.center}
• **Date & Time:** ${apptData.date} at ${apptData.time}
• **Status:** Confirmed ✓
• **Email Dispatch:** Official appointment confirmation letter & checklist dispatched to **${apptData.email}**

---
**Step 7: Embassy Review & Decision Milestone**
Simulating consular biometrics capture, document review, and visa issuance...`,
        type: "step7_visa_approved"
      }
    ]);
  };

  // Execute Step 7 -> 8: Transition from Visa Approval to Flight Logistics
  const handleProceedToFlights = () => {
    setActiveStep(8);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        text: `🎉 **VISA OFFICIALLY GRANTED & STAMPED!**

Your UK entry clearance is stamped in your passport valid for 6 months.

---
**Step 8: Flight Ticket Preferences**
Now let us coordinate your departure logistics. What is your flight ticket preference?

• **Route:** Lagos (LOS) ➔ London (LHR)
• **Departure Window:** Mid-November 2026
• **Cabin Preference:** Economy, Premium Economy, or Business?
• **Airline:** British Airways, Virgin Atlantic, or Emirates?

Here are direct flights matching your profile:`,
        type: "step8_flight_options"
      }
    ]);
  };

  // Trigger Paystack Modal for Flight Ticket
  const triggerFlightPaystack = (flight) => {
    setPaystackAmount(flight.price_ngn || 1850000);
    setPaystackPurpose("flight_ticket");
    setPaystackTitle(`${flight.airline} ${flight.flight_no} (${flight.origin_code} ➔ ${flight.dest_code}) Ticket`);
    setPaystackCallback(() => (receipt) => {
      setTripDossier((prev) => ({
        ...prev,
        flight: {
          status: "confirmed",
          airline: flight.airline,
          flightNumber: flight.flight_no,
          route: `${flight.origin_code} ➔ ${flight.dest_code}`,
          dates: "15 Nov – 28 Nov 2026",
          pnr: `BA-${Math.floor(100000 + Math.random() * 900000)}`,
          price: flight.price_formatted
        }
      }));
      setActiveStep(10);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `✈️ **FLIGHT TICKET ISSUED & GDS PNR LOCKED**

• **Airline:** ${flight.airline} (${flight.flight_no})
• **PNR Locator:** \`BA-764920\`
• **Cabin:** ${flight.cabin}
• **Baggage:** ${flight.baggage}
• **Payment:** ₦${flight.price_ngn.toLocaleString('en-NG')} verified via Paystack (\`${receipt.reference}\`)

---
**Step 10: Hotel Accommodation & Consular Proof of Stay**
Finally, let us secure your verified London hotel accommodation voucher. Here are certified 4-star and 5-star properties offering free consular cancellation:`,
          type: "step10_hotel_options"
        }
      ]);
    });
    setPaystackOpen(true);
  };

  // Trigger Paystack Modal for Hotel Stay Voucher
  const triggerHotelPaystack = (hotel) => {
    const totalNights = 7;
    const totalNgn = (hotel.nightly_ngn || 480000) * totalNights;
    setPaystackAmount(totalNgn);
    setPaystackPurpose("hotel_reservation");
    setPaystackTitle(`${hotel.name} (${totalNights} Nights) Accommodation Voucher`);
    setPaystackCallback(() => (receipt) => {
      setTripDossier((prev) => ({
        ...prev,
        hotel: {
          status: "confirmed",
          name: hotel.name,
          location: `${hotel.city}, ${hotel.country}`,
          reference: `VCH-${hotel.city.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
          nights: `${totalNights} Nights`
        }
      }));
      setActiveStep(10);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: `🏨 **HOTEL PROOF-OF-STAY VOUCHER ISSUED**

• **Hotel:** ${hotel.name} (${hotel.city})
• **Room Type:** ${hotel.room_type}
• **Consular Voucher Code:** \`VCH-LON-892014\`
• **Payment:** ₦${totalNgn.toLocaleString('en-NG')} verified via Paystack (\`${receipt.reference}\`)

🎉 **CONGRATULATIONS! YOUR COMPLETE RELOCATION & TRAVEL DOSSIER IS 100% READY.**

1. Passport Validity: Verified ✓
2. Visa Status: Approved & Stamped ✓
3. Bank Statement Proof of Funds: Passed (₦8.55M average) ✓
4. VFS Appointment: Booked & Confirmation Dispatched ✓
5. Flight Ticket: Confirmed PNR BA-764920 ✓
6. Hotel Accommodation: Consular Certified Voucher Issued ✓

You are cleared for departure to London!`,
          type: "text"
        }
      ]);
    });
    setPaystackOpen(true);
  };

  // Direct Jump to Any Demo Step via DemoFlowBar
  const handleJumpToStep = (stepNumber) => {
    setActiveStep(stepNumber);
    if (stepNumber === 1) {
      executePassportVerification();
    } else if (stepNumber === 2) {
      handleSelectReason("Tourism, Holiday & Family Visit");
    } else if (stepNumber === 3) {
      handleSelectVisaRoute({
        id: "visitor",
        title: "UK Standard Visitor Visa",
        feeGbp: 115,
        feeNgn: 241500,
        duration: "6 Months",
        purpose: "Tourism and Family Visit"
      });
    } else if (stepNumber === 4) {
      handleBankStatementVerified({
        accountName: "Tunde Babatunde Adeyemi",
        bankName: "Guaranty Trust Bank (GTBank)",
        averageBalance: 8550000,
        requiredThresholdNgn: 2667000
      });
    } else if (stepNumber === 5) {
      triggerVisaFeePaystack();
    } else if (stepNumber === 6) {
      handleAppointmentBooked({
        center: "VFS Global Lagos (Victoria Island - Manor Hall)",
        date: "2026-10-28",
        time: "09:30 AM",
        applicant_name: "Tunde Babatunde Adeyemi",
        email: user?.email || "applicant@travelforge.com",
        gwf_reference: "GWF099482103"
      });
    } else if (stepNumber === 7) {
      handleProceedToFlights();
    } else if (stepNumber === 8 || stepNumber === 9) {
      triggerFlightPaystack({
        airline: "British Airways",
        flight_no: "BA76",
        origin_code: "LOS",
        dest_code: "LHR",
        cabin: "World Traveller Plus (Premium)",
        baggage: "2 x 23kg checked",
        price_ngn: 1850000,
        price_formatted: "₦1,850,000"
      });
    } else if (stepNumber === 10) {
      triggerHotelPaystack({
        name: "The Savoy London",
        city: "London",
        country: "United Kingdom",
        room_type: "Deluxe Thames River View Suite",
        nightly_ngn: 480000
      });
    }
  };

  // Handle Freeform Message Send
  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const lower = text.toLowerCase();

    setTimeout(() => {
      setIsTyping(false);

      if (lower.includes("passport") || lower.includes("mrz") || lower.includes("validity")) {
        executePassportVerification();
      } else if (lower.includes("holiday") || lower.includes("visit") || lower.includes("touris") || lower.includes("reason")) {
        handleSelectReason("Tourism, Holiday & Family Visit");
      } else if (lower.includes("work") || lower.includes("job") || lower.includes("japa")) {
        handleSelectReason("Skilled Work & Tech Job Relocation (Japa)");
      } else if (lower.includes("statement") || lower.includes("bank") || lower.includes("funds") || lower.includes("balance")) {
        handleBankStatementVerified({
          accountName: "Tunde Babatunde Adeyemi",
          bankName: "Guaranty Trust Bank (GTBank)",
          averageBalance: 8550000,
          requiredThresholdNgn: 2667000
        });
      } else if (lower.includes("pay") || lower.includes("paystack") || lower.includes("fee")) {
        triggerVisaFeePaystack();
      } else if (lower.includes("appointment") || lower.includes("vfs") || lower.includes("interview") || lower.includes("biometric")) {
        handleAppointmentBooked({
          center: "VFS Global Lagos (Victoria Island - Manor Hall)",
          date: "2026-10-28",
          time: "09:30 AM",
          applicant_name: "Tunde Babatunde Adeyemi",
          email: user?.email || "applicant@travelforge.com",
          gwf_reference: "GWF099482103"
        });
      } else if (lower.includes("flight") || lower.includes("ticket") || lower.includes("airway") || lower.includes("emirates")) {
        handleProceedToFlights();
      } else if (lower.includes("hotel") || lower.includes("savoy") || lower.includes("room") || lower.includes("stay")) {
        triggerHotelPaystack({
          name: "The Savoy London",
          city: "London",
          country: "United Kingdom",
          room_type: "Deluxe Thames River View Suite",
          nightly_ngn: 480000
        });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: `I am actively coordinating your travel dossier! You can select any step from the 10-step Demo Flow Bar above, or ask me any question about visa rules, bank balance calculations, or flight booking.`,
            type: "text"
          }
        ]);
      }
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* 10-Step Interactive Demo Ribbon */}
      <DemoFlowBar activeStep={activeStep} onSelectStep={handleJumpToStep} />

      {/* Main Grid: Left = Chat Workspace, Right = Live Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Conversational AI Agent Stream */}
        <div className="lg:col-span-7 flex flex-col h-[760px] bg-white rounded-[32px] border border-slate-200 shadow-sleek overflow-hidden">
          
          {/* Chat Stream Header */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
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
                  <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-200 font-semibold px-2 py-0.2 rounded-full">
                    Step {activeStep} of 10 Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Full Autonomy Intake • Real-Time Paystack & VFS Dispatch
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveStep(1);
                setMessages([
                  {
                    id: 1,
                    role: "assistant",
                    text: `Hello Tunde. Welcome to your TravelForge consular intake workspace.

I will guide you step-by-step through obtaining your visa, verifying your 6-month bank statement, booking your VFS biometrics, and locking your flights and hotels with zero manual forms.

Let us begin with Step 1: Let us inspect your international passport to confirm validity of 6+ months.`,
                    type: "step1_passport"
                  }
                ]);
              }}
              title="Reset Demo Flow"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Flow</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4 text-brand-300" />
                  </div>
                )}

                <div className={`space-y-3 max-w-[88%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Bubble Text */}
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-[13px] leading-relaxed shadow-subtle ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-none font-medium"
                        : "bg-slate-50/90 text-slate-800 rounded-tl-none border border-slate-200/70"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Quick Suggestion Pills */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (msg.type === "step2_reason") {
                                handleSelectReason(opt);
                              } else {
                                handleSend(opt);
                              }
                            }}
                            className="px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 text-slate-700 hover:text-brand-800 text-[11px] font-semibold shadow-sleek transition-all cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interactive Cards embedded directly in the message flow */}
                  
                  {/* Step 1: Passport Verification Card */}
                  {msg.type === "step1_passport" && tripDossier.passport.status !== "verified" && (
                    <div className="p-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-float space-y-4">
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
                        The assistant automatically checks your expiration date against the mandatory 6-month consular validity rule.
                      </p>

                      {scanningPassport ? (
                        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
                          <div className="flex items-center justify-center gap-2 text-brand-300 text-xs font-bold font-mono">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>SCANNING PASSPORT MRZ & VALIDITY...</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={executePassportVerification}
                          className="w-full p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Verify Passport on File (A12345678)</span>
                            </div>
                            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                              Tunde Adebayo • Expires 14 Nov 2031 (Valid &gt; 5 yrs)
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Step 3: Visa Comparison Card */}
                  {msg.type === "step3_visa_comparison" && (
                    <VisaComparisonCard onSelectRoute={handleSelectVisaRoute} />
                  )}

                  {/* Step 4: Bank Statement Card */}
                  {msg.type === "step4_bank_statement" && (
                    <BankStatementCard onVerified={handleBankStatementVerified} />
                  )}

                  {/* Step 5: Paystack Trigger Card */}
                  {msg.type === "step5_paystack_visa_trigger" && (
                    <div className="p-5 rounded-3xl bg-[#0BA4DB]/10 border border-[#0BA4DB]/30 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <CreditCard className="w-4 h-4 text-[#0BA4DB]" />
                          <span>Paystack Visa Fee Checkout</span>
                        </div>
                        <span className="font-mono font-black text-[#0BA4DB] text-sm">₦380,000.00</span>
                      </div>
                      <p className="text-slate-600">
                        Click below to trigger the Paystack pop-up checkout modal and settle the official Home Office consular fee.
                      </p>
                      <button
                        onClick={triggerVisaFeePaystack}
                        className="w-full py-3 rounded-2xl bg-[#0BA4DB] hover:bg-[#0993C5] text-white font-extrabold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Open Paystack Modal (Pay ₦380,000.00)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Step 6: Appointment Card */}
                  {msg.type === "step6_appointment" && (
                    <AppointmentCard onBooked={handleAppointmentBooked} userEmail={user?.email || "applicant@travelforge.com"} />
                  )}

                  {/* Step 7: Visa Approved Milestone Card */}
                  {msg.type === "step7_visa_approved" && (
                    <VisaApprovalCard onProceedToFlights={handleProceedToFlights} />
                  )}

                  {/* Step 8 & 9: Flight Cards */}
                  {msg.type === "step8_flight_options" && (
                    <div className="space-y-3">
                      <FlightCards destination="London" onSelectFlight={triggerFlightPaystack} />
                    </div>
                  )}

                  {/* Step 10: Hotel Cards */}
                  {msg.type === "step10_hotel_options" && (
                    <div className="space-y-3">
                      <HotelCards city="London" onSelectHotel={triggerHotelPaystack} />
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "TA"}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-brand-300" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2.5">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything or respond to the assistant..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400"
            />
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-sleek transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Trip Dossier Summary Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-[32px] border border-slate-200 shadow-sleek space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  AUTONOMOUS TRAVEL DOSSIER
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {tripDossier.destination} {tripDossier.flag}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                Step {activeStep}/10
              </span>
            </div>

            {/* Stage Checkpoints */}
            <div className="space-y-3 text-xs">
              {/* Checkpoint 1: Passport */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">1. Passport Validity Check</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.passport.status === "verified"
                        ? `A12345678 (Expires ${tripDossier.passport.expiry})`
                        : "Pending Verification"}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripDossier.passport.status === "verified"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tripDossier.passport.status === "verified" ? "✓ Verified" : "Pending"}
                </span>
              </div>

              {/* Checkpoint 2: Bank Statement */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">2. 6-Month Bank Statement</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.bankStatement.status === "verified"
                        ? `₦8.55M Average Balance (Passed £1,270 rule)`
                        : "Threshold Evaluation"}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripDossier.bankStatement.status === "verified"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tripDossier.bankStatement.status === "verified" ? "✓ Passed" : "Pending"}
                </span>
              </div>

              {/* Checkpoint 3: VFS Appointment */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">3. VFS Biometrics Appointment</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.appointment.status === "confirmed"
                        ? `${tripDossier.appointment.gwfRef} (${tripDossier.appointment.date})`
                        : "Interview Scheduling"}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripDossier.appointment.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tripDossier.appointment.status === "confirmed" ? "✓ Booked" : "Pending"}
                </span>
              </div>

              {/* Checkpoint 4: Flight PNR Hold */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">4. Flight Ticket & PNR Hold</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.flight.status === "confirmed"
                        ? `${tripDossier.flight.airline} (PNR: ${tripDossier.flight.pnr})`
                        : "Direct Departure Routing"}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripDossier.flight.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tripDossier.flight.status === "confirmed" ? "✓ Paid & Held" : "Pending"}
                </span>
              </div>

              {/* Checkpoint 5: Hotel Stay Voucher */}
              <div className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Hotel className="w-4 h-4 text-slate-700" />
                  <div>
                    <div className="font-bold text-slate-900">5. Hotel Consular Voucher</div>
                    <div className="text-[11px] text-slate-500">
                      {tripDossier.hotel.status === "confirmed"
                        ? `${tripDossier.hotel.name} (${tripDossier.hotel.reference})`
                        : "Certified Proof of Stay"}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripDossier.hotel.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {tripDossier.hotel.status === "confirmed" ? "✓ Confirmed" : "Pending"}
                </span>
              </div>
            </div>

            {/* Quick Demo Launchers */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Praise Demo Quick Launchers:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleJumpToStep(4)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[11px] text-left transition-all cursor-pointer"
                >
                  🏦 Test Bank Statement
                </button>
                <button
                  onClick={() => handleJumpToStep(5)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[11px] text-left transition-all cursor-pointer"
                >
                  💳 Test Paystack Visa Fee
                </button>
                <button
                  onClick={() => handleJumpToStep(6)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[11px] text-left transition-all cursor-pointer"
                >
                  📅 Test VFS Interview
                </button>
                <button
                  onClick={() => handleJumpToStep(9)}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-[11px] text-left transition-all cursor-pointer"
                >
                  ✈️ Test Paystack Flight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Checkout Modal */}
      <PaystackModal
        isOpen={paystackOpen}
        onClose={() => setPaystackOpen(false)}
        onSuccess={(receipt) => {
          if (paystackCallback) paystackCallback(receipt);
        }}
        amountNgn={paystackAmount}
        purpose={paystackPurpose}
        title={paystackTitle}
        userEmail={user?.email || "applicant@travelforge.com"}
      />
    </div>
  );
};
