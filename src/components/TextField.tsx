import React, { type ReactElement } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

interface Props {
  className?: string;
  prefix?: string;
}

export default function Component(props: Props & TextFieldProps): ReactElement {
  return (
    <>
      <TextField
        className={props.className ?? ''}
        id={props.id}
        label={props.label}
        type={props.type ?? 'text'}
        variant={props.variant ?? 'outlined'}
        size={props.size ?? 'small'}
        fullWidth={props.fullWidth ?? true}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={
          props.prefix
            ? {
                startAdornment: (
                  <InputAdornment position='start'>
                    {props.prefix}
                  </InputAdornment>
                ),
              }
            : undefined
        }
        margin='none'
        sx={props.sx}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        error={props.error}
        helperText={props.helperText}
        disabled={props.disabled}
        multiline={props.multiline}
        rows={props.rows}
        minRows={props.minRows || (props.multiline ? 6 : undefined)}
        maxRows={props.maxRows || (props.multiline ? 10 : undefined)}
      />
    </>
  );
}
