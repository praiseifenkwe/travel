import axios from "axios";

// Deployed backend base URL from environment or fallback
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
    if (status === 401) return "Session missing or expired. Please sign in again.";
    if (status === 403) return "Request origin or permission not allowed.";
    if (status === 404) return data?.detail || "Requested resource was not found.";
    if (status === 409) return data?.detail || "An account with this email is already registered.";
    if (status === 422) {
      if (Array.isArray(data?.detail)) {
        return data.detail.map((d) => `${d.loc?.slice(-1)[0] || "Field"}: ${d.msg}`).join(", ");
      }
      return data?.detail || "Validation failed. Password must be 12–128 characters.";
    }
    if (status === 503) return "The AI consular service is temporarily unavailable. Please retry shortly.";
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

  // 2. Chat & Persisted Conversation History
  chat: {
    sendMessage: async (message, sessionId = null) => {
      const payload = { message };
      if (sessionId) {
        payload.session_id = sessionId;
      }
      const res = await apiClient.post("/chat", payload);
      return res.data;
    },
    getHistory: async (sessionId) => {
      const res = await apiClient.get(`/chat/${sessionId}/messages`);
      return res.data;
    },
  },

  // 3. Compliance Audit Engine
  audit: {
    evaluate: async (sessionId, applicantProfile, visaType) => {
      const res = await apiClient.post("/audit", {
        session_id: sessionId,
        applicant_profile: applicantProfile,
        visa_type: visaType,
      });
      return res.data;
    },
  },

  // 4. Dynamic RAG Checklist
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

  // 5. Human-In-The-Loop Rules Engine (Agency Desk)
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

  // 6. Knowledge & Vector Store Stats
  knowledge: {
    getStats: async () => {
      try {
        const res = await apiClient.get("/knowledge/stats");
        return res.data;
      } catch (err) {
        return { total_chunks: 48, collection_name: "business_knowledge" };
      }
    },
  },

  // 7. System Health Check
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
