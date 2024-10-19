import {
  ButtonProps,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  useTheme,
} from '@mui/material';
import React, { type ReactElement } from 'react';

interface Props {
  title?: string;
  open: boolean;
  text: ReactElement;
  handlerCancel: React.MouseEventHandler<HTMLButtonElement> | undefined;
  handlerConfirm: React.MouseEventHandler<HTMLButtonElement> | undefined;
  paddingBase?: number;
}

export default function Component(props: Props & ButtonProps): ReactElement {
  /**
   * Declarations
   */
  const theme = useTheme();

  return (
    <Dialog maxWidth='xs' open={props.open}>
      {props.title && <DialogTitle variant='h3'>{props.title}</DialogTitle>}
      <DialogContent
        dividers
        sx={{
          paddingTop: props.paddingBase ? props.paddingBase : 4,
          paddingBottom: props.paddingBase ? props.paddingBase : 4,
          [theme.breakpoints.down('md')]: {
            paddingTop: props.paddingBase ? props.paddingBase * 0.67 : 2,
            paddingBottom: props.paddingBase ? props.paddingBase * 0.67 : 2,
          },
          [theme.breakpoints.down('sm')]: {
            paddingTop: props.paddingBase ? props.paddingBase * 0.33 : 1,
            paddingBottom: props.paddingBase ? props.paddingBase * 0.33 : 1,
          },
        }}
      >
        {props.text}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handlerConfirm}>Confirm</Button>
        <Button onClick={props.handlerCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
