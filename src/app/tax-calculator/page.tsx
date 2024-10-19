'use client';

import { Skeleton, StackVertical } from '@/components';
import { errorLogger } from '@/libs';
import React from 'react';

/**
 * Head Page
 */
export default function Page() {
  /**
   * Declarations
   */

  /**
   * States
   */
  const [isReady, setIsReady] = React.useState(false);

  /**
   * Side effects
   */
  React.useEffect(() => {
    // Fetch announcements
    const fn = async () => {
      await errorLogger.call(async () => {
        if (ignore) return;
        setIsReady(true);
      });
    };
    let ignore = false;
    fn();
    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Component
   */
  const mainComp = (
    <StackVertical horizontalSpacing='stretch' spacing={3}>
      Hi
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
