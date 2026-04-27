import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Workspace } from './useWorkspace';

export interface Schedule {
  thread_id: string;
  narrative_id: string;
  workspace_id: string;
  status: 'active' | 'paused' | 'terminal';
  next_run_at?: string;
  last_run_at?: string;
  last_success_at?: string;
  last_error?: string;
  consecutive_failures: number;
  created_at: string;
  updated_at: string;
}

export interface Run {
  run_id: string;
  thread_id: string;
  workspace_id: string;
  trigger: 'manual' | 'scheduler' | 'task';
  status: 'started' | 'succeeded' | 'failed' | 'skipped';
  started_at: string;
  ended_at?: string;
  summary?: string;
}

export interface OrchestratorStatus {
  schedule: Schedule;
  latest_run?: Run;
  workspace: Workspace;
  runtime_mode: 'disabled' | 'active';
  trading_policy: {
    mode: 'paper' | 'live';
  };
}

export interface OrchestratorThreadItem {
  schedule: Schedule;
  latest_run?: Run;
  workspace: Workspace;
}

/** List all orchestrator threads for the current user */
export const useOrchestratorThreads = () => {
  return useQuery({
    queryKey: ['orchestrator', 'threads'],
    queryFn: async () => {
      const response = await api.get<{ data: OrchestratorThreadItem[] }>('/api/orchestrator/threads');
      return response.data.data;
    },
  });
};

export const useOrchestratorStatus = (threadId?: string, isPollingEnabled: boolean = false) => {
  return useQuery({
    queryKey: ['orchestrator', 'status', threadId],
    queryFn: async () => {
      if (!threadId) return null;
      const response = await api.get<{ data: OrchestratorStatus }>(`/api/orchestrator/threads/${threadId}/status`);
      return response.data.data;
    },
    enabled: !!threadId,
    // Dynamic polling based on status
    refetchInterval: (query) => {
      if (!isPollingEnabled) return false;
      const status = query.state.data?.latest_run?.status;
      return status === 'started' ? 15000 : 60000; // 15s if running, 60s otherwise
    },
  });
};

/** Paginated run history for a thread */
export const useRunHistory = (threadId?: string, before?: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['orchestrator', 'runs', threadId, before, limit],
    queryFn: async () => {
      if (!threadId) return [];
      const params = new URLSearchParams();
      if (before) params.set('before', before);
      params.set('limit', String(limit));
      const response = await api.get<{ data: Run[] }>(
        `/api/orchestrator/threads/${threadId}/runs?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!threadId,
  });
};

export const useRunOrchestrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const response = await api.post<{ data: { run: Run; schedule: Schedule; trading_policy: any } }>(
        `/api/orchestrator/threads/${threadId}/run`
      );
      return response.data.data;
    },
    onSuccess: (_, threadId) => {
      // Invalidate to start polling with new status
      queryClient.invalidateQueries({ queryKey: ['orchestrator', 'status', threadId] });
      queryClient.invalidateQueries({ queryKey: ['orchestrator', 'runs', threadId] });
    },
  });
};

export const usePauseOrchestrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const response = await api.post<{ data: Schedule }>(`/api/orchestrator/threads/${threadId}/pause`);
      return response.data.data;
    },
    // Optimistic update
    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: ['orchestrator', 'status', threadId] });
      const previous = queryClient.getQueryData<OrchestratorStatus>(['orchestrator', 'status', threadId]);
      
      if (previous) {
        queryClient.setQueryData(['orchestrator', 'status', threadId], {
          ...previous,
          schedule: { ...previous.schedule, status: 'paused' }
        });
      }
      return { previous };
    },
    onError: (_, threadId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['orchestrator', 'status', threadId], context.previous);
      }
    },
    onSettled: (_, __, threadId) => {
      queryClient.invalidateQueries({ queryKey: ['orchestrator', 'status', threadId] });
    },
  });
};

export const useResumeOrchestrator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const response = await api.post<{ data: Schedule }>(`/api/orchestrator/threads/${threadId}/resume`);
      return response.data.data;
    },
    onMutate: async (threadId) => {
      await queryClient.cancelQueries({ queryKey: ['orchestrator', 'status', threadId] });
      const previous = queryClient.getQueryData<OrchestratorStatus>(['orchestrator', 'status', threadId]);
      
      if (previous) {
        queryClient.setQueryData(['orchestrator', 'status', threadId], {
          ...previous,
          schedule: { ...previous.schedule, status: 'active' }
        });
      }
      return { previous };
    },
    onError: (_, threadId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['orchestrator', 'status', threadId], context.previous);
      }
    },
    onSettled: (_, __, threadId) => {
      queryClient.invalidateQueries({ queryKey: ['orchestrator', 'status', threadId] });
    },
  });
};
