'use client';

import { Paper, Skeleton, StackVertical, Link, Image } from '@/components';
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
        <StackVertical spacing={5}>
          <Typography>
            Noticed something wrong? Want to request another calculator or tool
            to be created?{' '}
            <Link href='mailto:imari.borda2018@gmail.com'>
              Let me know via email
            </Link>
          </Typography>
          <div>
            <StackVertical spacing={1.5}>
              <Typography>Want to support?</Typography>
              <Link href='https://www.buymeacoffee.com/ijborda'>
                {/* TODO: Make this img component of next/image*/}
                <img
                  src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'
                  alt='Buy Me A Coffee'
                  width={200}
                  // aspectRatio={545 / 152}
                />
              </Link>
            </StackVertical>
          </div>
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
