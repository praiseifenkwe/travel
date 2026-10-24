import axios from "axios";

// API Base URL from environment or fallback to same-origin relative /api
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Enables cookie transport across requests
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Helper for extracting clean, user-friendly error messages from backend responses
export const formatApiError = (err) => {
  if (!err) return "An unexpected error occurred.";
  if (err.response) {
    const { status, data } = err.response;
    if (status === 400) return data?.detail || "Invalid operation. Please verify your details.";
    if (status === 401) return "Session missing or expired. Please sign in again.";
    if (status === 403) return "Request origin or staff permission not allowed.";
    if (status === 404) return data?.detail || "Requested resource was not found.";
    if (status === 409) return data?.detail || "An account with this email is already registered.";
    if (status === 413) return "File exceeds maximum size limit (10 MB).";
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
  // 1. Cookie Authentication (HttpOnly Session)
  auth: {
    signup: async ({ email, name, password }) => {
      const res = await apiClient.post("/auth/signup", { email, name, password });
      return res.data;
    },
    login: async ({ email, password }) => {
      const res = await apiClient.post("/auth/login", { email, password });
      return res.data;
    },
    me: async () => {
      const res = await apiClient.get("/auth/me");
      return res.data;
    },
    logout: async () => {
      const res = await apiClient.post("/auth/logout");
      return res.data;
    },
  },

  // 2. Applications Dossier Intake
  applications: {
    create: async ({ visa_type, destination, applicant_data = {} }) => {
      const res = await apiClient.post("/applications", {
        visa_type,
        destination,
        applicant_data,
      });
      return res.data;
    },
    list: async () => {
      const res = await apiClient.get("/applications");
      return res.data;
    },
    get: async (applicationId) => {
      const res = await apiClient.get(`/applications/${applicationId}`);
      return res.data;
    },
  },

  // 3. Document Processing & OCR
  documents: {
    extract: async (applicationId, docType, file) => {
      const form = new FormData();
      form.append("application_id", applicationId);
      form.append("doc_type", docType); // 'passport' | 'bank_statement'
      form.append("file", file);
      const res = await apiClient.post("/documents/extract", form, {
        headers: { "Content-Type": undefined }, // Let browser set boundary
      });
      return res.data;
    },
  },

  // 4. Guidance Chat & Persisted Conversation History
  chat: {
    sendMessage: async (message, sessionId = null, applicationId = null) => {
      const payload = { message };
      if (sessionId) payload.session_id = sessionId;
      if (applicationId) payload.application_id = applicationId;
      const res = await apiClient.post("/chat", payload);
      return res.data;
    },
    getHistory: async (sessionId) => {
      const res = await apiClient.get(`/chat/${sessionId}/messages`);
      return res.data;
    },
  },

  // 5. Compliance Audit Engine (Legacy & Graph-based)
  audit: {
    evaluate: async (sessionId, applicantProfile, visaType) => {
      const res = await apiClient.post("/audit", {
        session_id: sessionId,
        applicant_profile: applicantProfile,
        visa_type: visaType,
      });
      return res.data;
    },
    evaluateGraph: async ({ applicationId, visaType, applicantData = {} }) => {
      const payload = {
        visa_type: visaType,
        applicant_data: applicantData,
      };
      if (applicationId) payload.application_id = applicationId;
      const res = await apiClient.post("/audit/evaluate", payload);
      return res.data;
    },
  },

  // 6. Dynamic RAG Checklist
  checklist: {
    get: async (visaType, sessionId = "anonymous") => {
      try {
        const res = await apiClient.get("/checklist", {
          params: { visa_type: visaType, session_id: sessionId },
        });
        return res.data;
      } catch (err) {
        console.warn("Backend /api/checklist unreachable:", err.message);
        return {
          session_id: sessionId,
          visa_type: visaType,
          items: [
            { id: "passport", label: "International Passport", description: "Valid for at least 6 months with 2 blank pages", status: "pending", required: true },
            { id: "flight", label: "Return Flight Reservation", description: "Confirmed airline reservation showing entry and exit", status: "pending", required: true },
            { id: "hotel", label: "Hotel Accommodation Proof", description: "Certified hotel voucher or host invitation", status: "pending", required: true },
          ],
          generated_from_rag: false,
          fallback: true,
        };
      }
    },
  },

  // 7. Human-In-The-Loop Rules Engine (Staff / Agency Desk)
  rules: {
    getDrafts: async () => {
      try {
        const res = await apiClient.get("/rules/drafts");
        return res.data;
      } catch (err) {
        return [];
      }
    },
    getActive: async () => {
      try {
        const res = await apiClient.get("/rules/active");
        return res.data;
      } catch (err) {
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

  // 8. Knowledge & Vector Store Stats
  knowledge: {
    getStats: async () => {
      try {
        const res = await apiClient.get("/knowledge/stats");
        return res.data;
      } catch (err) {
        return { total_chunks: 23, collection_name: "rag_chunks" };
      }
    },
  },

  // 9. System Health Check
  health: {
    check: async () => {
      try {
        const res = await apiClient.get("/health");
        return res.data;
      } catch (err) {
        return { status: "offline" };
      }
    },
  },
};
