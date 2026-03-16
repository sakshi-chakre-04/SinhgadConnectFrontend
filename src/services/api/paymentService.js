import api from './api';

export const paymentAPI = {
    // Create a new Razorpay order
    createOrder: () => api.post('/payment/create-order'),

    // Verify payment after Razorpay checkout
    verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),

    // Get current Pro status
    getStatus: () => api.get('/payment/status'),
};
