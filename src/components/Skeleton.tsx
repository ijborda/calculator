import React, { type ReactElement } from 'react';
import { Color, Skeleton } from '@mui/material';
import { StackVertical } from '.';

interface Props {
  className?: string;
  height?: number;
  rowCount?: number;
  color?: string;
}

export default function Component(props: Props): ReactElement {
  return (
    <StackVertical spacing={2}>
      {Array.from({ length: props.rowCount || 5 }).map((_, i) => (
        <Skeleton
          sx={props.color ? { bgcolor: props.color } : undefined}
          width='100%'
          height={props.height || '128px'}
          variant='rounded'
          key={i}
        ></Skeleton>
      ))}
    </StackVertical>
  );
}
