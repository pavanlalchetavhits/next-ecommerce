'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetInterval: number = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
          setCopiedText(null);
        }, resetInterval);

        return true;
      } catch (error) {
        console.error('Failed to copy text:', error);
        setIsCopied(false);
        setCopiedText(null);
        return false;
      }
    },
    [resetInterval]
  );

  return { isCopied, copiedText, copy };
}
