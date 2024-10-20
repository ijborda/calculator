'use client';

import {
  Button,
  Paper,
  SecondaryTitle,
  Skeleton,
  StackHorizontal,
  StackVertical,
  TextField,
} from '@/components';
import { logger } from '@/utils/logger';
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
        <StackVertical horizontalSpacing='center' spacing={5}>
          <SecondaryTitle title='Tax Calculator' />
          <StackHorizontal>
            <TextField label='Annual Taxable Income' prefix='₱'></TextField>
          </StackHorizontal>
          <Button>Calculate</Button>
        </StackVertical>
      </Paper>
    </StackVertical>
  );

  return <>{isReady ? mainComp : <Skeleton />}</>;
}
