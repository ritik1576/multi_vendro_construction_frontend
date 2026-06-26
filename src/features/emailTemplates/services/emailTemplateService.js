import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../services/apiConstants';

export const emailTemplateService = {
  getEmailTemplatesApi: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.EMAIL_TEMPLATES);
    return response.data;
  },
  getTemplateDetails: async (templateKey) => {
    const response = await api.get(`${API_ENDPOINTS.ADMIN.EMAIL_TEMPLATES}/${templateKey}`);
    return response.data;
  },
  updateTemplate: async (templateKey, payload) => {
    const response = await api.put(`${API_ENDPOINTS.ADMIN.EMAIL_TEMPLATES}/${templateKey}`, payload);
    return response.data;
  },
  resetTemplate: async (templateKey) => {
    const response = await api.post(`${API_ENDPOINTS.ADMIN.EMAIL_TEMPLATES}/reset/${templateKey}`);
    return response.data;
  }
};
