'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export interface UseFetchOptions<T> {
  enabled?: boolean;
  initialData?: T;
  cacheTimeMs?: number;
}

// In-memory cache & pending promises map to deduplicate parallel API calls across components
const fetchCache = new Map<string, { data: any; timestamp: number }>();
const pendingPromises = new Map<string, Promise<any>>();

export function useFetch<T = any>(url: string, options: UseFetchOptions<T> = {}) {
  const { enabled = true, initialData = null, cacheTimeMs = 30000 } = options;

  const cached = url ? fetchCache.get(url) : null;
  const isCacheValid = cached ? Date.now() - cached.timestamp < cacheTimeMs : false;

  const [data, setData] = useState<T | null>(isCacheValid ? cached!.data : (initialData as T | null));
  const [loading, setLoading] = useState<boolean>(enabled && !isCacheValid);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (ignoreCache = false) => {
      if (!url) return;

      const cacheEntry = fetchCache.get(url);
      if (!ignoreCache && cacheEntry && Date.now() - cacheEntry.timestamp < cacheTimeMs) {
        setData(cacheEntry.data);
        setLoading(false);
        return;
      }

      // Deduplicate pending parallel HTTP requests for the exact same URL
      if (pendingPromises.has(url)) {
        try {
          setLoading(true);
          const result = await pendingPromises.get(url)!;
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch data');
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const promise = api
          .get(url)
          .then((res) => {
            const resultData = res.data?.data !== undefined ? res.data.data : res.data;
            fetchCache.set(url, { data: resultData, timestamp: Date.now() });
            pendingPromises.delete(url);
            return resultData;
          })
          .catch((err) => {
            pendingPromises.delete(url);
            throw err;
          });

        pendingPromises.set(url, promise);
        const resultData = await promise;
        setData(resultData);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    },
    [url, cacheTimeMs]
  );

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return { data, loading, error, refetch: () => fetchData(true) };
}
