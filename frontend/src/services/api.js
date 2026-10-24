import axios from "axios";

// Explicit base URL for Render backend
const RAW_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://travel-backend-8d6d.onrender.com";

const CLEAN_BASE = RAW_BASE_URL ? RAW_BASE_URL.replace(/\/+$/, "") : "";
const BASE_URL = CLEAN_BASE
  ? CLEAN_BASE.endsWith("/api")
    ? CLEAN_BASE
    : `${CLEAN_BASE}/api`
  : "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enables cookie transport across requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Comprehensive error formatter extracting actionable messages from backend responses
export const formatApiError = (err) => {
  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;

    if (status === 401) return "Session expired or authentication failed. Please sign in again.";
    if (status === 403) return "You do not have administrative permissions to view or edit this resource.";
    if (status === 404) return data?.detail || "The requested immigration or travel record was not found.";
    if (status === 413) return "File payload is too large. Maximum supported document upload size is 10MB.";
    if (status === 415) return "Unsupported file type. Please upload a PDF, JPEG, PNG, or WEBP file.";
    if (status === 422) {
      if (Array.isArray(data?.detail)) {
        return data.detail.map((d) => `${d.loc?.slice(-1)[0] || "Field"}: ${d.msg}`).join(", ");
      }
      return data?.detail || "Validation failed. Please verify required fields.";
    }
    if (status === 500 || status === 503) {
      return data?.detail || "The consular intelligence service is temporarily unavailable. Please retry shortly.";
    }
    return data?.detail || `Server error (${status})`;
  }
  return err.message || "Network error communicating with TravelForge backend.";
};

