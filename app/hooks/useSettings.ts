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

// Global in-memory cache to prevent duplicate HTTP requests across multiple component mounts
let settingsCache: StoreSettings | null = null;
let settingsPromise: Promise<StoreSettings> | null = null;

async function loadSettings(): Promise<StoreSettings> {
  if (settingsCache) return settingsCache;
  if (settingsPromise) return settingsPromise;

  settingsPromise = api
    .get('/api/settings')
    .then((res) => {
      const data = res.data?.data || res.data || {};
      settingsCache = data;
      settingsPromise = null;
      return data;
    })
    .catch((err) => {
      settingsPromise = null;
      throw err;
    });

  return settingsPromise;
}

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings>(settingsCache || {});
  const [loading, setLoading] = useState<boolean>(!settingsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (settingsCache) {
      setSettings(settingsCache);
      setLoading(false);
      return;
    }

    loadSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load site settings');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading, error };
}
