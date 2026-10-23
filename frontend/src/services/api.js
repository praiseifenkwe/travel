import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Chat
  sendChatMessage: async (message, applicationId = null) => {
    const res = await apiClient.post('/chat', {
      message,
      application_id: applicationId,
    });
    return res.data;
  },

  // Document Upload
  uploadDocument: async (applicationId, docType, file) => {
    const formData = new FormData();
    formData.append('application_id', applicationId);
    formData.append('doc_type', docType);
    formData.append('file', file);

    const res = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Applications
  getApplications: async () => {
    const res = await apiClient.get('/applications');
    return res.data;
  },

  getApplicationById: async (id) => {
    const res = await apiClient.get(`/applications/${id}`);
    return res.data;
  },

  // Staff Actions
  performStaffAction: async (applicationId, action, issueId = null, note = null) => {
    const res = await apiClient.post('/staff/actions', {
      application_id: applicationId,
      action,
      issue_id: issueId,
      note,
    });
    return res.data;
  },

  // Flights
  getFlights: async (applicationId = null, destination = 'United Kingdom') => {
    const res = await apiClient.get('/flights', {
      params: { application_id: applicationId, destination },
    });
    return res.data;
  },
};
