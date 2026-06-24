import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../services/apiConstants';

export const emailTemplateService = {
  getEmailTemplatesApi: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.EMAIL_TEMPLATES);
    return response.data;
  }
};
