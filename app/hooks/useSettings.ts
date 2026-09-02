'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface StoreSettings {
  store_name?: string;
  store_tagline?: string;
  support_email?: string;
  support_phone?: string;
  store_address?: string;
  currency?: string;
  currency_symbol?: string;
  shipping_fee?: string;
  free_shipping_threshold?: string;
  shipping_note?: string;
  enable_tax?: string;
  tax_rate?: string;
  enable_cod?: string;
  min_order_amount?: string;
  maintenance_mode?: string;
  notification_email?: string;
  low_stock_threshold?: string;
  [key: string]: string | undefined;
}

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await api.get('/api/settings');
        if (isMounted) {
          const data = res.data?.data || res.data || {};
          setSettings(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load site settings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading, error };
}
