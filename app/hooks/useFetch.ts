'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export interface UseFetchOptions<T> {
  enabled?: boolean;
  initialData?: T;
}

export function useFetch<T = any>(url: string, options: UseFetchOptions<T> = {}) {
  const { enabled = true, initialData = null } = options;

  const [data, setData] = useState<T | null>(initialData as T | null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(url);
      const resultData = res.data?.data !== undefined ? res.data.data : res.data;
      setData(resultData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  return { data, loading, error, refetch: fetchData };
}
