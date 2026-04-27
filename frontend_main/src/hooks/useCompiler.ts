import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export type ThreadStatus = 'READY' | 'AWAITING_APPROVAL' | 'AWAITING_AI_RUNTIME' | 'COMPILED' | 'ARCHIVED';

export interface CompilerThread {
  thread_id: string;
  owner_id: string;
  narrator_id: string;
  source_conversation_id?: string;
  status: ThreadStatus;
  runtime_mode: 'disabled' | 'langgraph';
  messages: Array<{
    message_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export const useCreateCompilerThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ data: CompilerThread }>('/api/compiler/threads');
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['compiler', data.thread_id], data);
    },
  });
};

export const useCompilerThread = (threadId?: string) => {
  return useQuery({
    queryKey: ['compiler', threadId],
    queryFn: async () => {
      if (!threadId) return null;
      const response = await api.get<{ data: CompilerThread }>(`/api/compiler/threads/${threadId}`);
      return response.data.data;
    },
    enabled: !!threadId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
      const response = await api.post<{ data: CompilerThread }>(`/api/compiler/threads/${threadId}/messages`, { content });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['compiler', data.thread_id], data);
    },
  });
};

export const useApproveThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const response = await api.post<{ data: CompilerThread }>(`/api/compiler/threads/${threadId}/approve`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['compiler', data.thread_id], data);
    },
  });
};
