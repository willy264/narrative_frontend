import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface BayseConnectionSummary {
  bayse_user_id: string;
  connected_at: string;
  email: string;
  owner_id: string;
  api_key?: {
    key_id: string;
    name: string;
    public_key_preview: string;
    created_at?: string;
    rotated_at?: string;
  };
}

export interface BayseApiKeyListItem {
  key_id: string;
  name: string;
  public_key_preview: string;
  created_at?: string;
  rotated_at?: string;
}

export interface BayseBalance {
  assets: Array<{ symbol: string; available: number; locked: number; total: number }>;
  fetched_at: string;
  owner_id: string;
}

export const useBayseAccount = () => {
  return useQuery({
    queryKey: ['bayse', 'account'],
    queryFn: async () => {
      try {
        const response = await api.get<{ data: BayseConnectionSummary }>('/api/bayse/accounts/me');
        return response.data.data;
      } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    retry: false,
  });
};

export const useConnectBayse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<{ data: BayseConnectionSummary, meta: { next_step: string } }>('/api/bayse/accounts/connect', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['bayse', 'account'], data.data);
    },
  });
};

export const useBayseBalance = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['bayse', 'balance'],
    queryFn: async () => {
      const response = await api.get<{ data: BayseBalance }>('/api/bayse/accounts/me/balance');
      return response.data.data;
    },
    enabled,
    retry: false,
  });
};

export const useBayseApiKeys = () => {
  return useQuery({
    queryKey: ['bayse', 'api-keys'],
    queryFn: async () => {
      const response = await api.get<{ data: { owner_id: string; keys: BayseApiKeyListItem[] } }>('/api/bayse/accounts/me/api-keys');
      return response.data.data.keys;
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post<{ data: BayseConnectionSummary }>('/api/bayse/accounts/me/api-keys', { name });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bayse', 'api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['bayse', 'account'] });
    },
  });
};

export const useRotateApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keyId: string) => {
      const response = await api.post<{ data: BayseConnectionSummary }>(`/api/bayse/accounts/me/api-keys/${keyId}/rotate`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bayse', 'api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['bayse', 'account'] });
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (keyId: string) => {
      const response = await api.delete<{ data: { key_id: string; owner_id: string } }>(`/api/bayse/accounts/me/api-keys/${keyId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bayse', 'api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['bayse', 'account'] });
    },
  });
};
