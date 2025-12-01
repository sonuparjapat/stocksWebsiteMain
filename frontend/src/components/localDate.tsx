// src/components/LocalDate.tsx
'use client';
import { useEffect, useState } from 'react';

export default function LocalDate({ iso, options = {} }: { iso?: string | null; options?: Intl.DateTimeFormatOptions }) {
  const [formatted, setFormatted] = useState<string>('');
  useEffect(() => {
    if (!iso) { setFormatted('—'); return; }
    try {
      const d = new Date(iso);
      setFormatted(d.toLocaleDateString('en-IN', options));
    } catch {
      setFormatted(String(iso));
    }
  }, [iso, JSON.stringify(options)]);
  return <span>{formatted}</span>;
}