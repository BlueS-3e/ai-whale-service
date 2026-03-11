import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API key to requests
export const setApiKey = (apiKey: string) => {
  apiClient.defaults.headers.common['X-API-Key'] = apiKey;
};

// Whale API
export const whaleApi = {
  predict: async (data: {
    wallet_address: string;
    coin_symbol: string;
    timeframe?: string;
  }) => {
    const response = await apiClient.post('/v1/whale/predict', data);
    return response.data;
  },
  
  history: async (params: {
    coin_symbol: string;
    limit?: number;
    min_amount?: number;
  }) => {
    const response = await apiClient.get('/v1/whale/history', { params });
    return response.data;
  },
  
  topWhales: async (params: { coin_symbol: string; limit?: number }) => {
    const response = await apiClient.get('/v1/whale/top-whales', { params });
    return response.data;
  },
};

// Sentiment API
export const sentimentApi = {
  analyze: async (data: {
    text?: string;
    coin_symbol?: string;
    sources?: string[];
  }) => {
    const response = await apiClient.post('/v1/sentiment/analyze', data);
    return response.data;
  },
  
  trend: async (params: {
    coin_symbol: string;
    timeframe?: string;
    sources?: string[];
  }) => {
    const response = await apiClient.get('/v1/sentiment/trend', { params });
    return response.data;
  },
};

// Risk API
export const riskApi = {
  assess: async (data: { coin_symbol: string; chain?: string }) => {
    const response = await apiClient.post('/v1/risk/assess', data);
    return response.data;
  },
  
  portfolio: async (data: { holdings: Array<{ coin_symbol: string; amount: number }> }) => {
    const response = await apiClient.post('/v1/risk/portfolio', data);
    return response.data;
  },
  
  marketRisk: async (params: { timeframe?: string }) => {
    const response = await apiClient.get('/v1/risk/market-risk', { params });
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await apiClient.get('/v1/health');
    return response.data;
  },
};

// Payment API
export const paymentApi = {
  getPricing: async () => {
    const response = await apiClient.get('/v1/payment/pricing');
    return response.data;
  },
  
  checkout: async (data: {
    email: string;
    tier: string;
    billing_period: 'monthly' | 'yearly';
    payment_method: string;
    success_url?: string;
    cancel_url?: string;
  }) => {
    const response = await apiClient.post('/v1/payment/checkout', data);
    return response.data;
  },
  
  verifyPayment: async (paymentId: string, paymentMethod: string) => {
    const response = await apiClient.get(`/v1/payment/verify/${paymentId}`, {
      params: { payment_method: paymentMethod },
    });
    return response.data;
  },
  
  getTierDetails: async (tierName: string) => {
    const response = await apiClient.get(`/v1/payment/tier/${tierName}`);
    return response.data;
  },
};
