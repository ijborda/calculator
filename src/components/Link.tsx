import React, { type ReactElement } from 'react';
import { Link, LinkProps } from '@mui/material';

interface Props {
  className?: string;
  openInNewTab?: boolean;
}

export default function Component(props: Props & LinkProps): ReactElement {
  return (
    <>
      <Link
        className={props.className ?? ''}
        target={props.openInNewTab ? undefined : '_blank'}
        href={props.href}
        sx={{
          display: 'block',
        }}
      >
        {props.children}
      </Link>
    </>
  );
}
