import api from './api';

const FinanceService = {
  /**
   * Fetch platform-wide revenue and verification metrics (Super Admin)
   */
  getRevenueAnalytics: async () => {
    const response = await api.get('/api/financial/analytics');
    return response.data;
  },

  /**
   * Fetch the queue of manual payments awaiting review (Super Admin/Accountant)
   */
  getVerificationQueue: async (page = 1) => {
    const response = await api.get(`/api/financial/verification-queue?page=${page}`);
    return response.data;
  },

  /**
   * Approve or reject a pending manual payment
   */
  verifyPayment: async (transactionId, action, notes = '') => {
    const response = await api.post(`/api/financial/verification-queue/${transactionId}`, {
      action,
      notes
    });
    return response.data;
  },

  /**
   * Upload a manual payment proof securely (UPI screenshot)
   */
  uploadPaymentProof: async (formData) => {
    const response = await api.post('/api/financial/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default FinanceService;