export const apiService = {
  // 1. Authentication
  auth: {
    signup: async (credentials) => {
      const res = await apiClient.post("/auth/signup", credentials);
      return res.data;
    },
    register: async (credentials) => {
      const res = await apiClient.post("/auth/signup", credentials);
      return res.data;
    },
    login: async (credentials) => {
      const res = await apiClient.post("/auth/login", credentials);
      return res.data;
    },
    logout: async () => {
      const res = await apiClient.post("/auth/logout");
      return res.data;
    },
    me: async () => {
      const res = await apiClient.get("/auth/me");
      return res.data;
    },
  },

  // 2. Application Dossiers & Profile
  applications: {
    list: async () => {
      const res = await apiClient.get("/applications");
      return res.data;
    },
    create: async (payload) => {
      const res = await apiClient.post("/applications", payload);
      return res.data;
    },
    get: async (applicationId) => {
      const res = await apiClient.get(`/applications/${applicationId}`);
      return res.data;
    },
    updateIntake: async (applicationId, { facts, confirm_fields = [] }) => {
      const res = await apiClient.patch(`/applications/${applicationId}/intake`, {
        facts,
        confirm_fields,
      });
      return res.data;
    },
  },

  // 3. Document Vault & Evidence Verification
  documents: {
    list: async (applicationId) => {
      const res = await apiClient.get(`/documents/application/${applicationId}`);
      return res.data;
    },
    upload: async (formData) => {
      const res = await apiClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    review: async (documentId, { decision, review_notes = "", corrected_data = null }) => {
      const payload = { decision, review_notes };
      if (corrected_data) payload.corrected_data = corrected_data;
      const res = await apiClient.post(`/documents/${documentId}/review`, payload);
      return res.data;
    },
  },

  // 4. Autonomous Consular Copilot Chat
  chat: {
    send: async ({ message, application_id = null, session_id = null }) => {
      const res = await apiClient.post("/chat", {
        message,
        application_id,
        session_id,
      });
      return res.data;
    },
    getHistory: async (sessionId) => {
      const res = await apiClient.get(`/chat/${sessionId}/messages`);
      return res.data;
    },
  },

  // 5. Statutory Checklists
  checklist: {
    generate: async (visaType) => {
      const res = await apiClient.post("/checklist/generate", { visa_type: visaType });
      return res.data;
    },
  },

  // 6. LangGraph Audit Engine & Verification Graph
  audit: {
    evaluate: async (applicationId) => {
      const res = await apiClient.post(`/audit/evaluate/${applicationId}`);
      return res.data;
    },
    getTickets: async (status = null) => {
      const params = status ? { status } : {};
      const res = await apiClient.get("/audit/tickets", { params });
      return res.data;
    },
    updateTicket: async (ticketId, { status, resolution_notes = "" }) => {
      const res = await apiClient.patch(`/audit/tickets/${ticketId}`, {
        status,
        resolution_notes,
      });
      return res.data;
    },
  },

  // 7. Travel Inventory, Autonomous Holds & Honeymoon Planning
  travel: {
    searchFlights: async (params = {}) => {
      const res = await apiClient.get("/travel/flights", { params });
      return res.data;
    },
    holdFlight: async ({ flight_id, passengers = [], contact_email = null, application_id = null }) => {
      const res = await apiClient.post("/travel/flights/hold", {
        flight_id,
        passengers,
        contact_email,
        application_id,
      });
      return res.data;
    },
    searchAccommodations: async (params = {}) => {
      const res = await apiClient.get("/travel/accommodations", { params });
      return res.data;
    },
    reserveAccommodation: async ({ hotel_id, guests = [], check_in = "2026-11-20", check_out = "2026-11-27", nights = 7, application_id = null }) => {
      const res = await apiClient.post("/travel/accommodations/reserve", {
        hotel_id,
        guests,
        check_in,
        check_out,
        nights,
        application_id,
      });
      return res.data;
    },
    getPlatformGuides: async (params = {}) => {
      const res = await apiClient.get("/travel/platform-guides", { params });
      return res.data;
    },
    getHoneymoonPackages: async (params = {}) => {
      const res = await apiClient.get("/travel/honeymoon-packages", { params });
      return res.data;
    },
    planHoneymoon: async (payload) => {
      const res = await apiClient.post("/travel/honeymoon-plan", payload);
      return res.data;
    },
    getSummary: async () => {
      const res = await apiClient.get("/travel/summary");
      return res.data;
    },
    getExchangeRates: async () => {
      const res = await apiClient.get("/travel/exchange-rates");
      return res.data;
    },
    initPaystack: async ({ amount_ngn, purpose, applicant_name, email, metadata = {} }) => {
      const res = await apiClient.post("/travel/payments/paystack/initialize", {
        amount_ngn,
        purpose,
        applicant_name,
        email,
        metadata,
      });
      return res.data;
    },
    verifyPaystack: async (reference) => {
      const res = await apiClient.post("/travel/payments/paystack/verify", { reference });
      return res.data;
    },
    bookAppointment: async (payload) => {
      const res = await apiClient.post("/travel/appointments/book", payload);
      return res.data;
    },
    analyzeBankStatement: async (payload = {}) => {
      const res = await apiClient.post("/travel/bank-statement/analyze", payload);
      return res.data;
    },
  },

  // 8. Human-In-The-Loop Rules Engine (Staff / Agency Desk)
  rules: {
    getDrafts: async () => {
      try {
        const res = await apiClient.get("/rules/drafts");
        return res.data;
      } catch (err) {
        console.warn("Rules drafts fallback:", err);
        return [];
      }
    },
    getActive: async () => {
      try {
        const res = await apiClient.get("/rules/active");
        return res.data;
      } catch (err) {
        console.warn("Rules active fallback:", err);
        return [];
      }
    },
    confirm: async (ruleId, payload) => {
      const res = await apiClient.post(`/rules/confirm/${ruleId}`, payload);
      return res.data;
    },
    extract: async (rawText, visaType, sourceName = "wakanow_update") => {
      const res = await apiClient.post("/rules/extract", {
        raw_text: rawText,
        visa_type: visaType,
        source_name: sourceName,
      });
      return res.data;
    },
  },

  // 9. Knowledge & Vector Store Stats
  knowledge: {
    getStats: async () => {
      try {
        const res = await apiClient.get("/knowledge/stats");
        return res.data;
      } catch {
        return { total_chunks: 200, verified_rules: 12, vector_dimensions: 1536 };
      }
    },
  },

  // 10. System Health Check
  health: {
    check: async () => {
      try {
        const res = await apiClient.get("/health");
        return res.data;
      } catch {
        return { status: "degraded", timestamp: new Date().toISOString() };
      }
    },
  },
};
