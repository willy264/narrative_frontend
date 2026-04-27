import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CompilerThread } from './useCompiler';
import { getAuth } from 'firebase/auth';

/**
 * SSE hook for GET /api/compiler/threads/:threadId/stream
 * 
 * Emits:
 *   - `thread_updated`  → full CompilerThread record
 *   - `thread_error`    → runtime failure
 *   - heartbeat comments every 30s
 *
 * This hook connects an EventSource and pushes updates
 * directly into the TanStack Query cache for ['compiler', threadId].
 */
export function useCompilerStream(threadId: string | null | undefined) {
  const queryClient = useQueryClient();
  const sourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(async () => {
    if (!threadId) return;

    // Close any existing connection
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }

    const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

    // Get auth token for the SSE URL
    let token = '';
    try {
      const user = getAuth().currentUser;
      if (user) {
        token = await user.getIdToken(false);
      }
    } catch {
      // In dev mode, token may not be needed
    }

    const url = new URL(`/api/compiler/threads/${threadId}/stream`, baseURL);
    if (token) {
      url.searchParams.set('token', token);
    }

    const es = new EventSource(url.toString());
    sourceRef.current = es;

    es.addEventListener('thread_updated', (event) => {
      try {
        const payload = JSON.parse(event.data);
        const thread: CompilerThread = payload.data ?? payload;
        // Push into the TanStack Query cache
        queryClient.setQueryData(['compiler', threadId], thread);
        // Also invalidate the threads list so sidebar updates
        queryClient.invalidateQueries({ queryKey: ['compiler', 'threads'] });
      } catch (e) {
        console.warn('[SSE] Failed to parse thread_updated payload', e);
      }
    });

    es.addEventListener('thread_error', (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.error('[SSE] thread_error:', payload);
      } catch {
        console.error('[SSE] thread_error (raw):', event.data);
      }
    });

    es.onerror = () => {
      // EventSource auto-reconnects on transient failures.
      // Only close on terminal states.
      if (es.readyState === EventSource.CLOSED) {
        sourceRef.current = null;
      }
    };
  }, [threadId, queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
    };
  }, [connect]);

  /** Force reconnect (e.g. after token refresh) */
  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  return { reconnect };
}
