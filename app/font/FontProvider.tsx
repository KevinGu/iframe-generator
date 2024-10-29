'use client';

import { ReactNode } from 'react';
import { FontContext, FontClassType } from './fontContext';

export default function FontProvider({ children, fontClass }: { children: ReactNode, fontClass: FontClassType }) {
  return (
    <FontContext.Provider value={fontClass}>
      {children}
    </FontContext.Provider>
  );
}
