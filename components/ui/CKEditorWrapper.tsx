'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

const CKEditorInner = dynamic(
  () => import('@/components/ui/CKEditorInner'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border border-[#E9EDF7] bg-[#F8FAFC] p-4 text-xs font-semibold text-[#64748B]">
        <Loader2 className="h-5 w-5 animate-spin text-[#6366F1] mr-2" />
        <span>Loading Rich Text Editor...</span>
      </div>
    ),
  }
);

export default function CKEditorWrapper(props: CKEditorWrapperProps) {
  return <CKEditorInner {...props} />;
}
