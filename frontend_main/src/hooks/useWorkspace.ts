import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Workspace {
  workspace_id: string;
  narrative_id: string;
  owner_id: string;
  thread_id: string;
  portfolio_id: string;
  base_currency: 'USD' | 'NGN';
  version: number;
  current_narrative_object_key: string;
  current_portfolio_object_key: string;
  current_execution_plan_object_key: string;
  current_logs_object_key: string;
  created_at: string;
  updated_at: string;
}

export interface NarrativeRecord {
  narrative_id: string;
  owner_id: string;
  compiler_thread_id?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/** List all workspaces for the current user (newest first) */
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await api.get<{ data: Workspace[] }>('/api/workspaces');
      return response.data.data;
    },
  });
};

export const useWorkspace = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = await api.get<{ data: Workspace }>(`/api/workspaces/${workspaceId}`);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
};

export const useWorkspaceFile = (workspaceId?: string, fileName?: 'narrative' | 'portfolio' | 'execution_plan' | 'logs') => {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'file', fileName],
    queryFn: async () => {
      if (!workspaceId || !fileName) return null;
      const response = await api.get<{ data: { object_key: string; content_type: string; content: string } }>(
        `/api/workspaces/${workspaceId}/files/${fileName}`
      );
      // Try parsing JSON content
      try {
        return {
          ...response.data.data,
          parsedContent: JSON.parse(response.data.data.content)
        };
      } catch (e) {
        return response.data.data;
      }
    },
    enabled: !!workspaceId && !!fileName,
  });
};

/** List all narratives for the current user (newest first) */
export const useNarratives = () => {
  return useQuery({
    queryKey: ['narratives'],
    queryFn: async () => {
      const response = await api.get<{ data: NarrativeRecord[] }>('/api/narratives');
      return response.data.data;
    },
  });
};

/** Get a single narrative by ID */
export const useNarrative = (narrativeId?: string) => {
  return useQuery({
    queryKey: ['narrative', narrativeId],
    queryFn: async () => {
      if (!narrativeId) return null;
      const response = await api.get<{ data: NarrativeRecord }>(`/api/narratives/${narrativeId}`);
      return response.data.data;
    },
    enabled: !!narrativeId,
  });
};

export const useBootstrapWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ narrativeId, thread_id, base_currency = 'USD' }: { narrativeId: string; thread_id: string; base_currency?: 'USD' | 'NGN' }) => {
      const response = await api.post<{ data: { workspace: Workspace; reused: boolean } }>(
        `/api/narratives/${narrativeId}/workspace`,
        { thread_id, base_currency }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['workspace', data.workspace.workspace_id], data.workspace);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

/** Deposit funds into a workspace */
export const useDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, amount, note }: { workspaceId: string; amount: number; note?: string }) => {
      const response = await api.post<{ data: { portfolio: any; log_id: string } }>(
        `/api/workspaces/${workspaceId}/deposit`,
        { amount, note }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'file', 'portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'file', 'logs'] });
    },
  });
};

/** Withdraw funds from a workspace */
export const useWithdraw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, amount, note }: { workspaceId: string; amount: number; note?: string }) => {
      const response = await api.post<{ data: { portfolio: any; log_id: string } }>(
        `/api/workspaces/${workspaceId}/withdraw`,
        { amount, note }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'file', 'portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'file', 'logs'] });
    },
  });
};
