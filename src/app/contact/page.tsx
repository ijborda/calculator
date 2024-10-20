'use client';

import { Paper, Skeleton, StackVertical, Link } from '@/components';
import { logger } from '@/utils/logger';
import { Typography } from '@mui/material';
import React from 'react';

/**
 * Head Page
 */
export default function Page() {
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
      await logger.call(async () => {
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
      <Paper>
        <Typography>
          Noticed something wrong? Want to request another calculator or tool to
          be created?{' '}
          <Link href='mailto:imari.borda2018@gmail.com'>
            Let me know via email
          </Link>
        </Typography>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
