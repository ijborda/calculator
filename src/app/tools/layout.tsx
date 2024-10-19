'use client';

import { Navigation } from '@/widgets';
import React from 'react';
import { sidebarItems } from '@/constants/sidebars';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation sidebarLinks={sidebarItems}>{children}</Navigation>
    </>
  );
}
