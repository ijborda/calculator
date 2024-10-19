'use client';

import { Button, H2, StackVertical, Subtitle } from '@/components';
import { Box } from '@mui/material';

export default function Page() {
  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: 1,
        }}
      >
        <StackVertical
          horizontalSpacing='center'
          spacing={4}
          sx={{ maxWidth: '500px', width: '100%' }}
        >
          <H2 title='Oops! Page Not Found!' />
          <Subtitle text='It looks like your are trying to access a page that was has been deleted or never even existed.' />
          <Box>
            <Button href='/tools'>Go back to home</Button>
          </Box>
        </StackVertical>
      </Box>
    </main>
  );
}
